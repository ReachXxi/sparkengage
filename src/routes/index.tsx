import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { StageShell } from "@/components/stage/StageShell";
import { SpinWheel } from "@/components/stage/SpinWheel";
import { CampaignCard, TimeLeft } from "@/components/stage/CampaignCard";
import { Tutorial } from "@/components/stage/Tutorial";
import { campaigns } from "@/data/stage";
import { ads } from "@/data/console";

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
          "Join the ORIADÉ album takeover on SPARKFAN: stream Davido's 13-track sixth album on every platform, play Naija quizzes, 4 Pics 1 Word and lyric games, then cash your points for merch and tickets.",
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

        <AdsSection />

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

function AdsSection() {
  const running = ads.filter((a) => a.status === "active" || a.status === "scheduled");
  const featured = running.find((a) => a.featured) ?? running[0];
  if (!featured) return null;
  const rest = running.filter((a) => a.id !== featured.id).slice(0, 2);

  return (
    <section className="space-y-4" aria-labelledby="ads-heading">
      <div className="flex items-end justify-between">
        <div>
          <h2 id="ads-heading" className="text-2xl">
            Sponsored
          </h2>
          <p className="text-sm text-muted-foreground">Drops and offers from partners inside the SPARKFAN network.</p>
        </div>
      </div>

      <article className="overflow-hidden rounded-3xl bg-card shadow-card md:grid md:grid-cols-2">
        <img
          src={featured.banner}
          alt={`${featured.advertiser} — ${featured.headline}`}
          loading="lazy"
          className="h-56 w-full object-cover object-top md:h-full"
        />
        <div className="space-y-3 p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-highlight">
            Sponsored · {featured.advertiser}
          </p>
          <h3 className="text-2xl">{featured.headline}</h3>
          <p className="text-sm text-muted-foreground">{featured.body}</p>
          <div className="flex flex-wrap gap-2 pt-1">
            {featured.targeting.slice(0, 4).map((t) => (
              <span key={t} className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                {t}
              </span>
            ))}
          </div>
          <Button asChild size="lg" className="mt-2 rounded-full bg-sun font-bold text-accent-foreground">
            {featured.ctaUrl.startsWith("http") ? (
              <a href={featured.ctaUrl} target="_blank" rel="noreferrer">
                {featured.cta}
              </a>
            ) : (
              <Link to={featured.ctaUrl}>{featured.cta}</Link>
            )}
          </Button>
        </div>
      </article>

      {rest.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2">
          {rest.map((ad) => (
            <article key={ad.id} className="overflow-hidden rounded-3xl bg-card shadow-card">
              <img src={ad.banner} alt={`${ad.advertiser} banner`} loading="lazy" className="h-36 w-full object-cover" />
              <div className="space-y-2 p-5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                  Sponsored · {ad.advertiser}
                </p>
                <h3 className="text-lg">{ad.headline}</h3>
                <p className="line-clamp-2 text-sm text-muted-foreground">{ad.body}</p>
                <Button asChild variant="outline" className="mt-1 rounded-full font-bold">
                  {ad.ctaUrl.startsWith("http") ? (
                    <a href={ad.ctaUrl} target="_blank" rel="noreferrer">
                      {ad.cta}
                    </a>
                  ) : (
                    <Link to={ad.ctaUrl}>{ad.cta}</Link>
                  )}
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
