import { createClient } from "@supabase/supabase-js";
import { createServerFn } from "@tanstack/react-start";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("Cloud configuration is missing");
  return createClient<Database>(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export const listPublishedCampaignOverrides = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient()
    .from("campaign_overrides")
    .select("campaign_id, payload")
    .eq("published", true);
  if (error) throw new Error(error.message);
  return data.map((row) => ({ campaignId: row.campaign_id, payload: row.payload as Record<string, unknown> }));
});

export const getPublishedCampaignOverride = createServerFn({ method: "GET" })
  .inputValidator((input: { campaignId: string }) => input)
  .handler(async ({ data }) => {
    const { data: row, error } = await publicClient()
      .from("campaign_overrides")
      .select("campaign_id, payload")
      .eq("published", true)
      .eq("campaign_id", data.campaignId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row ? { campaignId: row.campaign_id, payload: row.payload as Record<string, unknown> } : null;
  });