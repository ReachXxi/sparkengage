import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Clock, Users } from "lucide-react";
import type { Campaign } from "@/data/stage";
import { Button } from "@/components/ui/button";

export function timeLeft(endsAt: string) {
  const ms = new Date(endsAt).getTime() - Date.now();
  if (ms <= 0) return "Ended";
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  if (h >= 24) return `${Math.floor(h / 24)}d ${h % 24}h left`;
  return `${h}h ${m}m left`;
}

/** Client-only so SSR HTML never disagrees with the hydrated clock. */
export function useTimeLeft(endsAt: string) {
  const [label, setLabel] = useState<string | null>(null);
  useEffect(() => {
    setLabel(timeLeft(endsAt));
    const t = setInterval(() => setLabel(timeLeft(endsAt)), 30000);
    return () => clearInterval(t);
  }, [endsAt]);
  return label;
}

export function TimeLeft({ endsAt }: { endsAt: string }) {
  const label = useTimeLeft(endsAt);
  return <span suppressHydrationWarning>{label ?? "Counting down…"}</span>;
}


export function CampaignCard({ campaign }: { campaign: Campaign }) {
  return (
    <article className="group overflow-hidden rounded-3xl bg-card shadow-card transition-transform duration-200 hover:scale-[1.02] hover:shadow-pop">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={campaign.hero}
          alt={`${campaign.title} campaign artwork`}
          loading="lazy"
          width={1280}
          height={720}
          className="size-full object-cover"
        />
        <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
          {campaign.type}
        </span>
        {campaign.live && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-highlight px-3 py-1 text-xs font-bold text-highlight-foreground">
            ● LIVE
          </span>
        )}
      </div>
      <div className="space-y-3 p-5">
        <div>
          <h3 className="text-lg leading-tight">{campaign.title}</h3>
          <p className="text-sm text-muted-foreground">by {campaign.creator}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" /> <TimeLeft endsAt={campaign.endsAt} />
          </span>
          <span className="flex items-center gap-1">
            <Users className="size-3.5" /> {campaign.participants.toLocaleString()} in
          </span>
        </div>
        <Button asChild className="w-full rounded-full font-bold">
          <Link to="/campaign/$id" params={{ id: campaign.id }}>
            Join Now
          </Link>
        </Button>
      </div>
    </article>
  );
}
