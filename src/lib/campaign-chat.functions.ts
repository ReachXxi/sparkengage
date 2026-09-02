import { createClient } from "@supabase/supabase-js";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

const MessageInput = z.object({
  campaignId: z.string().min(1).max(120),
  displayName: z.string().trim().min(1).max(40),
  body: z.string().trim().min(1).max(500),
});

function publicClient() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("Cloud configuration is missing");
  return createClient<Database>(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export const listCampaignChat = createServerFn({ method: "GET" })
  .inputValidator((input: { campaignId: string }) => input)
  .handler(async ({ data }) => {
    const { data: rows, error } = await publicClient()
      .from("campaign_chat_messages")
      .select("id, campaign_id, display_name, body, created_at")
      .eq("campaign_id", data.campaignId)
      .order("created_at", { ascending: true })
      .limit(80);
    if (error) throw new Error(error.message);
    return rows;
  });

export const sendCampaignChat = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => MessageInput.parse(input))
  .handler(async ({ data }) => {
    const { error } = await publicClient().from("campaign_chat_messages").insert({
      campaign_id: data.campaignId,
      display_name: data.displayName,
      body: data.body,
    });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });