# 世界现代设计史复习工具

面向 2026 年 6 月 29 日期末考试的响应式复习网页。每天按 30 分钟安排快速回忆、混合训练和错题回炉，覆盖选择题、填空题、名词解释、简答题与论述题。

## 功能

- 25 个课件知识主题、50 张抽认卡、70+ 道五类题目。
- 知识地图：设计运动、年代、人物、代表作和易混对比。
- 客观题自动判定；主观题按得分点自评。
- 浏览器本地保存，刷新和短暂离线不丢进度。
- Supabase 邮箱六位验证码登录和跨设备同步。
- 桌面左侧导航与手机底部导航。
- GitHub Actions 自动发布到 GitHub Pages。

## 本地运行

需要 Node.js 22。

```bash
npm install
npm run dev
```

打开终端显示的本地地址。未配置 Supabase 时，应用自动进入“本机模式”，所有核心复习功能仍可使用。

## 测试

```bash
npm run test
npm run build
npm run test:e2e
```

首次运行浏览器测试前安装 Chromium：

```bash
npx playwright install chromium
```

## Supabase 配置

1. 在 Supabase 新建项目。
2. 在 SQL Editor 执行 `supabase/migrations/202606110001_study_progress.sql`。
3. 在 Authentication 的邮件模板中使用 `{{ .Token }}`，确保邮件包含六位验证码。
4. 在 Authentication URL Configuration 中添加：
   - 本地地址，例如 `http://localhost:5173`
   - GitHub Pages 地址，例如 `https://<owner>.github.io/<repo>/`
5. 本地创建 `.env.local`：

```dotenv
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<publishable-or-anon-key>
```

前端只允许使用 publishable/anon key，禁止使用 service role key。数据库迁移已经为所有个人数据表启用 RLS，用户只能访问自己的记录。

## GitHub Pages 部署

1. 在 GitHub 新建空仓库并推送本项目的 `main` 分支。
2. 在仓库 `Settings → Pages` 中将 Source 设为 **GitHub Actions**。
3. 在 `Settings → Secrets and variables → Actions` 中配置：
   - Variable：`VITE_SUPABASE_URL`
   - Secret：`VITE_SUPABASE_PUBLISHABLE_KEY`
4. 推送到 `main`，或在 Actions 页面手动运行 `Deploy study tool to GitHub Pages`。

若不配置上述两项，Pages 仍会成功部署，但仅使用当前浏览器的本地进度。

工作流会自动判断路径：

- 普通仓库：`https://<owner>.github.io/<repo>/`
- `<owner>.github.io` 仓库：`https://<owner>.github.io/`

## 内容来源

复习内容依据用户提供的 30 页《世界现代设计史》考试课件整理。题库随代码发布，个人答题记录不进入仓库。

