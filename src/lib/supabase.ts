import { createClient } from "@supabase/supabase-js";
import { cloudConfig } from "./config";

export const supabase = cloudConfig.mode === "cloud"
  ? createClient(cloudConfig.url, cloudConfig.publishableKey)
  : null;

