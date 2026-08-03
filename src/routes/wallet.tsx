import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { StageShell } from "@/components/stage/StageShell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useStage } from "@/lib/stage-store";
import { pointPacks, rewards } from "@/data/stage";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/wallet")({
  head: () => ({
    meta: [
      { title: "Your points wallet & rewards — SPARKFAN" },
      {
        name: "description",
        content: "Track every point you've earned on SPARKFAN, buy points packs and redeem merch, tickets and exclusive drops.",
      },
      { property: "og:title", content: "Your points wallet & rewards — SPARKFAN" },
      { property: "og:description", content: "Points history, points packs and instant reward redemption on SPARKFAN." },
    ],
  }),
  component: WalletPage,
});

const categories = ["All", "Music", "Movies", "Merch", "Exclusive Content"];

function WalletPage() {
  const { state, purchase, redeem } = useStage();
  const [category, setCategory] = useState("All");
  const [code, setCode] = useState<{ title: string; code: string } | null>(null);

  const list = rewards.filter((r) => category === "All" || r.category === category);

  return (
    <StageShell>
      <div className="space-y-8">
        <section className="rounded-3xl bg-stage p-8 text-primary-foreground shadow-pop">
          <p className="text-xs font-bold uppercase tracking-widest text-accent">Your balance</p>
          <p className="font-display text-5xl font-bold">{state.points.toLocaleString()} pts</p>
          <p className="mt-2 text-sm text-primary-foreground/85">
            Points expire after 90 days of inactivity — keep spinning and they stay alive.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {pointPacks.map((p) => (
              <Button
                key={p.id}
                className="rounded-full bg-sun font-bold text-accent-foreground"
                onClick={() => {
                  purchase(p.points, `Bought ${p.points} points pack`);
                  toast.success(`${p.points} points added ⚡`);
                }}
              >
                {p.points} pts · {p.price}
              </Button>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl">Redeem your gbedu 🎁</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={cn(
                  "rounded-full border-2 px-4 py-1.5 text-sm font-semibold",
                  category === c ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted",
                )}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((r) => (
              <div key={r.id} className="flex flex-col rounded-3xl bg-card p-5 shadow-card">
                <div className="grid aspect-video place-items-center rounded-2xl bg-sun text-5xl">{r.emoji}</div>
                <h3 className="mt-4 text-lg">{r.title}</h3>
                <p className="mt-1 flex-1 text-sm text-muted-foreground">{r.description}</p>
                <p className="mt-3 text-sm font-bold text-highlight">
                  {r.cost.toLocaleString()} pts · {r.stock} left
                </p>
                <Button
                  className="mt-3 rounded-full font-bold"
                  disabled={state.points < r.cost}
                  onClick={() => {
                    const c = redeem(r.title, r.cost);
                    if (c) setCode({ title: r.title, code: c });
                    else toast.error("Not enough points yet. Go spin.");
                  }}
                >
                  {state.points < r.cost ? "Not enough points" : "Redeem"}
                </Button>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl">Points history</h2>
          <div className="overflow-hidden rounded-3xl bg-card shadow-card">
            {state.transactions.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between border-b border-border/60 px-5 py-3 text-sm last:border-0"
              >
                <div>
                  <p className="font-semibold">{t.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(t.at).toLocaleString()} · {t.type}
                  </p>
                </div>
                <span className={cn("font-bold tabular-nums", t.amount >= 0 ? "text-success" : "text-destructive")}>
                  {t.amount >= 0 ? "+" : ""}
                  {t.amount}
                </span>
              </div>
            ))}
          </div>
        </section>

        {state.redemptions.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-2xl">Your reward codes</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {state.redemptions.map((r) => (
                <div key={r.id} className="rounded-2xl bg-muted p-4">
                  <p className="font-semibold">{r.title}</p>
                  <p className="font-mono text-sm">{r.code}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <Dialog open={!!code} onOpenChange={(o) => !o && setCode(null)}>
        <DialogContent className="max-w-md rounded-3xl border-4 border-accent">
          <div className="animate-pop space-y-3 p-2 text-center">
            <p className="text-5xl">🎉</p>
            <h3 className="text-2xl">{code?.title} unlocked!</h3>
            <p className="text-muted-foreground">Here's your one-time code. Don't share it, no wahala.</p>
            <p className="rounded-xl bg-sun p-4 font-mono text-lg font-bold text-accent-foreground">{code?.code}</p>
            <Button
              className="w-full rounded-full font-bold"
              onClick={() => {
                if (code) void navigator.clipboard?.writeText(code.code);
                toast.success("Code copied");
              }}
            >
              Copy code
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </StageShell>
  );
}
