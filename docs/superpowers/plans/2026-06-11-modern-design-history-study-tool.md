# 《世界现代设计史》复习工具 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个部署在 GitHub Pages、支持手机与电脑、每天生成 30 分钟复习任务并通过 Supabase 邮箱验证码同步进度的《世界现代设计史》复习网页。

**Architecture:** React 单页应用将课件知识、抽认卡和题目作为版本化静态数据发布；判题、复习排程和本地优先数据仓库都是独立的纯 TypeScript 模块。Supabase 仅承载认证和个人进度，断网或未配置云端时应用继续使用 IndexedDB；同步层负责去重与“较新记录优先”的合并。

**Tech Stack:** React 19、TypeScript、Vite 8、React Router、Dexie、Supabase JS、Zod、Vitest、Testing Library、Playwright、GitHub Actions。

---

## File Map

```text
.
├── .env.example
├── .github/workflows/deploy-pages.yml
├── index.html
├── package.json
├── playwright.config.ts
├── tsconfig.app.json
├── vite.config.ts
├── public/404.html
├── src/
│   ├── app/App.tsx
│   ├── app/router.tsx
│   ├── app/styles.css
│   ├── components/AppShell.tsx
│   ├── components/SyncStatus.tsx
│   ├── data/course.ts
│   ├── data/cards.ts
│   ├── data/questions.ts
│   ├── data/examPresets.ts
│   ├── domain/types.ts
│   ├── domain/grading.ts
│   ├── domain/mastery.ts
│   ├── domain/dailyPlan.ts
│   ├── features/auth/AuthPanel.tsx
│   ├── features/home/HomePage.tsx
│   ├── features/knowledge/KnowledgeMapPage.tsx
│   ├── features/practice/PracticePage.tsx
│   ├── features/practice/QuestionRunner.tsx
│   ├── features/practice/ExamPage.tsx
│   ├── features/mistakes/MistakesPage.tsx
│   ├── features/profile/ProfilePage.tsx
│   ├── lib/config.ts
│   ├── lib/localDb.ts
│   ├── lib/repository.ts
│   ├── lib/supabase.ts
│   ├── lib/sync.ts
│   ├── main.tsx
│   └── test/setup.ts
├── supabase/
│   ├── migrations/202606110001_study_progress.sql
│   └── tests/rls.sql
└── tests/e2e/
    ├── local-study.spec.ts
    ├── responsive.spec.ts
    └── pages-routing.spec.ts
```

## Task 1: Scaffold the Tested GitHub Pages Application

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `tsconfig.app.json`
- Create: `vite.config.ts`
- Create: `src/main.tsx`
- Create: `src/app/App.tsx`
- Create: `src/test/setup.ts`
- Create: `.env.example`

- [ ] **Step 1: Create the Vite React project manifest**

Use scripts with fixed responsibilities:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "check": "npm run test && npm run build"
  }
}
```

Install React, React Router, Dexie, Supabase JS and Zod; install Vite, TypeScript, Vitest, jsdom, Testing Library and Playwright as development dependencies.

- [ ] **Step 2: Write the failing app smoke test**

Create `src/app/App.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { App } from "./App";

it("renders the course title and local-mode fallback", () => {
  render(<App />);
  expect(screen.getByText("世界现代设计史")).toBeInTheDocument();
  expect(screen.getByText("本机模式")).toBeInTheDocument();
});
```

- [ ] **Step 3: Run the test and verify failure**

Run: `npm test -- src/app/App.test.tsx`

Expected: FAIL because `App` and the test environment are not implemented.

- [ ] **Step 4: Implement the minimal application entry**

Create a semantic app root with the course title and a local-mode status. Configure Vitest with `jsdom`, `src/test/setup.ts`, and Testing Library matchers. In `vite.config.ts`, derive the production base from `VITE_BASE_PATH`, defaulting to `/`.

- [ ] **Step 5: Verify scaffold**

Run: `npm run check`

Expected: unit test PASS and Vite build creates `dist/index.html`.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json index.html tsconfig*.json vite.config.ts src .env.example
git commit -m "chore: scaffold study tool"
```

## Task 2: Model and Validate the Course Content

**Files:**
- Create: `src/domain/types.ts`
- Create: `src/data/course.ts`
- Create: `src/data/cards.ts`
- Create: `src/data/questions.ts`
- Create: `src/data/examPresets.ts`
- Create: `src/data/content.test.ts`

- [ ] **Step 1: Define discriminated content types**

Use stable string IDs and a discriminated `Question` union:

```ts
export type Question =
  | { id: string; type: "choice"; topicIds: string[]; prompt: string; options: string[]; answerIndex: number; explanation: string }
  | { id: string; type: "blank"; topicIds: string[]; prompt: string; acceptedAnswers: string[]; explanation: string }
  | { id: string; type: "term"; topicIds: string[]; prompt: string; scoringPoints: string[]; referenceAnswer: string }
  | { id: string; type: "short" | "essay"; topicIds: string[]; prompt: string; scoringPoints: string[]; referenceAnswer: string };
```

Add `Topic`, `Flashcard`, `ExamPreset`, `Attempt`, `TopicMastery`, `DailySession` and `MistakeItem` types. Store dates as ISO strings.

- [ ] **Step 2: Write failing content integrity tests**

Test all IDs are unique, all question/card topic IDs exist, each movement has at least one topic and card, all five question types exist, every choice has a valid answer index, and every subjective question has at least three scoring points.

```ts
expect(new Set(questions.map((q) => q.type))).toEqual(
  new Set(["choice", "blank", "term", "short", "essay"]),
);
expect(questions.length).toBeGreaterThanOrEqual(80);
expect(cards.length).toBeGreaterThanOrEqual(45);
```

- [ ] **Step 3: Run tests and verify failure**

Run: `npm test -- src/data/content.test.ts`

Expected: FAIL because course data is absent.

- [ ] **Step 4: Encode the 30-slide syllabus**

Create course sections for basic concepts, Arts and Crafts, Art Nouveau, Art Deco, early modernism, Bauhaus/De Stijl/Constructivism, industrial design and ergonomics, International Style, and postmodernism.

Minimum content:

- 25 topics with dates, summaries, features, people, works and comparisons.
- 45 flashcards.
- 80 questions: at least 24 choice, 18 blank, 14 term, 14 short and 10 essay.
- One 30-minute practice preset and one full mock-exam preset.

Answers must be traceable to `work/slides-text.txt`; correct obvious OCR or source typos without introducing conflicting facts.

- [ ] **Step 5: Verify content**

Run: `npm test -- src/data/content.test.ts`

Expected: PASS with no dangling relationships or missing question types.

- [ ] **Step 6: Commit**

```bash
git add src/domain src/data
git commit -m "feat: add design history study content"
```

## Task 3: Implement Deterministic Grading and Mastery

**Files:**
- Create: `src/domain/grading.ts`
- Create: `src/domain/grading.test.ts`
- Create: `src/domain/mastery.ts`
- Create: `src/domain/mastery.test.ts`

- [ ] **Step 1: Write failing grading tests**

Cover exact choice grading, normalized blank answers, subjective scoring-point coverage, and self-rating.

```ts
expect(normalizeBlankAnswer(" 包豪斯。 ")).toBe("包豪斯");
expect(gradeBlank(["Bauhaus", "包豪斯"], " BAUHAUS ")).toEqual({ correct: true, score: 1 });
expect(scoreSubjective(4, [0, 2])).toBe(0.5);
```

Normalization may remove surrounding whitespace, ASCII/Chinese terminal punctuation and Latin case differences only. It must not use edit distance.

- [ ] **Step 2: Run grading tests and verify failure**

Run: `npm test -- src/domain/grading.test.ts`

Expected: FAIL because grading functions do not exist.

- [ ] **Step 3: Implement grading functions**

Export `gradeChoice`, `normalizeBlankAnswer`, `gradeBlank`, and `scoreSubjective`. Return explicit `{ correct, score }` results and preserve the raw answer separately in attempts.

- [ ] **Step 4: Write failing mastery tests**

Define a deterministic interval table:

```ts
const intervals = {
  wrong: 1,
  unsure: 1,
  correct1: 2,
  correct2: 4,
  correct3: 7,
  correct4: 14,
};
```

Test that wrong/“不会” lowers mastery and schedules tomorrow, repeated success raises mastery and extends the interval, and values remain within `0..100`.

- [ ] **Step 5: Implement mastery update**

Export `applyAttemptToMastery(previous, signal, now)` where `signal` contains score and `selfRating`. Use UTC-safe calendar-day addition and update `reviewCount`, `successStreak`, `mastery`, `lastReviewedAt`, `nextReviewAt`, and `updatedAt`.

- [ ] **Step 6: Verify domain rules**

Run: `npm test -- src/domain`

Expected: all grading and mastery tests PASS.

- [ ] **Step 7: Commit**

```bash
git add src/domain
git commit -m "feat: add grading and mastery rules"
```

## Task 4: Generate the Daily Plan and Mock Exams

**Files:**
- Create: `src/domain/dailyPlan.ts`
- Create: `src/domain/dailyPlan.test.ts`

- [ ] **Step 1: Write failing daily-plan tests**

Use a seeded RNG so tests are stable. Verify:

- overdue topics and open mistakes rank before unseen topics;
- the plan contains flashcards, mixed questions and mistake review;
- all five types appear over a rolling three-day window;
- no duplicate question appears in one plan;
- the plan estimates 25–35 minutes;
- mock exams honor preset counts.

- [ ] **Step 2: Run and verify failure**

Run: `npm test -- src/domain/dailyPlan.test.ts`

Expected: FAIL because `buildDailyPlan` and `buildExam` are absent.

- [ ] **Step 3: Implement plan selection**

Use weighted ranking:

```ts
priority = overdueDays * 10 + (100 - mastery) + (isMistake ? 30 : 0) + (isUnseen ? 15 : 0);
```

Build three stages targeting 8, 15 and 7 minutes. Keep duration metadata per item, permit finishing after the estimate, and use `2026-06-29` as the default target date.

- [ ] **Step 4: Implement exam selection**

Select by type counts from `ExamPreset`, avoid duplicates, shuffle with the injected RNG, and return a stable exam session ID.

- [ ] **Step 5: Verify scheduler**

Run: `npm test -- src/domain/dailyPlan.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/domain/dailyPlan*
git commit -m "feat: schedule daily study and mock exams"
```

## Task 5: Add Local-First Persistence and Recovery

**Files:**
- Create: `src/lib/localDb.ts`
- Create: `src/lib/repository.ts`
- Create: `src/lib/repository.test.ts`

- [ ] **Step 1: Write the repository contract**

```ts
export interface StudyRepository {
  saveAttempt(attempt: Attempt): Promise<void>;
  listAttempts(): Promise<Attempt[]>;
  upsertMastery(record: TopicMastery): Promise<void>;
  listMastery(): Promise<TopicMastery[]>;
  saveDailySession(session: DailySession): Promise<void>;
  getDailySession(date: string): Promise<DailySession | undefined>;
  upsertMistake(item: MistakeItem): Promise<void>;
  listMistakes(status?: "open" | "resolved"): Promise<MistakeItem[]>;
}
```

- [ ] **Step 2: Write failing persistence tests**

Use `fake-indexeddb` in Vitest. Verify round trips, unique attempt IDs, latest `updatedAt` wins for mutable records, and an unfinished daily session reloads after repository reconstruction.

- [ ] **Step 3: Run and verify failure**

Run: `npm test -- src/lib/repository.test.ts`

Expected: FAIL because the local database is absent.

- [ ] **Step 4: Implement Dexie storage**

Create tables for `attempts`, `mastery`, `dailySessions`, `mistakes`, and `syncQueue`. Save the domain event locally before returning to UI callers. Add schema versioning from the first release.

- [ ] **Step 5: Verify persistence**

Run: `npm test -- src/lib/repository.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/localDb.ts src/lib/repository*
git commit -m "feat: persist study progress locally"
```

## Task 6: Build the Responsive Editorial Interface

**Files:**
- Create: `src/app/router.tsx`
- Create: `src/app/styles.css`
- Create: `src/components/AppShell.tsx`
- Create: `src/components/AppShell.test.tsx`
- Create: `src/features/home/HomePage.tsx`
- Create: `src/features/knowledge/KnowledgeMapPage.tsx`
- Create: `src/features/practice/PracticePage.tsx`
- Create: `src/features/mistakes/MistakesPage.tsx`
- Create: `src/features/profile/ProfilePage.tsx`

- [ ] **Step 1: Write failing navigation tests**

Verify all five routes render, desktop navigation has accessible labels, mobile navigation contains the same destinations, and the exam countdown states are:

- before June 29: `距考试 N 天`;
- June 29: `今天考试`;
- after June 29: `考试已结束`.

- [ ] **Step 2: Run and verify failure**

Run: `npm test -- src/components/AppShell.test.tsx`

Expected: FAIL because the shell and routes do not exist.

- [ ] **Step 3: Implement the design system**

Define CSS variables:

```css
:root {
  --paper: #ffffff;
  --ink: #17231d;
  --forest: #284b39;
  --forest-soft: #dfe9e2;
  --tan: #b7855d;
  --line: #d9ddd9;
  --muted: #66716b;
}
```

Use an editorial layout, open lists and ruled answer areas rather than repetitive card grids. Set touch targets to at least 44px, provide visible `:focus-visible`, and disable nonessential transitions under `prefers-reduced-motion`.

- [ ] **Step 4: Implement app shell and pages**

Use `HashRouter` to make direct refreshes reliable on GitHub Pages without server rewrites. Desktop gets a left rail; below 760px, replace it with a fixed bottom navigation. Implement content-complete empty/loading states rather than placeholders.

- [ ] **Step 5: Verify UI unit tests and build**

Run: `npm run check`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/app src/components src/features
git commit -m "feat: build responsive study interface"
```

## Task 7: Implement Flashcards, Five Question Types, Mistakes and Exams

**Files:**
- Create: `src/features/practice/QuestionRunner.tsx`
- Create: `src/features/practice/QuestionRunner.test.tsx`
- Create: `src/features/practice/ExamPage.tsx`
- Modify: `src/features/home/HomePage.tsx`
- Modify: `src/features/practice/PracticePage.tsx`
- Modify: `src/features/mistakes/MistakesPage.tsx`
- Modify: `src/features/knowledge/KnowledgeMapPage.tsx`

- [ ] **Step 1: Write failing question-flow tests**

For each question type, test answer-before-feedback behavior. Assert:

- choice and blank show automatic result and explanation;
- subjective questions hide the reference answer until submission;
- scoring-point checkboxes produce a practice score;
- self-rating updates mastery;
- wrong/uncertain answers create open mistakes;
- a resolved mistake disappears from the open queue but remains in history.

- [ ] **Step 2: Run and verify failure**

Run: `npm test -- src/features/practice/QuestionRunner.test.tsx`

Expected: FAIL.

- [ ] **Step 3: Implement `QuestionRunner`**

Use exhaustive switching on the `Question` union. Keep controls code-native, label all form fields, preserve draft text until submission, and call a single `recordAttempt` application service that updates attempt, mastery, mistake and daily-session records atomically from the UI perspective.

- [ ] **Step 4: Connect daily sessions**

Home starts or resumes the current date’s plan. Show progress through `快速回忆`, `混合训练`, and `错题回炉`. A refresh must restore the current item and submitted state from local storage.

- [ ] **Step 5: Connect knowledge and practice pages**

Knowledge nodes link to filtered cards/questions. Practice supports type-specific sessions and mock exams. The exam page withholds all feedback until submission and reports objective score plus subjective self-score separately.

- [ ] **Step 6: Verify complete local workflow**

Run: `npm run test`

Expected: all unit and component tests PASS.

- [ ] **Step 7: Commit**

```bash
git add src/features src/components src/app
git commit -m "feat: complete study and exam workflows"
```

## Task 8: Add Supabase OTP, Schema, RLS and Synchronization

**Files:**
- Create: `src/lib/config.ts`
- Create: `src/lib/supabase.ts`
- Create: `src/features/auth/AuthPanel.tsx`
- Create: `src/features/auth/AuthPanel.test.tsx`
- Create: `src/lib/sync.ts`
- Create: `src/lib/sync.test.ts`
- Create: `src/components/SyncStatus.tsx`
- Create: `supabase/migrations/202606110001_study_progress.sql`
- Create: `supabase/tests/rls.sql`

- [ ] **Step 1: Write failing configuration and OTP tests**

Test missing `VITE_SUPABASE_URL` or `VITE_SUPABASE_PUBLISHABLE_KEY` selects local mode. Mock Supabase and verify:

```ts
supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
supabase.auth.verifyOtp({ email, token, type: "email" });
```

Also test invalid email, six-digit validation, expired-code errors, resend cooldown and logout.

- [ ] **Step 2: Implement auth UI**

Use a two-step email/code form. Supabase’s email template must contain `{{ .Token }}` so users receive a six-digit OTP rather than only a magic link. Keep the entered email on recoverable errors.

- [ ] **Step 3: Write the database migration**

Create `profiles`, `topic_mastery`, `attempts`, `daily_sessions`, and `mistake_items` with UUID/text primary keys, `user_id uuid not null`, timestamps, constraints and indexes. Enable RLS on every personal table.

Use policies shaped as:

```sql
create policy "users read own attempts"
on public.attempts for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "users insert own attempts"
on public.attempts for insert
to authenticated
with check ((select auth.uid()) = user_id);
```

Add equivalent select/insert/update/delete policies as required for all tables. Never grant client access to a service-role secret.

- [ ] **Step 4: Write RLS tests**

Using Supabase’s SQL test approach, create two test users and prove user A can read/update A’s rows but cannot read/update B’s rows. Verify unauthenticated requests return no personal rows.

- [ ] **Step 5: Write failing sync tests**

Test:

- immutable attempts deduplicate by client-generated ID;
- mutable records choose the later `updatedAt`;
- queued operations remain after network failure;
- successful uploads remove queue entries;
- first login merges local and remote data;
- logout leaves local study data usable but disconnects cloud sync.

- [ ] **Step 6: Implement sync**

Separate `SyncTransport` from merge logic so unit tests use an in-memory transport. Trigger sync after login, on browser `online`, after local writes with debounce, and from a manual retry button. Display `本机模式`, `已同步`, `同步中`, or `等待同步`.

- [ ] **Step 7: Verify auth, sync and database**

Run:

```bash
npm test -- src/features/auth src/lib/sync.test.ts
supabase db reset
supabase test db
```

Expected: frontend tests PASS; migrations apply; RLS tests PASS.

- [ ] **Step 8: Commit**

```bash
git add src/lib src/features/auth src/components/SyncStatus.tsx supabase .env.example
git commit -m "feat: sync progress with supabase"
```

## Task 9: Add End-to-End Tests and GitHub Pages Deployment

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/local-study.spec.ts`
- Create: `tests/e2e/responsive.spec.ts`
- Create: `tests/e2e/pages-routing.spec.ts`
- Create: `public/404.html`
- Create: `.github/workflows/deploy-pages.yml`
- Modify: `vite.config.ts`
- Modify: `README.md`

- [ ] **Step 1: Configure Playwright**

Use Playwright `webServer` to run `npm run dev -- --host 127.0.0.1`. Add desktop Chromium and a mobile project using an iPhone-sized viewport.

- [ ] **Step 2: Write failing local-study E2E test**

Exercise:

1. open in local mode;
2. start today’s task;
3. answer one choice and one subjective question;
4. mark one item uncertain;
5. reload;
6. verify progress and the open mistake remain;
7. finish and verify the day is marked complete.

- [ ] **Step 3: Write responsive and routing tests**

Assert no document-level horizontal overflow at 390px and 1280px. Check the bottom nav on mobile, left nav on desktop, and a hash route such as `/#/knowledge` survives reload.

- [ ] **Step 4: Run E2E tests and fix failures**

Run:

```bash
npx playwright install chromium
npm run test:e2e
```

Expected: all local-mode, responsive and route tests PASS.

- [ ] **Step 5: Add GitHub Pages workflow**

Follow Vite’s official Pages deployment pattern:

- trigger on pushes to `main` and manual dispatch;
- grant `contents: read`, `pages: write`, `id-token: write`;
- install with `npm ci`;
- run tests and build;
- set `VITE_BASE_PATH` from repository name;
- inject Supabase URL and publishable key from GitHub repository variables/secrets;
- upload `dist` with `actions/upload-pages-artifact`;
- deploy with `actions/deploy-pages`.

- [ ] **Step 6: Document setup**

In `README.md`, document:

- local install and commands;
- Supabase migration and OTP email template containing `{{ .Token }}`;
- allowed redirect/site URLs for local and GitHub Pages;
- GitHub Pages source set to GitHub Actions;
- required GitHub variables/secrets;
- local-mode behavior when cloud configuration is absent.

- [ ] **Step 7: Run the full release gate**

Run:

```bash
npm run test
npm run build
npm run test:e2e
```

Expected: all commands exit 0 and `dist` contains non-empty assets.

- [ ] **Step 8: Visual verification**

Start the production preview and inspect desktop and mobile:

```bash
npm run build
npx vite preview --host 127.0.0.1
```

Capture screenshots of Home, Knowledge Map, each question family, Mistakes, Profile/Auth and Exam Results. Compare against the approved “编辑式复习手册” concept for typography, palette, spacing, navigation, touch targets, answer-paper treatment and lack of horizontal overflow. Fix all visible regressions.

- [ ] **Step 9: Commit**

```bash
git add playwright.config.ts tests public .github README.md vite.config.ts
git commit -m "ci: deploy tested app to github pages"
```

## Task 10: Production Smoke Test

**Files:**
- Modify only files required by verified production defects.

- [ ] **Step 1: Deploy to a GitHub repository**

Push `main`, enable Pages with GitHub Actions, and wait for the deploy workflow to succeed.

- [ ] **Step 2: Verify the public URL**

On desktop and phone:

- load the root and `/#/knowledge`;
- complete a local-mode question;
- request an email code;
- verify the code and session persistence;
- complete an answer on device A;
- confirm the progress appears on device B;
- disable network, answer another question, restore network and verify sync;
- confirm one user cannot observe another user’s records.

- [ ] **Step 3: Run production Playwright smoke**

Run:

```bash
PLAYWRIGHT_BASE_URL=https://<owner>.github.io/<repo>/ npx playwright test tests/e2e/pages-routing.spec.ts
```

Expected: PASS against the deployed site.

- [ ] **Step 4: Record release configuration**

Add the actual Pages URL and deployment date to `README.md`; do not commit Supabase private keys or test OTPs.

- [ ] **Step 5: Final commit**

```bash
git add README.md
git commit -m "docs: record production deployment"
```

## Final Verification Checklist

- [ ] `npm run test` passes.
- [ ] `npm run build` passes with the repository base path.
- [ ] `npm run test:e2e` passes for desktop and mobile.
- [ ] Course integrity tests cover all five question types and all syllabus sections.
- [ ] Local mode works without Supabase environment variables.
- [ ] OTP sends a six-digit token and verification creates a persistent session.
- [ ] RLS tests block cross-user reads and writes.
- [ ] Offline answers survive reload and later synchronize.
- [ ] GitHub Pages root and hash routes reload without 404.
- [ ] The public app has no mobile horizontal overflow or clipped controls.
- [ ] Visual comparison matches the approved editorial study-handbook direction.
