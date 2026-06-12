import { resolveCloudConfig } from "./config";

it("uses local mode when cloud variables are incomplete", () => {
  expect(resolveCloudConfig({})).toEqual({ mode: "local" });
  expect(resolveCloudConfig({ VITE_SUPABASE_URL: "https://example.supabase.co" })).toEqual({ mode: "local" });
});

it("uses cloud mode only with both public values", () => {
  expect(resolveCloudConfig({
    VITE_SUPABASE_URL: "https://example.supabase.co",
    VITE_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test",
  })).toEqual({
    mode: "cloud",
    url: "https://example.supabase.co",
    publishableKey: "sb_publishable_test",
  });
});

