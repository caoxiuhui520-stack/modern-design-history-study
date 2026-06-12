import { topics } from "../../data/course";
import type { Topic } from "../../domain/types";

export function KnowledgeMapPage() {
  const sections = topics.reduce<Map<string, Topic[]>>((groups, topic) => {
    const items = groups.get(topic.section) ?? [];
    items.push(topic);
    groups.set(topic.section, items);
    return groups;
  }, new Map());
  return (
    <section>
      <div className="page-heading">
        <p className="eyeline">从 1850 到 1981</p>
        <h1>知识地图</h1>
        <p>沿着设计运动展开，连接年代、理念、人物与代表作。</p>
      </div>
      <div className="timeline">
        {[...sections.entries()].map(([section, items], sectionIndex) => (
          <section className="timeline-section" key={section}>
            <div className="timeline-marker">{String(sectionIndex + 1).padStart(2, "0")}</div>
            <div>
              <h2>{section}</h2>
              {items.map((topic) => (
                <details key={topic.id}>
                  <summary><span>{topic.period}</span><strong>{topic.title}</strong></summary>
                  <div className="topic-detail">
                    <p>{topic.summary}</p>
                    <ul>{topic.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
                    {topic.people.length > 0 ? <p><b>人物：</b>{topic.people.join("、")}</p> : null}
                    {topic.works.length > 0 ? <p><b>代表作：</b>{topic.works.join("、")}</p> : null}
                    {topic.compare ? <p className="compare-note"><b>易混对比：</b>{topic.compare}</p> : null}
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
