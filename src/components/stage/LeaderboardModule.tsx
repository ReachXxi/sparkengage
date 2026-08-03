import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import { useStage } from "@/lib/stage-store";
import type { Campaign } from "@/data/stage";
import { cn } from "@/lib/utils";

export function LeaderboardModule({ campaign }: { campaign: Campaign }) {
  const { state } = useStage();
  const [rows, setRows] = useState(campaign.leaderboard);

  // Simulated real-time updates (stands in for the websocket feed).
  useEffect(() => {
    const t = setInterval(() => {
      setRows((prev) =>
        [...prev]
          .map((r) => ({ ...r, points: r.points + Math.floor(Math.random() * 40) }))
          .sort((a, b) => b.points - a.points),
      );
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const me = { name: `${state.displayName} (you)`, points: state.points };
  const all = [...rows, me].sort((a, b) => b.points - a.points);
  const myRank = all.findIndex((r) => r.name === me.name) + 1;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-sun p-6 text-accent-foreground shadow-pop">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest">Your rank</p>
          <p className="font-display text-4xl font-bold">#{myRank}</p>
        </div>
        <div className="max-w-sm text-sm font-semibold">
          🏆 {campaign.prize}
        </div>
      </div>

      <ol className="overflow-hidden rounded-3xl bg-card shadow-card">
        {all.slice(0, 20).map((row, i) => {
          const isMe = row.name === me.name;
          return (
            <li
              key={row.name}
              className={cn(
                "flex items-center justify-between border-b border-border/60 px-5 py-3 text-sm font-semibold last:border-0",
                isMe && "bg-primary text-primary-foreground",
              )}
            >
              <span className="flex items-center gap-3">
                <span className="w-8 tabular-nums">#{i + 1}</span>
                {i === 0 && <Trophy className="size-4 text-accent" />}
                {row.name}
              </span>
              <span className="tabular-nums">{row.points.toLocaleString()} pts</span>
            </li>
          );
        })}
      </ol>
      <p className="text-xs text-muted-foreground">Board refreshes live as fans earn points.</p>
    </div>
  );
}
