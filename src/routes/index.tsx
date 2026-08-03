import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { StageShell } from "@/components/stage/StageShell";
import { SpinWheel } from "@/components/stage/SpinWheel";
import { CampaignCard, TimeLeft } from "@/components/stage/CampaignCard";
import { Tutorial } from "@/components/stage/Tutorial";
import { campaigns } from "@/data/stage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SPARKFAN — Stream, play & earn with Naija's biggest drops" },
      {
        name: "description",
        content:
          "Join the ORIADÉ album takeover on SPARKFAN: stream Davido's 13-track sixth album on every platform, play Naija quizzes, 4 Pics 1 Word and lyric games, then cash your points for merch and tickets.",
      },

      { property: "og:title", content: "SPARKFAN — Stream, play & earn with Naija's biggest drops" },
      {
        property: "og:description",
        content:
          "Spin daily, play Nigerian quizzes and games, earn points and redeem merch, tickets and exclusive drops.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const live = campaigns.find((c) => c.live)!;

  return (
    <StageShell>
      <Tutorial />
      <div className="space-y-10">
        <section className="relative overflow-hidden rounded-3xl shadow-pop">
          <img
            src={live.hero}
            alt={`${live.title} live now`}
            width={1280}
            height={720}
            className="h-72 w-full object-cover sm:h-96"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
          <div className="absolute bottom-0 space-y-3 p-6 text-primary-foreground sm:p-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-highlight px-3 py-1 text-xs font-bold text-highlight-foreground">
              ● LIVE NOW
            </span>
            <h1 className="max-w-2xl text-3xl sm:text-5xl">{live.title}</h1>
            <p className="max-w-xl text-sm text-primary-foreground/90 sm:text-base">{live.description}</p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button asChild size="lg" className="rounded-full bg-sun font-bold text-accent-foreground">
                <Link to="/campaign/$id" params={{ id: live.id }}>
                  Enter the takeover
                </Link>
              </Button>
              <span className="text-sm font-semibold">
                {live.participants.toLocaleString()} fans inside · <TimeLeft endsAt={live.endsAt} />
              </span>
            </div>
          </div>
        </section>

        <SpinWheel />

        <section className="space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl">Trending right now 🔥</h2>
              <p className="text-sm text-muted-foreground">Where the gbedu is loudest this hour.</p>
            </div>
          </div>
          <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:px-0">
            {[...campaigns]
              .sort((a, b) => b.actions - a.actions)
              .map((c) => (
                <div key={c.id} className="w-[85%] shrink-0 md:w-auto">
                  <CampaignCard campaign={c} />
                </div>
              ))}
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-2xl">Picked for you</h2>
            <p className="text-sm text-muted-foreground">Based on what you've been streaming and playing.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((c) => (
              <CampaignCard key={`rec-${c.id}`} campaign={c} />
            ))}
          </div>
        </section>
      </div>
    </StageShell>
  );
}
