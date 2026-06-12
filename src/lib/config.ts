export type CloudConfig =
  | { mode: "local" }
  | { mode: "cloud"; url: string; publishableKey: string };

export function resolveCloudConfig(env: Record<string, string | undefined>): CloudConfig {
  const url = env.VITE_SUPABASE_URL?.trim();
  const publishableKey = env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!url || !publishableKey) return { mode: "local" };
  return { mode: "cloud", url, publishableKey };
}

export const cloudConfig = resolveCloudConfig(import.meta.env);

