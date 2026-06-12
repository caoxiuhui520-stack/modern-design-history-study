import { buildDailyPlan } from "./dailyPlan";

it("prioritizes overdue mistakes and creates three study stages", () => {
  const plan = buildDailyPlan({
    date: "2026-06-11",
    mastery: [
      { topicId: "bauhaus", mastery: 20, nextReviewAt: "2026-06-01T00:00:00Z", successStreak: 0 },
    ],
    mistakeTopicIds: ["bauhaus"],
  });
  expect(plan.stages.map((stage) => stage.kind)).toEqual(["recall", "mixed", "mistakes"]);
  expect(plan.focusTopicIds[0]).toBe("bauhaus");
  expect(plan.estimatedMinutes).toBe(30);
});

