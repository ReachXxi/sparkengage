import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { StageShell } from "@/components/stage/StageShell";
import { GamesModule } from "@/components/stage/GamesModule";
import { campaigns } from "@/data/stage";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/games")({
  head: () => ({
    meta: [
      { title: "Play lyric games, 4 Pics 1 Word & Guess the Celeb — SPARKFAN" },
      {
        name: "description",
        content: "Unscramble the lyrics, crack 4 Pics 1 Word and guess the blurred celebrity across every live SPARKFAN campaign.",
      },
      { property: "og:title", content: "Play lyric games & celeb guessing — SPARKFAN" },
      { property: "og:description", content: "Three fast games per campaign, timed and scored. Earn points as you play." },
    ],
  }),
  component: GamesPage,
});

function GamesPage() {
  const [active, setActive] = useState(campaigns[0]!.id);
  const campaign = campaigns.find((c) => c.id === active)!;

  return (
    <StageShell>
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl">Games arcade 🎮</h1>
          <p className="text-sm text-muted-foreground">Pick a campaign, play fast, bank points.</p>
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
        <GamesModule key={campaign.id} campaign={campaign} />
      </div>
    </StageShell>
  );
}
