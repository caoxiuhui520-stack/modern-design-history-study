import type { MasterySnapshot, SelfRating } from "./types";

function addUtcDays(date: Date, days: number) {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result.toISOString();
}

export function applyAttemptToMastery(
  previous: MasterySnapshot | undefined,
  signal: { score: number; selfRating?: SelfRating },
  now: Date,
): MasterySnapshot {
  const success = signal.score >= 0.7 && signal.selfRating !== "unknown";
  const successStreak = success ? (previous?.successStreak ?? 0) + 1 : 0;
  const intervals = [1, 2, 4, 7, 14];
  const days = success ? intervals[Math.min(successStreak, intervals.length - 1)] : 1;
  const ratingAdjustment = signal.selfRating === "known" ? 8 : signal.selfRating === "unknown" ? -12 : 0;
  const base = previous?.mastery ?? 20;
  const mastery = Math.max(0, Math.min(100, Math.round(base + signal.score * 18 - (1 - signal.score) * 20 + ratingAdjustment)));

  return {
    topicId: previous?.topicId ?? "",
    mastery,
    successStreak,
    reviewCount: (previous?.reviewCount ?? 0) + 1,
    lastReviewedAt: now.toISOString(),
    nextReviewAt: addUtcDays(now, days),
    updatedAt: now.toISOString(),
  };
}

