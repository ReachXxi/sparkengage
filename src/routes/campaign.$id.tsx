import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Flag, Gamepad2, MessageCircle, Send, Users, Zap } from "lucide-react";
import { toast } from "sonner";
import { StageShell } from "@/components/stage/StageShell";
import { StreamModule } from "@/components/stage/StreamModule";
import { AlbumModule } from "@/components/stage/AlbumModule";

import { QuizModule } from "@/components/stage/QuizModule";
import { GamesModule } from "@/components/stage/GamesModule";
import { SocialModule } from "@/components/stage/SocialModule";
import { LeaderboardModule } from "@/components/stage/LeaderboardModule";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { campaigns, type Campaign } from "@/data/stage";
import { getPublishedCampaignOverride } from "@/lib/campaign-data.functions";
import { listCampaignChat, sendCampaignChat } from "@/lib/campaign-chat.functions";
import { createGameMatch, joinGameMatch, listGameMatches } from "@/lib/game-matches.functions";
import { supabase } from "@/integrations/supabase/client";
import { enterCampaignWithCoins } from "@/lib/wallet.functions";
import { useServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/campaign/$id")({
  loader: async ({ params }) => {
    const campaign = campaigns.find((c) => c.id === params.id);
    if (!campaign) throw notFound();
    const override = await getPublishedCampaignOverride({ data: { campaignId: params.id } }).catch(() => null);
    if (!override?.payload || typeof override.payload !== "object" || Array.isArray(override.payload)) return { campaign };
    return { campaign: { ...campaign, ...override.payload } as Campaign };
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.campaign.title} — SPARKFAN campaign` : "Campaign — SPARKFAN";
    const description = loaderData
      ? `${loaderData.campaign.description} Stream, play and earn points on SPARKFAN.`
      : "Join the campaign, play games and earn points on SPARKFAN.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: CampaignPage,
});

function useCountdown(endsAt: string) {
  const [label, setLabel] = useState("");
  useEffect(() => {
    const tick = () => {
      const ms = new Date(endsAt).getTime() - Date.now();
      if (ms <= 0) return setLabel("Campaign ended");
      const d = Math.floor(ms / 86400000);
      const h = Math.floor((ms % 86400000) / 3600000);
      const m = Math.floor((ms % 3600000) / 60000);
      const s = Math.floor((ms % 60000) / 1000);
      setLabel(`${d}d ${h}h ${m}m ${s}s`);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [endsAt]);
  return label;
}

function CampaignPage() {
  const { campaign } = Route.useLoaderData() as { campaign: Campaign };
  const countdown = useCountdown(campaign.endsAt);
  const [participants, setParticipants] = useState(campaign.participants);
  const [actions, setActions] = useState(campaign.actions);
  const enterCampaign = useServerFn(enterCampaignWithCoins);
  const [entryBusy, setEntryBusy] = useState(false);
  const entryMode = campaign.entryMode ?? "free";
  const entryFee = entryMode === "coins" ? Math.max(0, campaign.entryFee ?? 0) : 0;

  useEffect(() => {
    const channel = supabase
      .channel(`campaign-live-${campaign.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "campaign_overrides", filter: `campaign_id=eq.${campaign.id}` }, (event) => {
        const next = event.new as { payload?: unknown };
        if (!next.payload || typeof next.payload !== "object" || Array.isArray(next.payload)) return;
        const payload = next.payload as Partial<Campaign>;
        setParticipants(payload.participants ?? campaign.participants);
        setActions(payload.actions ?? campaign.actions);
      })
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [campaign.id, campaign.participants, campaign.actions]);

  return (
    <StageShell>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl shadow-pop">
          <img
            src={campaign.hero}
            alt={`${campaign.title} hero`}
            width={1280}
            height={720}
            className="h-64 w-full object-cover sm:h-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
          <div className="absolute bottom-0 w-full space-y-2 p-6 text-primary-foreground">
            <span className="inline-block rounded-full bg-primary px-3 py-1 text-xs font-bold">{campaign.type}</span>
            <h1 className="text-3xl sm:text-4xl">{campaign.title}</h1>
            <p className="text-sm text-primary-foreground/90">by {campaign.creator}</p>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-4">
          <Stat icon={<Users className="size-4" />} label="Participants" value={participants.toLocaleString()} />
          <Stat icon={<Zap className="size-4" />} label="Actions completed" value={actions.toLocaleString()} />
          <Stat label="Ends in" value={countdown} />
          <div className="flex items-center justify-between rounded-2xl bg-card p-4 shadow-card">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Prize</p>
              <p className="text-sm font-semibold">{campaign.prize}</p>
            </div>
          </div>
        </section>

        <Tabs defaultValue={campaign.album ? "album" : "stream"}>
          <TabsList className="w-full justify-start overflow-x-auto rounded-full bg-muted p-1">
            {[...(campaign.album ? ["album"] : []), "stream", "quiz", "games", "social", "leaderboard", "chat", "p2p"].map((t) => (
              <TabsTrigger key={t} value={t} className="rounded-full px-4 font-bold capitalize">
                {t === "social" ? "Social Tasks" : t}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="mt-5">
            {campaign.album ? (
              <TabsContent value="album">
                <AlbumModule campaign={campaign} />
              </TabsContent>
            ) : null}
            <TabsContent value="stream">
              <StreamModule campaign={campaign} />
            </TabsContent>

            <TabsContent value="quiz">
              <QuizModule campaign={campaign} />
            </TabsContent>
            <TabsContent value="games">
              <GamesModule campaign={campaign} />
            </TabsContent>
            <TabsContent value="social">
              <SocialModule campaign={campaign} />
            </TabsContent>
            <TabsContent value="leaderboard">
              <LeaderboardModule campaign={campaign} />
            </TabsContent>
            <TabsContent value="chat">
              <CampaignChat campaignId={campaign.id} />
            </TabsContent>
            <TabsContent value="p2p">
              <P2PLobby campaignId={campaign.id} />
            </TabsContent>
          </div>
        </Tabs>

        <section className="rounded-3xl border border-border bg-card p-5 shadow-card sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div><p className="text-xs font-bold uppercase tracking-widest text-highlight">Campaign entry</p><h2 className="mt-1 text-2xl">Join the fan experience</h2><p className="mt-1 text-sm text-muted-foreground">Choose free access or redeem Spark Coins when this campaign uses a paid entry.</p></div>
            <Button
              className="rounded-full font-bold"
              disabled={entryBusy}
              onClick={async () => {
                setEntryBusy(true);
                try {
                  await enterCampaign({ data: { campaignId: campaign.id, fee: entryFee } });
                  toast.success(entryFee ? `You're in — ${entryFee.toLocaleString()} Spark Coins redeemed.` : "You're in — free entry confirmed.");
                } catch (error) {
                  toast.error(error instanceof Error ? error.message : "Entry could not be completed");
                } finally { setEntryBusy(false); }
              }}
            >
              {entryBusy ? "Joining…" : entryFee ? `Join for ${entryFee.toLocaleString()} Coins` : "Join for free"}
            </Button>
          </div>
        </section>

        <Button
          variant="ghost"
          className="rounded-full text-sm font-semibold text-muted-foreground"
          onClick={() => toast.success("Report submitted. Our moderators will take a look.")}
        >
          <Flag className="mr-1 size-4" /> Report this campaign
        </Button>
      </div>
    </StageShell>
  );
}

function CampaignChat({ campaignId }: { campaignId: string }) {
  const [messages, setMessages] = useState<Array<{ id: string; display_name: string; body: string; created_at: string }>>([]);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  useEffect(() => {
    let active = true;
    void listCampaignChat({ data: { campaignId } }).then((rows) => { if (active) setMessages(rows); }).catch(() => undefined);
    const channel = supabase
      .channel(`campaign-chat-${campaignId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "campaign_chat_messages", filter: `campaign_id=eq.${campaignId}` }, (event) => {
        const message = event.new as typeof messages[number];
        setMessages((current) => current.some((item) => item.id === message.id) ? current : [...current, message].slice(-80));
      })
      .subscribe();
    return () => { active = false; void supabase.removeChannel(channel); };
  }, [campaignId]);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !body.trim()) return;
    await sendCampaignChat({ data: { campaignId, displayName: name, body } });
    setBody("");
  };
  return <section className="rounded-3xl bg-card p-6 shadow-card"><div className="flex items-center gap-2"><MessageCircle className="size-5 text-highlight" /><div><h3 className="text-2xl">Campaign chatroom</h3><p className="text-sm text-muted-foreground">Talk with everyone following this drop.</p></div></div><div className="mt-5 max-h-80 space-y-3 overflow-y-auto rounded-2xl bg-muted p-4">{messages.length ? messages.map((message) => <div key={message.id}><p className="text-xs font-bold text-highlight">{message.display_name}</p><p className="text-sm">{message.body}</p></div>) : <p className="text-sm text-muted-foreground">Be the first to say hello.</p>}</div><form onSubmit={submit} className="mt-4 grid gap-2 sm:grid-cols-[9rem_1fr_auto]"><Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" maxLength={40} /><Input value={body} onChange={(event) => setBody(event.target.value)} placeholder="Drop a message…" maxLength={500} /><Button type="submit" size="icon" aria-label="Send message" className="rounded-full"><Send className="size-4" /></Button></form></section>;
}

function P2PLobby({ campaignId }: { campaignId: string }) {
  const [matches, setMatches] = useState<Array<{ id: string; game: string; entry_fee: number; challenger_name: string; opponent_name: string | null }>>([]);
  const [playerName, setPlayerName] = useState("");
  const [game, setGame] = useState("Guess the Celebrity");
  const [entryFee, setEntryFee] = useState("0");
  const refresh = () => void listGameMatches({ data: { campaignId } }).then(setMatches).catch(() => undefined);
  useEffect(() => {
    refresh();
    const channel = supabase.channel(`p2p-${campaignId}`).on("postgres_changes", { event: "*", schema: "public", table: "game_matches", filter: `campaign_id=eq.${campaignId}` }, refresh).subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [campaignId]);
  const create = async () => { if (!playerName.trim()) return; await createGameMatch({ data: { campaignId, game, entryFee: Number(entryFee) || 0, playerName } }); setPlayerName(""); refresh(); };
  return <section className="rounded-3xl bg-card p-6 shadow-card"><div className="flex items-center gap-2"><Gamepad2 className="size-5 text-highlight" /><div><h3 className="text-2xl">P2P game lobbies</h3><p className="text-sm text-muted-foreground">Create a challenge or join another fan. Coin stakes are recorded server-side.</p></div></div><div className="mt-5 grid gap-2 sm:grid-cols-[1fr_1fr_7rem_auto]"><Input value={playerName} onChange={(event) => setPlayerName(event.target.value)} placeholder="Your name" maxLength={40} /><select value={game} onChange={(event) => setGame(event.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm"><option>Guess the Celebrity</option><option>4 Pics 1 Word</option><option>Unscramble the Lyrics</option></select><Input type="number" min="0" value={entryFee} onChange={(event) => setEntryFee(event.target.value)} placeholder="Coins" /><Button onClick={() => void create()} className="rounded-full font-bold">Create lobby</Button></div><div className="mt-5 space-y-2">{matches.length ? matches.map((match) => <div key={match.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border p-4"><div><p className="font-bold">{match.game} · {match.entry_fee} Coins</p><p className="text-sm text-muted-foreground">{match.challenger_name} is looking for an opponent</p></div>{match.opponent_name ? <span className="text-sm font-semibold text-success">{match.opponent_name} joined</span> : <Button variant="outline" className="rounded-full" onClick={() => void joinGameMatch({ data: { matchId: match.id, playerName: playerName || "Guest fan" } }).then(refresh)}>Join match</Button>}</div>) : <p className="rounded-2xl bg-muted p-4 text-sm text-muted-foreground">No open lobbies yet. Start the first challenge.</p>}</div></section>;
}

function Stat({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-card p-4 shadow-card">
      <p className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {icon} {label}
      </p>
      <p className="mt-1 font-display text-xl font-bold tabular-nums">{value}</p>
    </div>
  );
}
