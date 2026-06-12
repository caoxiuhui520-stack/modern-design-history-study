export type QuestionType = "choice" | "blank" | "term" | "short" | "essay";
export type SelfRating = "known" | "unsure" | "unknown";

export interface Topic {
  id: string;
  section: string;
  title: string;
  period: string;
  summary: string;
  features: string[];
  people: string[];
  works: string[];
  compare?: string;
}

export interface Flashcard {
  id: string;
  topicId: string;
  front: string;
  back: string;
}

interface QuestionBase {
  id: string;
  type: QuestionType;
  topicIds: string[];
  prompt: string;
  explanation: string;
}

export type Question =
  | (QuestionBase & { type: "choice"; options: string[]; answerIndex: number })
  | (QuestionBase & { type: "blank"; acceptedAnswers: string[] })
  | (QuestionBase & { type: "term" | "short" | "essay"; scoringPoints: string[]; referenceAnswer: string });

export interface MasterySnapshot {
  topicId: string;
  mastery: number;
  nextReviewAt: string;
  successStreak: number;
  reviewCount?: number;
  lastReviewedAt?: string;
  updatedAt?: string;
}

export interface Attempt {
  id: string;
  questionId: string;
  topicIds: string[];
  score: number;
  selfRating?: SelfRating;
  answer: string;
  createdAt: string;
}

export interface DailySession {
  date: string;
  completedStages: string[];
  currentIndex: number;
  updatedAt: string;
}

export interface MistakeItem {
  id: string;
  questionId: string;
  topicId: string;
  reason: "wrong" | "unsure";
  status: "open" | "resolved";
  updatedAt: string;
}

