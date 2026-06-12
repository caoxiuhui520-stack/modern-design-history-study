import { questions } from "../../data/questions";
import { topics } from "../../data/course";
import { useStudy } from "../../app/studyState";

export function MistakesPage() {
  const { mistakes } = useStudy();
  return (
    <section>
      <div className="page-heading"><p className="eyeline">薄弱点优先</p><h1>错题回炉</h1><p>答错或标记模糊的内容会集中在这里。</p></div>
      <div className="mistake-list">
        {mistakes.length ? mistakes.map((mistake, index) => {
          const question = questions.find((item) => item.id === mistake.questionId);
          const topic = topics.find((item) => item.id === mistake.topicId);
          return <article key={mistake.id}><span>{String(index + 1).padStart(2, "0")}</span><div><p>{topic?.section}</p><h2>{question?.prompt}</h2><small>{mistake.reason === "wrong" ? "上次回答错误" : "上次标记模糊"}</small></div></article>;
        }) : <div className="empty-state"><b>还没有错题</b><p>先完成今日练习，系统会自动整理需要回炉的内容。</p></div>}
      </div>
    </section>
  );
}

