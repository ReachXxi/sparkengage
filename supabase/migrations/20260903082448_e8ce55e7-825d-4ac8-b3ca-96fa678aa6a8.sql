CREATE TABLE public.coin_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  balance INTEGER NOT NULL DEFAULT 0 CHECK (balance >= 0),
  lifetime_purchased INTEGER NOT NULL DEFAULT 0 CHECK (lifetime_purchased >= 0),
  lifetime_earned INTEGER NOT NULL DEFAULT 0 CHECK (lifetime_earned >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.coin_wallets TO anon, authenticated;
GRANT ALL ON public.coin_wallets TO service_role;
ALTER TABLE public.coin_wallets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Wallet access is server mediated" ON public.coin_wallets FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);

CREATE TABLE public.coin_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES public.coin_wallets(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('purchase_pending', 'campaign_entry', 'reward_redemption', 'game_stake', 'game_reward', 'earn')),
  amount INTEGER NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.coin_transactions TO anon, authenticated;
GRANT ALL ON public.coin_transactions TO service_role;
ALTER TABLE public.coin_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Coin transactions are server mediated" ON public.coin_transactions FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);

CREATE TABLE public.campaign_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES public.coin_wallets(id) ON DELETE CASCADE,
  campaign_id TEXT NOT NULL,
  entry_type TEXT NOT NULL CHECK (entry_type IN ('free', 'coins')),
  coins_paid INTEGER NOT NULL DEFAULT 0 CHECK (coins_paid >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (wallet_id, campaign_id)
);
GRANT SELECT, INSERT ON public.campaign_entries TO anon, authenticated;
GRANT ALL ON public.campaign_entries TO service_role;
ALTER TABLE public.campaign_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Campaign entries are server mediated" ON public.campaign_entries FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);

CREATE OR REPLACE FUNCTION public.update_coin_wallet_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
CREATE TRIGGER coin_wallets_updated_at
BEFORE UPDATE ON public.coin_wallets
FOR EACH ROW EXECUTE FUNCTION public.update_coin_wallet_timestamp();

ALTER PUBLICATION supabase_realtime ADD TABLE public.coin_wallets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.coin_transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.campaign_entries;