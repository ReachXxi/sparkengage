import { generateText, Output } from "ai";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";
import { getAdminSession, passwordMatches, requireAdminSession } from "./admin-auth.server";
import { persistCampaignOverride } from "./campaign-overrides.server";

const BuilderInput = z.object({ message: z.string().trim().min(1).max(2000) });
const CampaignProposalSchema = z.object({
  hasProposal: z.boolean(),
  reply: z.string(),
  name: z.string().nullable(),
  description: z.string().nullable(),
  kind: z.enum(["album", "movie", "book"]).nullable(),
  status: z.enum(["draft", "scheduled", "live", "ended"]).nullable(),
  entryMode: z.enum(["free", "coins"]).nullable(),
  entryFee: z.number().nullable(),
  startsAt: z.string().nullable(),
  endsAt: z.string().nullable(),
  creator: z.string().nullable(),
  genre: z.string().nullable(),
  prize: z.string().nullable(),
  modules: z.array(z.string()),
  targeting: z.array(z.string()),
});
export type CampaignProposal = z.infer<typeof CampaignProposalSchema>;

const ApplyProposalInput = z.object({
  campaignId: z.string().min(1).max(120),
  password: z.string().min(1).max(200),
  proposal: CampaignProposalSchema,
});

export const getBuilderHistory = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdminSession();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("campaign_builder_messages")
    .select("id, role, content, created_at")
    .eq("session_key", "primary")
    .order("created_at", { ascending: true })
    .limit(100);
  if (error) throw new Error(error.message);
  return data;
});

export const askCampaignBuilder = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => BuilderInput.parse(input))
  .handler(async ({ data }) => {
    await requireAdminSession();
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("Lovable AI is not configured");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: history, error: historyError } = await supabaseAdmin
      .from("campaign_builder_messages")
      .select("role, content")
      .eq("session_key", "primary")
      .order("created_at", { ascending: true })
      .limit(100);
    if (historyError) throw new Error(historyError.message);

    const prompt = [
      "You are SPARKFAN's campaign manager. Help a creator configure a fan campaign.",
      "Ask only the next most useful question until you have name, activity, entry model, fee, dates, rewards, rules, participant cap, and P2P setting.",
      "Validate dates, non-negative coin fees, and sensible participant limits. Never claim a change was saved.",
      "When ready, set hasProposal to true and summarize the exact proposed changes. Before that, set hasProposal to false and ask the next useful question.",
      "Keep answers concise, practical, and structured for a live preview. Do not expose secrets or invent payment confirmations. Return only the requested JSON object.",
      ...history.map((item) => `${item.role.toUpperCase()}: ${item.content}`),
      `USER: ${data.message}`,
    ].join("\n");

    const result = await generateText({
      model: createLovableAiGatewayProvider(apiKey)("google/gemini-3.7-flash"),
      output: Output.object({ schema: CampaignProposalSchema }),
      prompt,
      maxOutputTokens: 900,
    });
    const proposal = result.output;
    if (!proposal) throw new Error("The assistant did not return a valid proposal");
    const insertError = await supabaseAdmin.from("campaign_builder_messages").insert([
      { session_key: "primary", role: "user", content: data.message },
      { session_key: "primary", role: "assistant", content: `${proposal.reply}\nPROPOSAL: ${JSON.stringify(proposal)}` },
    ]);
    if (insertError.error) throw new Error(insertError.error.message);
    return { reply: proposal.reply, proposal };
  });

export const applyCampaignBuilderProposal = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ApplyProposalInput.parse(input))
  .handler(async ({ data }) => {
    await requireAdminSession();
    const expected = process.env["SITE_PASSWORD"];
    if (!expected || !passwordMatches(data.password, expected)) {
      throw new Error("Admin password is incorrect");
    }
    const payload = Object.fromEntries(
      Object.entries(data.proposal).filter(([key, value]) =>
        key !== "hasProposal" && key !== "reply" && value !== null,
      ),
    );
    await persistCampaignOverride(data.campaignId, payload);
    const session = await getAdminSession();
    return { ok: true as const, payload, sessionUnlocked: Boolean(session.data.unlocked) };
  });