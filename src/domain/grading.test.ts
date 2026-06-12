import { gradeBlank, normalizeBlankAnswer, scoreSubjective } from "./grading";

it("normalizes only safe blank-answer differences", () => {
  expect(normalizeBlankAnswer(" 包豪斯。 ")).toBe("包豪斯");
  expect(gradeBlank(["Bauhaus", "包豪斯"], " BAUHAUS ")).toEqual({ correct: true, score: 1 });
  expect(gradeBlank(["包豪斯"], "包豪斯学院")).toEqual({ correct: false, score: 0 });
});

it("scores subjective answers from checked points", () => {
  expect(scoreSubjective(4, [0, 2])).toBe(0.5);
});

