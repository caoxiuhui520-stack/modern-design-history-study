import type { Question } from "../domain/types";
import { topics } from "./course";

const topicTitles = topics.map((topic) => topic.title);

const generated: Question[] = topics.flatMap((topic, index) => {
  const distractors = [1, 3, 7]
    .map((offset) => topicTitles[(index + offset) % topicTitles.length])
    .filter((title) => title !== topic.title);
  const options = [topic.title, ...distractors].slice(0, 4);
  return [
    {
      id: `${topic.id}-choice`,
      type: "choice",
      topicIds: [topic.id],
      prompt: `“${topic.summary}”描述的是哪一项？`,
      options,
      answerIndex: 0,
      explanation: `${topic.title}：${topic.summary}`,
    },
    {
      id: `${topic.id}-blank`,
      type: "blank",
      topicIds: [topic.id],
      prompt: `${topic.period}，与“${topic.features[0]}”密切相关的设计概念或运动是____。`,
      acceptedAnswers: [topic.title],
      explanation: `${topic.title}的时间与特征：${topic.period}；${topic.features.join("；")}。`,
    },
  ];
});

const subjectiveTopics = topics.filter((topic) => topic.features.length >= 3).slice(0, 15);
const subjective: Question[] = subjectiveTopics.flatMap((topic, index) => {
  const base = {
    topicIds: [topic.id],
    scoringPoints: [topic.period, topic.summary, ...topic.features.slice(0, 3)],
    referenceAnswer: `${topic.title}主要出现于${topic.period}。${topic.summary}其核心特征包括：${topic.features.join("；")}。`,
  };
  const questions: Question[] = [
    {
      ...base,
      id: `${topic.id}-term`,
      type: "term",
      prompt: `名词解释：${topic.title}`,
      explanation: `应覆盖时代、定义和核心特征。`,
    },
  ];
  if (index < 10) {
    questions.push({
      ...base,
      id: `${topic.id}-short`,
      type: "short",
      prompt: `简述${topic.title}的背景与主要特点。`,
      explanation: `按背景、定义、特征分点作答。`,
    });
  }
  if (index < 6) {
    questions.push({
      ...base,
      id: `${topic.id}-essay`,
      type: "essay",
      prompt: `结合课件内容，论述${topic.title}在现代设计史中的意义与局限。`,
      scoringPoints: [...base.scoringPoints, topic.compare ?? "结合前后设计运动说明其影响"],
      explanation: `建议采用“背景—特点—代表—影响/局限”的结构。`,
    });
  }
  return questions;
});

export const questions: Question[] = [...generated, ...subjective];

