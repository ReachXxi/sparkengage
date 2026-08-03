import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Flag, Users, Zap } from "lucide-react";
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
import { campaigns, type Campaign } from "@/data/stage";

export const Route = createFileRoute("/campaign/$id")({
  loader: ({ params }) => {
    const campaign = campaigns.find((c) => c.id === params.id);
    if (!campaign) throw notFound();
    return { campaign };
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

  useEffect(() => {
    const t = setInterval(() => {
      setParticipants((p: number) => p + Math.floor(Math.random() * 3));
      setActions((a: number) => a + Math.floor(Math.random() * 12));
    }, 3000);
    return () => clearInterval(t);
  }, []);

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

        <Tabs defaultValue="stream">
          <TabsList className="w-full justify-start overflow-x-auto rounded-full bg-muted p-1">
            {["stream", "quiz", "games", "social", "leaderboard"].map((t) => (
              <TabsTrigger key={t} value={t} className="rounded-full px-4 font-bold capitalize">
                {t === "social" ? "Social Tasks" : t}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="mt-5">
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
          </div>
        </Tabs>

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
