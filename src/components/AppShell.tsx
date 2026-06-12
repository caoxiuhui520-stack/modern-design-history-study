import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { useStudy } from "../app/studyState";

const EXAM_DAY = new Date("2026-06-29T00:00:00+08:00");

export function getExamCountdownLabel(now = new Date()) {
  const currentDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const targetDay = new Date(EXAM_DAY.getFullYear(), EXAM_DAY.getMonth(), EXAM_DAY.getDate()).getTime();
  const days = Math.round((targetDay - currentDay) / 86_400_000);
  if (days === 0) return "今天考试";
  if (days < 0) return "考试已结束";
  return `距考试 ${days} 天`;
}

const navItems = [
  { to: "/", label: "首页", icon: "home" },
  { to: "/knowledge", label: "知识地图", icon: "book" },
  { to: "/practice", label: "练习", icon: "pen" },
  { to: "/mistakes", label: "错题", icon: "file" },
  { to: "/profile", label: "我的", icon: "user" },
] as const;

function Icon({ name }: { name: string }) {
  const paths: Record<string, ReactNode> = {
    home: <path d="M3 11 12 3l9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
    book: <><path d="M4 4h6a2 2 0 0 1 2 2v15a3 3 0 0 0-3-3H4z" /><path d="M20 4h-6a2 2 0 0 0-2 2v15a3 3 0 0 1 3-3h5z" /></>,
    pen: <><path d="m4 20 4-1 11-11-3-3L5 16z" /><path d="m14 7 3 3" /></>,
    file: <><path d="M6 3h9l3 3v15H6z" /><path d="M9 11h6M9 15h6" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24">{paths[name]}</svg>;
}

function Navigation() {
  return (
    <nav aria-label="主导航">
      {navItems.map((item) => (
        <NavLink key={item.to} to={item.to} end={item.to === "/"} aria-label={item.label}>
          <Icon name={item.icon} />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { syncStatus } = useStudy();
  const syncLabel = {
    local: "本机模式",
    syncing: "同步中",
    synced: "已同步",
    pending: "等待同步",
  }[syncStatus];
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-mark"><span>世界现代</span><strong>设计史</strong></div>
        <Navigation />
        <div className="bauhaus-marks" aria-hidden="true"><i /><i /><i /></div>
      </aside>
      <div className="page-frame">
        <header className="topbar">
          <div>
            <p className="course-label">世界现代设计史</p>
            <p className={`sync-label ${syncStatus}`}><span />{syncLabel}</p>
          </div>
          <div className="exam-rail">
            <span>{getExamCountdownLabel()}</span>
            <strong>今日 <b>30</b> 分钟</strong>
          </div>
        </header>
        <main className="page-content">{children}</main>
      </div>
      <div className="mobile-nav"><Navigation /></div>
    </div>
  );
}
