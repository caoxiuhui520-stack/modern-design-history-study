import { useStudy } from "../../app/studyState";
import { AuthPanel } from "../auth/AuthPanel";

export function ProfilePage() {
  const { attempts, mistakes } = useStudy();
  const correct = attempts.filter((attempt) => attempt.score === 1).length;
  const rate = attempts.length ? Math.round(correct / attempts.length * 100) : 0;
  return (
    <section>
      <div className="page-heading"><p className="eyeline">学习档案</p><h1>我的复习</h1><p>本机数据已经保存。登录后可在手机和电脑之间同步。</p></div>
      <div className="profile-stats">
        <div><strong>{attempts.length}</strong><span>累计答题</span></div>
        <div><strong>{rate}%</strong><span>客观正确率</span></div>
        <div><strong>{mistakes.length}</strong><span>待回炉</span></div>
      </div>
      <section className="login-panel">
        <div><p className="eyeline">跨设备同步</p><h2>邮箱验证码登录</h2><p>Supabase 配置完成后，在这里输入邮箱获取六位验证码。</p></div>
        <AuthPanel />
        <small>邮件模板需包含 <code>{"{{ .Token }}"}</code> 才会发送六位验证码。</small>
      </section>
    </section>
  );
}
