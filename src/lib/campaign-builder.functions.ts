import { generateText } from "ai";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";
import { requireAdminSession } from "./admin-auth.server";

const BuilderInput = z.object({ message: z.string().trim().min(1).max(2000) });

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
      "When ready, summarize the exact proposed changes under PROPOSED CHANGES and ask the admin to type Confirm and then provide the admin password.",
      "Keep answers concise, practical, and structured for a live preview. Do not expose secrets or invent payment confirmations.",
      ...history.map((item) => `${item.role.toUpperCase()}: ${item.content}`),
      `USER: ${data.message}`,
    ].join("\n");

    const result = await generateText({
      model: createLovableAiGatewayProvider(apiKey)("google/gemini-3.7-flash"),
      prompt,
      maxOutputTokens: 900,
    });
    const insertError = await supabaseAdmin.from("campaign_builder_messages").insert([
      { session_key: "primary", role: "user", content: data.message },
      { session_key: "primary", role: "assistant", content: result.text },
    ]);
    if (insertError.error) throw new Error(insertError.error.message);
    return { reply: result.text };
  });