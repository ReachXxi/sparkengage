CREATE TABLE public.game_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id TEXT NOT NULL,
  game TEXT NOT NULL,
  entry_fee INTEGER NOT NULL DEFAULT 0,
  challenger_name TEXT NOT NULL,
  opponent_name TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'active', 'finished', 'cancelled')),
  winner_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.game_matches TO anon, authenticated;
GRANT ALL ON public.game_matches TO service_role;
ALTER TABLE public.game_matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view public game lobbies" ON public.game_matches FOR SELECT TO anon, authenticated USING (true);

CREATE OR REPLACE FUNCTION public.update_game_match_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
CREATE TRIGGER game_matches_updated_at
BEFORE UPDATE ON public.game_matches
FOR EACH ROW EXECUTE FUNCTION public.update_game_match_timestamp();

ALTER PUBLICATION supabase_realtime ADD TABLE public.game_matches;