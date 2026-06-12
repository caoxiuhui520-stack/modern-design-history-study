import type { SupabaseClient } from "@supabase/supabase-js";
import type { Attempt, MistakeItem } from "../domain/types";

export interface PersistedProgress {
  attempts: Attempt[];
  mistakes: MistakeItem[];
  completedToday: number;
}

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function latestById<T extends { id: string; updatedAt?: string }>(left: T[], right: T[]) {
  const records = new Map<string, T>();
  for (const item of [...left, ...right]) {
    const existing = records.get(item.id);
    if (!existing || (item.updatedAt ?? "") >= (existing.updatedAt ?? "")) records.set(item.id, item);
  }
  return [...records.values()];
}

export function mergeProgress(local: PersistedProgress, remote: PersistedProgress): PersistedProgress {
  const attempts = new Map(local.attempts.map((item) => [item.id, item]));
  for (const attempt of remote.attempts) attempts.set(attempt.id, attempt);
  return {
    attempts: [...attempts.values()].sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    mistakes: latestById(local.mistakes, remote.mistakes),
    completedToday: Math.max(local.completedToday, remote.completedToday),
  };
}

export async function syncProgress(client: SupabaseClient, userId: string, local: PersistedProgress): Promise<PersistedProgress> {
  if (local.attempts.length) {
    const { error } = await client.from("attempts").upsert(local.attempts.map((attempt) => ({
      id: attempt.id,
      user_id: userId,
      question_id: attempt.questionId,
      topic_ids: attempt.topicIds,
      answer: attempt.answer,
      score: attempt.score,
      self_rating: attempt.selfRating ?? null,
      created_at: attempt.createdAt,
    })), { onConflict: "id" });
    if (error) throw error;
  }
  if (local.mistakes.length) {
    const { error } = await client.from("mistake_items").upsert(local.mistakes.map((item) => ({
      id: item.id,
      user_id: userId,
      question_id: item.questionId,
      topic_id: item.topicId,
      reason: item.reason,
      status: item.status,
      updated_at: item.updatedAt,
    })), { onConflict: "id" });
    if (error) throw error;
  }
  const today = localDateKey();
  const { error: dailyError } = await client.from("daily_sessions").upsert({
    user_id: userId,
    session_date: today,
    completed_stages: [],
    current_index: local.completedToday,
    updated_at: new Date().toISOString(),
  }, { onConflict: "user_id,session_date" });
  if (dailyError) throw dailyError;

  const [attemptResponse, mistakeResponse, dailyResponse] = await Promise.all([
    client.from("attempts").select("*"),
    client.from("mistake_items").select("*"),
    client.from("daily_sessions").select("*").eq("session_date", today).maybeSingle(),
  ]);
  const error = attemptResponse.error ?? mistakeResponse.error ?? dailyResponse.error;
  if (error) throw error;

  const remote: PersistedProgress = {
    attempts: (attemptResponse.data ?? []).map((row) => ({
      id: row.id,
      questionId: row.question_id,
      topicIds: row.topic_ids,
      answer: row.answer,
      score: Number(row.score),
      selfRating: row.self_rating ?? undefined,
      createdAt: row.created_at,
    })),
    mistakes: (mistakeResponse.data ?? []).map((row) => ({
      id: row.id,
      questionId: row.question_id,
      topicId: row.topic_id,
      reason: row.reason,
      status: row.status,
      updatedAt: row.updated_at,
    })),
    completedToday: dailyResponse.data?.current_index ?? 0,
  };
  return mergeProgress(local, remote);
}
