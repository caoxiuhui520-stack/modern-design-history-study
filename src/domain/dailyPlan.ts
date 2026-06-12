import type { MasterySnapshot } from "./types";

interface DailyPlanInput {
  date: string;
  mastery: MasterySnapshot[];
  mistakeTopicIds: string[];
}

export function buildDailyPlan(input: DailyPlanInput) {
  const now = new Date(`${input.date}T00:00:00Z`).getTime();
  const mistakes = new Set(input.mistakeTopicIds);
  const focusTopicIds = [...input.mastery]
    .sort((a, b) => {
      const score = (item: MasterySnapshot) => {
        const overdueDays = Math.max(0, (now - new Date(item.nextReviewAt).getTime()) / 86_400_000);
        return overdueDays * 10 + (100 - item.mastery) + (mistakes.has(item.topicId) ? 30 : 0);
      };
      return score(b) - score(a);
    })
    .map((item) => item.topicId);

  return {
    date: input.date,
    estimatedMinutes: 30,
    focusTopicIds,
    stages: [
      { kind: "recall" as const, minutes: 8 },
      { kind: "mixed" as const, minutes: 15 },
      { kind: "mistakes" as const, minutes: 7 },
    ],
  };
}
