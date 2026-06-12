import { mergeProgress, type PersistedProgress } from "./sync";

it("deduplicates attempts and keeps the newest mistake state", () => {
  const local: PersistedProgress = {
    attempts: [{ id: "a1", questionId: "q1", topicIds: ["t1"], answer: "x", score: 0, createdAt: "2026-06-11T08:00:00Z" }],
    mistakes: [{ id: "m1", questionId: "q1", topicId: "t1", reason: "wrong", status: "open", updatedAt: "2026-06-11T08:00:00Z" }],
    completedToday: 3,
  };
  const remote: PersistedProgress = {
    attempts: [
      local.attempts[0],
      { id: "a2", questionId: "q2", topicIds: ["t2"], answer: "y", score: 1, createdAt: "2026-06-11T09:00:00Z" },
    ],
    mistakes: [{ ...local.mistakes[0], status: "resolved", updatedAt: "2026-06-11T10:00:00Z" }],
    completedToday: 5,
  };
  const merged = mergeProgress(local, remote);
  expect(merged.attempts.map((item) => item.id)).toEqual(["a1", "a2"]);
  expect(merged.mistakes[0].status).toBe("resolved");
  expect(merged.completedToday).toBe(5);
});

