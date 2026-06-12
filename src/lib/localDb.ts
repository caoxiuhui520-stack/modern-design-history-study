import Dexie, { type EntityTable } from "dexie";
import type { Attempt, DailySession, MasterySnapshot, MistakeItem } from "../domain/types";

export interface SyncQueueItem {
  id: string;
  entity: "attempt" | "mastery" | "dailySession" | "mistake";
  payload: unknown;
  createdAt: string;
}

export class StudyDatabase extends Dexie {
  attempts!: EntityTable<Attempt, "id">;
  mastery!: EntityTable<MasterySnapshot, "topicId">;
  dailySessions!: EntityTable<DailySession, "date">;
  mistakes!: EntityTable<MistakeItem, "id">;
  syncQueue!: EntityTable<SyncQueueItem, "id">;

  constructor(name = "modern-design-history-study") {
    super(name);
    this.version(1).stores({
      attempts: "id, createdAt, *topicIds",
      mastery: "topicId, nextReviewAt, updatedAt",
      dailySessions: "date, updatedAt",
      mistakes: "id, questionId, topicId, status, updatedAt",
      syncQueue: "id, entity, createdAt",
    });
  }
}

export const studyDb = new StudyDatabase();

