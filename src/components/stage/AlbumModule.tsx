import { Crown, Disc3, CalendarDays, Users2, Sparkles } from "lucide-react";
import type { Campaign } from "@/data/stage";

export function AlbumModule({ campaign }: { campaign: Campaign }) {
  const album = campaign.album;
  if (!album) return null;

  return (
    <div className="space-y-5">
      <section className="grid gap-5 rounded-3xl bg-card p-5 shadow-card sm:grid-cols-[minmax(0,260px)_1fr]">
        <img
          src={album.cover}
          alt={`${album.title} official tracklist artwork`}
          width={780}
          height={1000}
          loading="lazy"
          className="w-full rounded-2xl object-cover shadow-pop"
        />
        <div className="space-y-4">
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
              <Crown className="size-3" /> Sixth studio album
            </span>
            <h2 className="mt-3 text-3xl">{album.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{album.meaning}</p>
          </div>

          <dl className="grid grid-cols-3 gap-2">
            <Metric icon={<CalendarDays className="size-4" />} label="Released" value={album.releaseDate} />
            <Metric icon={<Disc3 className="size-4" />} label="Tracks" value={String(album.trackCount)} />
            <Metric icon={<Users2 className="size-4" />} label="Features" value={String(album.featureCount)} />
          </dl>

          <ul className="flex flex-wrap gap-2">
            {album.themes.map((theme) => (
              <li key={theme} className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                {theme}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-3xl bg-card p-5 shadow-card">
        <h3 className="flex items-center gap-2 text-xl">
          <Sparkles className="size-4 text-primary" /> Official tracklist
        </h3>
        <ol className="mt-4 divide-y divide-border">
          {album.tracklist.map((track) => (
            <li key={track.no} className="flex gap-4 py-3">
              <span className="w-6 shrink-0 text-sm font-bold tabular-nums text-muted-foreground">
                {String(track.no).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <p className="font-bold leading-tight">
                  {track.title}
                  {track.features ? (
                    <span className="ml-2 text-xs font-semibold uppercase tracking-wide text-primary">
                      {track.features}
                    </span>
                  ) : null}
                </p>
                {track.note ? <p className="mt-0.5 text-xs text-muted-foreground">{track.note}</p> : null}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        {album.facts.map((fact) => (
          <article key={fact.label} className="rounded-2xl bg-card p-4 shadow-card">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{fact.label}</p>
            <p className="mt-2 text-sm">{fact.body}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <article className="rounded-2xl border border-border bg-muted/40 p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">The praise</p>
          <p className="mt-2 text-sm">{album.reception.praise}</p>
        </article>
        <article className="rounded-2xl border border-border bg-muted/40 p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-destructive">The criticism</p>
          <p className="mt-2 text-sm">{album.reception.criticism}</p>
        </article>
      </section>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-muted p-3">
      <dt className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {icon}
        {label}
      </dt>
      <dd className="mt-1 text-sm font-bold">{value}</dd>
    </div>
  );
}
