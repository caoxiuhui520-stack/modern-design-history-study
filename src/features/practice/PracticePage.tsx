import { useMemo, useState } from "react";
import { questions } from "../../data/questions";
import type { QuestionType } from "../../domain/types";
import { QuestionRunner } from "./QuestionRunner";
import { useStudy } from "../../app/studyState";

const filters: { value: "all" | QuestionType; label: string }[] = [
  { value: "all", label: "混合训练" },
  { value: "choice", label: "选择" },
  { value: "blank", label: "填空" },
  { value: "term", label: "名词解释" },
  { value: "short", label: "简答" },
  { value: "essay", label: "论述" },
];

export function PracticePage() {
  const [filter, setFilter] = useState<"all" | QuestionType>("all");
  const [index, setIndex] = useState(0);
  const { recordAttempt } = useStudy();
  const list = useMemo(() => filter === "all" ? questions : questions.filter((question) => question.type === filter), [filter]);
  const question = list[index % list.length];

  return (
    <section>
      <div className="page-heading practice-heading">
        <div><p className="eyeline">主动提取</p><h1>练习</h1></div>
        <div className="question-count">{index + 1}<span>/ {list.length}</span></div>
      </div>
      <div className="filter-tabs" role="group" aria-label="题型筛选">
        {filters.map((item) => <button className={filter === item.value ? "active" : ""} key={item.value} onClick={() => { setFilter(item.value); setIndex(0); }}>{item.label}</button>)}
      </div>
      <QuestionRunner key={question.id} question={question} onComplete={(result) => {
        recordAttempt({
          id: crypto.randomUUID(),
          questionId: question.id,
          topicIds: question.topicIds,
          answer: result.answer,
          score: result.score,
          selfRating: result.selfRating,
          createdAt: new Date().toISOString(),
        }, result.selfRating === "unsure");
        setIndex((value) => value + 1);
      }} />
    </section>
  );
}

