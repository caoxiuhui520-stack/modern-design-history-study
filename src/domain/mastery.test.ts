import { applyAttemptToMastery } from "./mastery";

it("schedules incorrect material for tomorrow", () => {
  const result = applyAttemptToMastery(undefined, { score: 0, selfRating: "unknown" }, new Date("2026-06-11T08:00:00Z"));
  expect(result.mastery).toBeLessThan(30);
  expect(result.nextReviewAt.startsWith("2026-06-12")).toBe(true);
});

it("extends intervals after repeated success", () => {
  const first = applyAttemptToMastery(undefined, { score: 1, selfRating: "known" }, new Date("2026-06-11T08:00:00Z"));
  const second = applyAttemptToMastery(first, { score: 1, selfRating: "known" }, new Date("2026-06-13T08:00:00Z"));
  expect(second.mastery).toBeGreaterThan(first.mastery);
  expect(second.nextReviewAt.startsWith("2026-06-17")).toBe(true);
});

