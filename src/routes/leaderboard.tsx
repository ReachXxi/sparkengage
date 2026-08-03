import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { StageShell } from "@/components/stage/StageShell";
import { LeaderboardModule } from "@/components/stage/LeaderboardModule";
import { campaigns } from "@/data/stage";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Live campaign leaderboards — SPARKFAN" },
      {
        name: "description",
        content: "See the top 100 fans per campaign, your live rank and the prizes on the line, updated in real time.",
      },
      { property: "og:title", content: "Live campaign leaderboards — SPARKFAN" },
      { property: "og:description", content: "Top fans, your rank and campaign prizes, updating live." },
    ],
  }),
  component: LeaderboardPage,
});

function LeaderboardPage() {
  const [active, setActive] = useState(campaigns[0]!.id);
  const campaign = campaigns.find((c) => c.id === active)!;

  return (
    <StageShell>
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl">Leaderboards 🏆</h1>
          <p className="text-sm text-muted-foreground">Live ranks. Refreshes as fans earn.</p>
        </header>
        <div className="flex flex-wrap gap-2">
          {campaigns.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActive(c.id)}
              className={cn(
                "rounded-full border-2 px-4 py-2 text-sm font-semibold",
                active === c.id ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted",
              )}
            >
              {c.title}
            </button>
          ))}
        </div>
        <LeaderboardModule key={campaign.id} campaign={campaign} />
      </div>
    </StageShell>
  );
}
