import { Link } from "react-router-dom";
import { topics } from "../../data/course";
import { useStudy } from "../../app/studyState";

export function HomePage() {
  const { attempts, mistakes, completedToday } = useStudy();
  const progress = Math.min(100, Math.round((completedToday / 12) * 100));
  const weakTopics = mistakes.slice(-3).map((mistake) => topics.find((topic) => topic.id === mistake.topicId)).filter(Boolean);

  return (
    <>
      <section className="hero-panel">
        <div>
          <p className="section-number">06 / 29</p>
          <h1>今天，用 30 分钟<br />把记忆重新叫醒。</h1>
          <p>系统优先安排到期知识点和错题，不需要你决定先学什么。</p>
        </div>
        <div className="hero-progress">
          <span>{progress}%</span>
          <div><i style={{ width: `${progress}%` }} /></div>
          <small>今日已完成 {completedToday} / 12 项</small>
        </div>
      </section>

      <section className="task-strip">
        <div><span>08</span><h3>快速回忆</h3><p>人物、年代、运动与作品</p></div>
        <div><span>15</span><h3>混合训练</h3><p>五类题型交替提取</p></div>
        <div><span>07</span><h3>错题回炉</h3><p>{mistakes.length} 个薄弱点待处理</p></div>
        <Link to="/practice" className="start-task">开始今日任务 <b>→</b></Link>
      </section>

      <section className="dashboard-grid">
        <div className="open-panel">
          <p className="eyeline">学习进度</p>
          <div className="large-stat">{attempts.length}</div>
          <p>累计完成题目</p>
          <div className="progress-line"><i style={{ width: `${Math.min(100, attempts.length)}%` }} /></div>
        </div>
        <div className="open-panel">
          <p className="eyeline">近期薄弱点</p>
          {weakTopics.length ? weakTopics.map((topic) => <p className="recent-item" key={topic!.id}>{topic!.title}<span>待复习</span></p>) : <p className="empty-note">完成几道题后，这里会出现你的薄弱知识点。</p>}
        </div>
        <div className="quote-panel">
          <blockquote>“设计并不只是外观和感觉，设计是如何运作。”</blockquote>
          <p>用结构理解历史，用提取巩固记忆。</p>
        </div>
      </section>
    </>
  );
}

