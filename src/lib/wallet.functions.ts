import { randomUUID } from "node:crypto";
import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { z } from "zod";

type WalletSession = { walletId?: string };

function sessionConfig() {
  const password = process.env["SESSION_SECRET"];
  if (!password) throw new Error("SESSION_SECRET is not configured");
  return {
    password,
    name: "sparkfan-wallet-session",
    maxAge: 60 * 60 * 24 * 30,
    cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
  };
}

async function getWallet() {
  const session = await useSession<WalletSession>(sessionConfig());
  let walletId = session.data.walletId;
  if (!walletId) {
    walletId = randomUUID();
    await session.update({ walletId });
  }
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const db = supabaseAdmin as unknown as { from: (table: string) => any };
  const { data, error } = await db
    .from("coin_wallets")
    .upsert({ id: walletId }, { onConflict: "id" })
    .select("id, balance, lifetime_purchased, lifetime_earned, updated_at")
    .single();
  if (error) throw new Error(error.message);
  return { session, wallet: data, db };
}

export const getWalletSummary = createServerFn({ method: "GET" }).handler(async () => {
  const { wallet, db } = await getWallet();
  const { data: transactions, error } = await db
    .from("coin_transactions")
    .select("id, type, amount, description, created_at")
    .eq("wallet_id", wallet.id)
    .order("created_at", { ascending: false })
    .limit(40);
  if (error) throw new Error(error.message);
  return { wallet, transactions };
});

export const buySparkCoins = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ amount: z.number().int().min(10).max(100000) }).parse(input))
  .handler(async ({ data }) => {
    const { wallet, db } = await getWallet();
    const { error } = await db.from("coin_transactions").insert({
      wallet_id: wallet.id,
      type: "purchase_pending",
      amount: data.amount,
      description: "Payment checkout requested; awaiting verification",
    });
    if (error) throw new Error(error.message);
    return { balance: wallet.balance, paymentRequired: true, checkoutReady: false };
  });

export const redeemSparkCoins = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ title: z.string().trim().min(1).max(120), amount: z.number().int().min(1).max(100000) }).parse(input))
  .handler(async ({ data }) => {
    const { wallet, db } = await getWallet();
    if (wallet.balance < data.amount) throw new Error("Not enough Spark Coins for this redemption");
    const nextBalance = wallet.balance - data.amount;
    const { error: walletError } = await db
      .from("coin_wallets")
      .update({ balance: nextBalance })
      .eq("id", wallet.id)
      .eq("balance", wallet.balance);
    if (walletError) throw new Error(walletError.message);
    const { error } = await db.from("coin_transactions").insert({
      wallet_id: wallet.id,
      type: "redemption",
      amount: -data.amount,
      description: `Redeemed ${data.title}`,
    });
    if (error) throw new Error(error.message);
    return { ok: true as const, balance: nextBalance };
  });

export const enterCampaignWithCoins = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ campaignId: z.string().min(1).max(120), fee: z.number().int().min(0).max(100000) }).parse(input))
  .handler(async ({ data }) => {
    const { wallet, db } = await getWallet();
    const { data: existing } = await db
      .from("campaign_entries")
      .select("id, entry_type, coins_paid")
      .eq("wallet_id", wallet.id)
      .eq("campaign_id", data.campaignId)
      .maybeSingle();
    if (existing) return { ok: true as const, alreadyEntered: true as const, balance: wallet.balance };
    if (wallet.balance < data.fee) throw new Error("Not enough Spark Coins for this entry");
    const nextBalance = wallet.balance - data.fee;
    const { error: walletError } = await db
      .from("coin_wallets")
      .update({ balance: nextBalance })
      .eq("id", wallet.id)
      .eq("balance", wallet.balance);
    if (walletError) throw new Error(walletError.message);
    const { error: entryError } = await db.from("campaign_entries").insert({
      wallet_id: wallet.id,
      campaign_id: data.campaignId,
      entry_type: data.fee > 0 ? "coins" : "free",
      coins_paid: data.fee,
    });
    if (entryError) throw new Error(entryError.message);
    if (data.fee > 0) {
      const { error } = await db.from("coin_transactions").insert({
        wallet_id: wallet.id,
        type: "campaign_entry",
        amount: -data.fee,
        description: `Entry for ${data.campaignId}`,
      });
      if (error) throw new Error(error.message);
    }
    return { ok: true as const, alreadyEntered: false as const, balance: nextBalance };
  });