import type { Attempt, DailySession, MasterySnapshot, MistakeItem } from "../domain/types";
import type { StudyDatabase } from "./localDb";

export class LocalStudyRepository {
  constructor(private readonly db: StudyDatabase) {}

  async saveAttempt(attempt: Attempt) {
    await this.db.transaction("rw", this.db.attempts, this.db.syncQueue, async () => {
      await this.db.attempts.put(attempt);
      await this.queue("attempt", attempt.id, attempt);
    });
  }

  listAttempts() {
    return this.db.attempts.toArray();
  }

  async upsertMastery(record: MasterySnapshot) {
    const existing = await this.db.mastery.get(record.topicId);
    if (!existing?.updatedAt || !record.updatedAt || record.updatedAt >= existing.updatedAt) {
      await this.db.mastery.put(record);
      await this.queue("mastery", record.topicId, record);
    }
  }

  listMastery() {
    return this.db.mastery.toArray();
  }

  async saveDailySession(session: DailySession) {
    await this.db.dailySessions.put(session);
    await this.queue("dailySession", session.date, session);
  }

  getDailySession(date: string) {
    return this.db.dailySessions.get(date);
  }

  async upsertMistake(item: MistakeItem) {
    await this.db.mistakes.put(item);
    await this.queue("mistake", item.id, item);
  }

  async listMistakes(status?: "open" | "resolved") {
    return status ? this.db.mistakes.where("status").equals(status).toArray() : this.db.mistakes.toArray();
  }

  private async queue(entity: "attempt" | "mastery" | "dailySession" | "mistake", key: string, payload: unknown) {
    await this.db.syncQueue.put({
      id: `${entity}:${key}`,
      entity,
      payload,
      createdAt: new Date().toISOString(),
    });
  }
}

export const createLocalRepository = async () => {
  const { studyDb } = await import("./localDb");
  return new LocalStudyRepository(studyDb);
};

