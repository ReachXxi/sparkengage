import type { Json } from "@/integrations/supabase/types";

function fanAliasPayload(campaignId: string, payload: Record<string, unknown>) {
  if (campaignId !== "c-bnxn") return null;
  const endsAt = typeof payload["endsAt"] === "string" ? payload["endsAt"] : undefined;
  return {
    ...payload,
    title: typeof payload["name"] === "string" ? payload["name"] : undefined,
    hero: typeof payload["cover"] === "string" ? payload["cover"] : undefined,
    type: typeof payload["kind"] === "string" ? payload["kind"] : undefined,
    live: payload["status"] === "live",
    endsAt: endsAt ? new Date(`${endsAt}T23:59:59.000Z`).toISOString() : undefined,
  };
}

export async function persistCampaignOverride(campaignId: string, payload: Record<string, unknown>) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const normalizedPayload = JSON.parse(JSON.stringify(payload)) as Json;
  const { error } = await supabaseAdmin.from("campaign_overrides").upsert({
    campaign_id: campaignId,
    payload: normalizedPayload,
    published: true,
    updated_by: "admin",
  });
  if (error) throw new Error(error.message);

  const fanPayload = fanAliasPayload(campaignId, payload);
  if (fanPayload) {
    const { error: aliasError } = await supabaseAdmin.from("campaign_overrides").upsert({
      campaign_id: "oriade-album",
      payload: JSON.parse(JSON.stringify(fanPayload)) as Json,
      published: true,
      updated_by: "admin",
    });
    if (aliasError) throw new Error(aliasError.message);
  }
}