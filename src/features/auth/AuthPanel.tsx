import { useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";

export interface AuthClient {
  sendMagicLink(email: string): Promise<void>;
}

function createAuthClient(client: SupabaseClient): AuthClient {
  return {
    async sendMagicLink(email) {
      const redirectTo = new URL(import.meta.env.BASE_URL, window.location.origin).toString();
      const { error } = await client.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: redirectTo,
        },
      });
      if (error) throw error;
    },
  };
}

const defaultClient: AuthClient | null = supabase ? createAuthClient(supabase) : null;

export function AuthPanel({ client = defaultClient }: { client?: AuthClient | null }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  if (!client) {
    return <p className="local-mode-note">当前为本机模式。配置 Supabase 后可启用邮箱登录与跨设备同步。</p>;
  }
  const authClient = client;

  async function sendLink() {
    setBusy(true);
    setStatus("");
    try {
      await authClient.sendMagicLink(email);
      setSent(true);
      setStatus("登录链接已发送，请打开邮件并点击链接。");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "操作失败，请重试。");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-form">
      {!sent ? (
        <>
          <label>
            邮箱
            <input
              aria-label="邮箱"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
            />
          </label>
          <button disabled={busy || !email.includes("@")} onClick={sendLink}>
            发送登录链接
          </button>
        </>
      ) : (
        <>
          <p>邮件已发送至 <strong>{email}</strong>。点击邮件中的链接后，学习进度会自动同步。</p>
          <button className="text-button" onClick={() => {
            setSent(false);
            setStatus("");
          }}>
            更换邮箱
          </button>
        </>
      )}
      {status ? <p className="auth-status" role="status">{status}</p> : null}
    </div>
  );
}
