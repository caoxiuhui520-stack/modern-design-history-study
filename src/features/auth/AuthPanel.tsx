import { useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";

export interface AuthClient {
  sendOtp(email: string): Promise<void>;
  verifyOtp(email: string, token: string): Promise<void>;
  signOut(): Promise<void>;
}

function createAuthClient(client: SupabaseClient): AuthClient {
  return {
    async sendOtp(email) {
    const { error } = await client.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    if (error) throw error;
  },
  async verifyOtp(email, token) {
    const { error } = await client.auth.verifyOtp({ email, token, type: "email" });
    if (error) throw error;
  },
  async signOut() {
    const { error } = await client.auth.signOut();
    if (error) throw error;
  },
  };
}

const defaultClient: AuthClient | null = supabase ? createAuthClient(supabase) : null;

export function AuthPanel({ client = defaultClient }: { client?: AuthClient | null }) {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [step, setStep] = useState<"email" | "token" | "done">("email");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  if (!client) {
    return <p className="local-mode-note">当前为本机模式。配置 Supabase 后可启用邮箱验证码与跨设备同步。</p>;
  }

  async function run(operation: () => Promise<void>, success: string) {
    setBusy(true);
    setStatus("");
    try {
      await operation();
      setStatus(success);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "操作失败，请重试。");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-form">
      {step === "email" ? (
        <>
          <label>邮箱<input aria-label="邮箱" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" /></label>
          <button disabled={busy || !email.includes("@")} onClick={() => run(async () => {
            await client.sendOtp(email);
            setStep("token");
          }, "验证码已发送，请检查邮箱。")}>发送验证码</button>
        </>
      ) : null}
      {step === "token" ? (
        <>
          <label>六位验证码<input aria-label="六位验证码" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={token} onChange={(event) => setToken(event.target.value.replace(/\D/g, ""))} /></label>
          <button disabled={busy || !/^\d{6}$/.test(token)} onClick={() => run(async () => {
            await client.verifyOtp(email, token);
            setStep("done");
          }, "登录成功，正在同步学习进度。")}>验证并登录</button>
          <button className="text-button" onClick={() => setStep("email")}>更换邮箱</button>
        </>
      ) : null}
      {step === "done" ? <div><strong>已登录</strong><button className="text-button" onClick={() => run(async () => { await client.signOut(); setStep("email"); }, "已退出登录。")}>退出登录</button></div> : null}
      {status ? <p className="auth-status" role="status">{status}</p> : null}
    </div>
  );
}
