import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Question } from "../../domain/types";
import { QuestionRunner } from "./QuestionRunner";

const question: Question = {
  id: "arts-crafts-term",
  type: "term",
  topicIds: ["arts-crafts"],
  prompt: "名词解释：英国工艺美术运动",
  scoringPoints: ["19世纪50年代", "抵制工业化威胁", "哥特与手工艺"],
  referenceAnswer: "工艺美术运动缘起于19世纪50年代的英国。",
  explanation: "覆盖背景、主张和特点。",
};

it("reveals subjective feedback only after an answer is submitted", async () => {
  const user = userEvent.setup();
  render(<QuestionRunner question={question} onComplete={() => undefined} />);
  expect(screen.queryByText(question.referenceAnswer)).not.toBeInTheDocument();
  await user.type(screen.getByLabelText("你的答案"), "反对机械化，重视手工艺。");
  await user.click(screen.getByRole("button", { name: "提交答案" }));
  expect(screen.getByText(question.referenceAnswer)).toBeInTheDocument();
  expect(screen.getByLabelText("19世纪50年代")).toBeInTheDocument();
});

