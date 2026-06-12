import { useId, useState } from "react";
import type { Question, SelfRating } from "../../domain/types";
import { gradeBlank, gradeChoice, scoreSubjective } from "../../domain/grading";

interface Props {
  question: Question;
  onComplete: (result: { answer: string; score: number; selfRating?: SelfRating }) => void;
}

export function QuestionRunner({ question, onComplete }: Props) {
  const answerId = useId();
  const [answer, setAnswer] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [points, setPoints] = useState<number[]>([]);

  const objectiveScore = question.type === "choice"
    ? gradeChoice(question.answerIndex, selected ?? -1).score
    : question.type === "blank"
      ? gradeBlank(question.acceptedAnswers, answer).score
      : scoreSubjective(question.scoringPoints.length, points);

  function submit() {
    if (question.type === "choice" && selected === null) return;
    if (question.type !== "choice" && !answer.trim()) return;
    setSubmitted(true);
  }

  function finish(selfRating?: SelfRating) {
    onComplete({ answer: question.type === "choice" ? String(selected) : answer, score: objectiveScore, selfRating });
  }

  return (
    <article className="question-sheet">
      <p className="question-type">{({ choice: "选择题", blank: "填空题", term: "名词解释", short: "简答题", essay: "论述题" })[question.type]}</p>
      <h2>{question.prompt}</h2>
      {question.type === "choice" ? (
        <div className="choice-list">
          {question.options.map((option, index) => (
            <label key={option} className={selected === index ? "selected" : ""}>
              <input type="radio" name="choice" checked={selected === index} onChange={() => setSelected(index)} disabled={submitted} />
              <span>{String.fromCharCode(65 + index)}</span>{option}
            </label>
          ))}
        </div>
      ) : (
        <label className="answer-field" htmlFor={answerId}>
          <span>你的答案</span>
          <textarea id={answerId} value={answer} onChange={(event) => setAnswer(event.target.value)} disabled={submitted} rows={question.type === "essay" ? 8 : 5} placeholder="先凭记忆作答，再查看参考答案。" />
        </label>
      )}
      {!submitted ? (
        <button className="primary-button" onClick={submit}>提交答案</button>
      ) : (
        <section className="feedback" aria-live="polite">
          {question.type === "choice" || question.type === "blank" ? (
            <>
              <strong className={objectiveScore === 1 ? "correct" : "incorrect"}>{objectiveScore === 1 ? "回答正确" : "需要再复习"}</strong>
              <p>{question.explanation}</p>
              <button className="primary-button" onClick={() => finish(objectiveScore === 1 ? "known" : "unknown")}>下一题</button>
            </>
          ) : (
            <>
              <h3>参考答案</h3>
              <p>{question.referenceAnswer}</p>
              <div className="score-points">
                <h3>你覆盖了哪些得分点？</h3>
                {question.scoringPoints.map((point, index) => (
                  <label key={point}>
                    <input type="checkbox" aria-label={point} checked={points.includes(index)} onChange={() => setPoints((items) => items.includes(index) ? items.filter((item) => item !== index) : [...items, index])} />
                    <span>{point}</span>
                  </label>
                ))}
              </div>
              <div className="rating-actions">
                <button onClick={() => finish("unknown")}>不会</button>
                <button onClick={() => finish("unsure")}>模糊</button>
                <button className="primary-button" onClick={() => finish("known")}>掌握</button>
              </div>
            </>
          )}
        </section>
      )}
    </article>
  );
}

