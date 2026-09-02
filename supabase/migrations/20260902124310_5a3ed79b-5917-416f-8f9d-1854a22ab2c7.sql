CREATE TABLE public.campaign_overrides (
  campaign_id TEXT PRIMARY KEY,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  published BOOLEAN NOT NULL DEFAULT true,
  updated_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.campaign_overrides TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.campaign_overrides TO authenticated;
GRANT ALL ON public.campaign_overrides TO service_role;
ALTER TABLE public.campaign_overrides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published campaign overrides" ON public.campaign_overrides FOR SELECT TO anon, authenticated USING (published = true);

CREATE TABLE public.campaign_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id TEXT NOT NULL,
  display_name TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.campaign_chat_messages TO anon, authenticated;
GRANT ALL ON public.campaign_chat_messages TO service_role;
ALTER TABLE public.campaign_chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view campaign chat" ON public.campaign_chat_messages FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.campaign_builder_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_key TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.campaign_builder_messages TO service_role;
ALTER TABLE public.campaign_builder_messages ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.update_campaign_override_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
CREATE TRIGGER campaign_overrides_updated_at
BEFORE UPDATE ON public.campaign_overrides
FOR EACH ROW EXECUTE FUNCTION public.update_campaign_override_timestamp();

ALTER PUBLICATION supabase_realtime ADD TABLE public.campaign_overrides;
ALTER PUBLICATION supabase_realtime ADD TABLE public.campaign_chat_messages;