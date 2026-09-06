import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getAdminSession, passwordMatches, requireAdminSession } from "./admin-auth.server";

const PasswordInput = z.object({ password: z.string().min(1).max(200) });
const CampaignOverrideInput = z.object({
  campaignId: z.string().min(1).max(120),
  payload: z.record(z.unknown()),
});

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
    const { persistCampaignOverride } = await import("./campaign-overrides.server");
    await persistCampaignOverride(data.campaignId, data.payload);
    return { ok: true as const };
  });