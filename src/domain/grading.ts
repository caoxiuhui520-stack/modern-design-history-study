const END_PUNCTUATION = /[。．.!！?？,，;；:：、]+$/u;

export function normalizeBlankAnswer(value: string) {
  return value.trim().replace(END_PUNCTUATION, "").trim().toLocaleLowerCase();
}

export function gradeBlank(acceptedAnswers: string[], answer: string) {
  const normalized = normalizeBlankAnswer(answer);
  const correct = acceptedAnswers.some((accepted) => normalizeBlankAnswer(accepted) === normalized);
  return { correct, score: correct ? 1 : 0 };
}

export function gradeChoice(answerIndex: number, selectedIndex: number) {
  const correct = answerIndex === selectedIndex;
  return { correct, score: correct ? 1 : 0 };
}

export function scoreSubjective(totalPoints: number, selectedPoints: number[]) {
  if (totalPoints <= 0) return 0;
  return Math.min(1, new Set(selectedPoints).size / totalPoints);
}

