import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { StageShell } from "@/components/stage/StageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStage } from "@/lib/stage-store";
import { badgeCatalog, campaigns } from "@/data/stage";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your SPARKFAN profile, badges & trivia deck" },
      {
        name: "description",
        content: "See your total points, unlocked badges, campaign history, saved fun facts and friends on SPARKFAN.",
      },
      { property: "og:title", content: "Your SPARKFAN profile, badges & trivia deck" },
      { property: "og:description", content: "Points, badges, campaign history and your saved trivia deck." },
    ],
  }),
  component: ProfilePage,
});

const friends = [
  { name: "TundeTheGoat", points: 3120 },
  { name: "ZaraVibes", points: 2870 },
  { name: "KemiKash", points: 1990 },
];

function ProfilePage() {
  const { state, unlockedBadges, setDisplayName } = useStage();

  return (
    <StageShell>
      <div className="space-y-8">
        <section className="flex flex-col gap-5 rounded-3xl bg-stage p-8 text-primary-foreground shadow-pop sm:flex-row sm:items-center">
          <div className="grid size-20 shrink-0 place-items-center rounded-full bg-sun text-3xl font-bold text-accent-foreground">
            {state.displayName.slice(0, 1).toUpperCase()}
          </div>
          <div className="flex-1 space-y-2">
            <Input
              value={state.displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="max-w-xs rounded-full border-white/30 bg-white/10 font-display text-lg font-bold text-primary-foreground"
              aria-label="Display name"
            />
            <p className="text-sm text-primary-foreground/85">
              {state.points.toLocaleString()} points · {unlockedBadges.length}/{badgeCatalog.length} badges · 🔥{" "}
              {state.streak} day streak
            </p>
          </div>
          <Button
            variant="secondary"
            className="rounded-full font-bold"
            onClick={() => toast.success("X, Instagram & TikTok connected for verification ✅")}
          >
            Connect socials
          </Button>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl">Badges</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {badgeCatalog.map((b) => {
              const unlocked = unlockedBadges.includes(b.id);
              return (
                <div
                  key={b.id}
                  className={cn(
                    "rounded-2xl p-4 text-center shadow-card",
                    unlocked ? "bg-sun text-accent-foreground" : "bg-card opacity-60",
                  )}
                >
                  <div className="text-3xl">{unlocked ? b.emoji : "🔒"}</div>
                  <p className="mt-2 text-sm font-bold">{b.name}</p>
                  <p className="text-xs">{b.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-3xl bg-card p-6 shadow-card">
            <h2 className="text-xl">Friends leaderboard</h2>
            <ol className="mt-3 space-y-2">
              {[...friends, { name: `${state.displayName} (you)`, points: state.points }]
                .sort((a, b) => b.points - a.points)
                .map((f, i) => (
                  <li
                    key={f.name}
                    className={cn(
                      "flex justify-between rounded-xl px-3 py-2 text-sm font-semibold",
                      f.name.includes("(you)") ? "bg-primary text-primary-foreground" : "bg-muted",
                    )}
                  >
                    <span>
                      #{i + 1} {f.name}
                    </span>
                    <span>{f.points.toLocaleString()} pts</span>
                  </li>
                ))}
            </ol>
          </div>

          <div className="rounded-3xl bg-card p-6 shadow-card">
            <h2 className="text-xl">Campaign history</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {campaigns.map((c) => (
                <li key={c.id} className="flex justify-between rounded-xl bg-muted px-3 py-2 font-semibold">
                  <span>{c.title}</span>
                  <span className="text-muted-foreground">{c.type}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rounded-3xl bg-card p-6 shadow-card">
          <h2 className="text-xl">Trivia deck 📚</h2>
          {state.savedFacts.length ? (
            <ul className="mt-3 space-y-2">
              {state.savedFacts.map((f) => (
                <li key={f} className="rounded-2xl bg-sun p-4 text-sm font-semibold text-accent-foreground">
                  {f}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              Nothing saved yet — spin the wheel and hit “Save to trivia deck”.
            </p>
          )}
        </section>
      </div>
    </StageShell>
  );
}
