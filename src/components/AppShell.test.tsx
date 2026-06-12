import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AppShell, getExamCountdownLabel } from "./AppShell";
import { StudyProvider } from "../app/studyState";

it("shows all primary destinations", () => {
  render(
    <StudyProvider>
      <MemoryRouter>
        <AppShell>
          <p>页面内容</p>
        </AppShell>
      </MemoryRouter>
    </StudyProvider>,
  );
  for (const label of ["首页", "知识地图", "练习", "错题", "我的"]) {
    expect(screen.getAllByRole("link", { name: label }).length).toBeGreaterThan(0);
  }
});

it("formats the exam countdown without negative days", () => {
  expect(getExamCountdownLabel(new Date("2026-06-28T12:00:00+08:00"))).toBe("距考试 1 天");
  expect(getExamCountdownLabel(new Date("2026-06-29T12:00:00+08:00"))).toBe("今天考试");
  expect(getExamCountdownLabel(new Date("2026-06-30T12:00:00+08:00"))).toBe("考试已结束");
});
