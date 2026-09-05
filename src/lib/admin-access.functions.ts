import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getAdminSession, passwordMatches, requireAdminSession } from "./admin-auth.server";
import type { Json } from "@/integrations/supabase/types";

const PasswordInput = z.object({ password: z.string().min(1).max(200) });
const CampaignOverrideInput = z.object({
  campaignId: z.string().min(1).max(120),
  payload: z.record(z.unknown()),
});

function fanAliasPayload(campaignId: string, payload: Record<string, unknown>) {
  if (campaignId !== "c-bnxn") return null;
  const endsAt = typeof payload.endsAt === "string" ? payload.endsAt : undefined;
  return {
    ...payload,
    title: typeof payload.name === "string" ? payload.name : undefined,
    hero: typeof payload.cover === "string" ? payload.cover : undefined,
    type: typeof payload.kind === "string" ? payload.kind : undefined,
    live: payload.status === "live",
    endsAt: endsAt ? new Date(`${endsAt}T23:59:59.000Z`).toISOString() : undefined,
  };
}

export const getAdminAccess = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getAdminSession();
  return { unlocked: Boolean(session.data.unlocked) };
});

export const unlockAdmin = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PasswordInput.parse(input))
  .handler(async ({ data }) => {
    const expected = process.env["SITE_PASSWORD"];
    if (!expected) throw new Error("SITE_PASSWORD is not configured");
    if (!passwordMatches(data.password, expected)) return { ok: false as const };
    const session = await getAdminSession();
    await session.update({ unlocked: true });
    return { ok: true as const };
  });

export const lockAdmin = createServerFn({ method: "POST" }).handler(async () => {
  const session = await getAdminSession();
  await session.clear();
  return { ok: true as const };
});

export const saveCampaignOverride = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => CampaignOverrideInput.parse(input))
  .handler(async ({ data }) => {
    await requireAdminSession();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const normalizedPayload = JSON.parse(JSON.stringify(data.payload)) as Json;
    const { error } = await supabaseAdmin.from("campaign_overrides").upsert({
      campaign_id: data.campaignId,
      payload: normalizedPayload,
      published: true,
      updated_by: "admin",
    });
    if (error) throw new Error(error.message);
    const fanPayload = fanAliasPayload(data.campaignId, data.payload);
    if (fanPayload) {
      const { error: aliasError } = await supabaseAdmin.from("campaign_overrides").upsert({
        campaign_id: "oriade-album",
        payload: JSON.parse(JSON.stringify(fanPayload)) as Json,
        published: true,
        updated_by: "admin",
      });
      if (aliasError) throw new Error(aliasError.message);
    }
    return { ok: true as const };
  });