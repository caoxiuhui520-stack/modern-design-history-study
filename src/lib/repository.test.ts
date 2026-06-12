import "fake-indexeddb/auto";
import { StudyDatabase } from "./localDb";
import { LocalStudyRepository } from "./repository";

it("persists attempts and daily sessions across repository instances", async () => {
  const name = `study-test-${crypto.randomUUID()}`;
  const firstDb = new StudyDatabase(name);
  const first = new LocalStudyRepository(firstDb);
  await first.saveAttempt({
    id: "attempt-1",
    questionId: "bauhaus-choice",
    topicIds: ["bauhaus"],
    score: 1,
    answer: "包豪斯",
    createdAt: "2026-06-11T08:00:00Z",
  });
  await first.saveDailySession({
    date: "2026-06-11",
    completedStages: ["recall"],
    currentIndex: 3,
    updatedAt: "2026-06-11T08:10:00Z",
  });
  firstDb.close();

  const secondDb = new StudyDatabase(name);
  const second = new LocalStudyRepository(secondDb);
  expect(await second.listAttempts()).toHaveLength(1);
  expect(await second.getDailySession("2026-06-11")).toMatchObject({ currentIndex: 3 });
  await secondDb.delete();
});

