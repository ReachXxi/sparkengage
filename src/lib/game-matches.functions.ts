import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MatchInput = z.object({
  campaignId: z.string().min(1).max(120),
  game: z.string().min(1).max(80),
  entryFee: z.number().int().min(0).max(100000),
  playerName: z.string().trim().min(1).max(40),
});

export const listGameMatches = createServerFn({ method: "GET" })
  .inputValidator((input: { campaignId: string }) => input)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("game_matches")
      .select("id, campaign_id, game, entry_fee, challenger_name, opponent_name, status, winner_name, created_at")
      .eq("campaign_id", data.campaignId)
      .in("status", ["open", "active"])
      .order("created_at", { ascending: false })
      .limit(20);
    if (error) throw new Error(error.message);
    return rows;
  });

export const createGameMatch = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => MatchInput.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("game_matches")
      .insert({
        campaign_id: data.campaignId,
        game: data.game,
        entry_fee: data.entryFee,
        challenger_name: data.playerName,
      })
      .select("id, campaign_id, game, entry_fee, challenger_name, opponent_name, status, winner_name, created_at")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const joinGameMatch = createServerFn({ method: "POST" })
  .inputValidator((input: { matchId: string; playerName: string }) => input)
  .handler(async ({ data }) => {
    const playerName = data.playerName.trim().slice(0, 40);
    if (!data.matchId || !playerName) throw new Error("A match and player name are required");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("game_matches")
      .update({ opponent_name: playerName, status: "active" })
      .eq("id", data.matchId)
      .eq("status", "open")
      .select("id, campaign_id, game, entry_fee, challenger_name, opponent_name, status, winner_name, created_at")
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) throw new Error("That lobby was just filled. Pick another one.");
    return row;
  });