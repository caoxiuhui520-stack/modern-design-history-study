import type { Flashcard } from "../domain/types";
import { topics } from "./course";

export const cards: Flashcard[] = topics.flatMap((topic) => [
  {
    id: `${topic.id}-definition`,
    topicId: topic.id,
    front: `${topic.title}是什么？`,
    back: `${topic.period}。${topic.summary}`,
  },
  {
    id: `${topic.id}-features`,
    topicId: topic.id,
    front: `${topic.title}的核心特征有哪些？`,
    back: topic.features.join("；"),
  },
]);

