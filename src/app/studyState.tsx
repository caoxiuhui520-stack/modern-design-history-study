import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Attempt, MistakeItem } from "../domain/types";
import { supabase } from "../lib/supabase";
import { syncProgress, type PersistedProgress } from "../lib/sync";

interface StudyState {
  attempts: Attempt[];
  mistakes: MistakeItem[];
  completedToday: number;
  syncStatus: "local" | "syncing" | "synced" | "pending";
  recordAttempt: (attempt: Attempt, uncertain: boolean) => void;
}

const STORAGE_KEY = "modern-design-history-progress-v1";
const initial: PersistedProgress = { attempts: [] as Attempt[], mistakes: [] as MistakeItem[], completedToday: 0 };
const StudyContext = createContext<StudyState | null>(null);

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "") as typeof initial;
  } catch {
    return initial;
  }
}

export function StudyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(loadState);
  const [userId, setUserId] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<StudyState["syncStatus"]>(supabase ? "pending" : "local");

  useEffect(() => {
    if (!supabase) return;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user.id ?? null);
      setSyncStatus(session ? "syncing" : "pending");
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!supabase || !userId) return;
    let cancelled = false;
    setSyncStatus("syncing");
    syncProgress(supabase, userId, state).then((merged) => {
      if (cancelled) return;
      if (JSON.stringify(merged) !== JSON.stringify(state)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        setState(merged);
      }
      setSyncStatus("synced");
    }).catch(() => {
      if (!cancelled) setSyncStatus("pending");
    });
    return () => { cancelled = true; };
  }, [state, userId]);
  const value = useMemo<StudyState>(() => ({
    ...state,
    syncStatus,
    recordAttempt(attempt, uncertain) {
      setState((current) => {
        const mistake = attempt.score < 1 || uncertain
          ? {
              id: `mistake:${attempt.questionId}`,
              questionId: attempt.questionId,
              topicId: attempt.topicIds[0],
              reason: attempt.score < 1 ? "wrong" as const : "unsure" as const,
              status: "open" as const,
              updatedAt: attempt.createdAt,
            }
          : undefined;
        const next = {
          attempts: [...current.attempts.filter((item) => item.id !== attempt.id), attempt],
          mistakes: mistake
            ? [...current.mistakes.filter((item) => item.id !== mistake.id), mistake]
            : current.mistakes,
          completedToday: current.completedToday + 1,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
  }), [state, syncStatus]);

  return <StudyContext value={value}>{children}</StudyContext>;
}

export function useStudy() {
  const value = useContext(StudyContext);
  if (!value) throw new Error("useStudy must be used inside StudyProvider");
  return value;
}
