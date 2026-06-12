import { cards } from "./cards";
import { topics } from "./course";
import { questions } from "./questions";

it("covers the syllabus with linked study material", () => {
  const topicIds = new Set(topics.map((topic) => topic.id));
  expect(topics.length).toBeGreaterThanOrEqual(20);
  expect(cards.length).toBeGreaterThanOrEqual(35);
  expect(questions.length).toBeGreaterThanOrEqual(50);
  expect(new Set(questions.map((question) => question.type))).toEqual(
    new Set(["choice", "blank", "term", "short", "essay"]),
  );
  expect(cards.every((card) => topicIds.has(card.topicId))).toBe(true);
  expect(questions.every((question) => question.topicIds.every((id) => topicIds.has(id)))).toBe(true);
});

