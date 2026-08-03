import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Confetti } from "@/components/stage/Confetti";
import { useStage } from "@/lib/stage-store";
import { pointPacks } from "@/data/stage";

const segments = [10, 20, 50, 100, 20, 10, 50, 20];
const segColors = [
  "oklch(0.85 0.17 90)",
  "oklch(0.42 0.19 305)",
  "oklch(0.68 0.23 5)",
  "oklch(0.75 0.13 205)",
  "oklch(0.85 0.17 90)",
  "oklch(0.42 0.19 305)",
  "oklch(0.68 0.23 5)",
  "oklch(0.75 0.13 205)",
];

export function SpinWheel() {
  const { canSpin, doSpin, state, purchase } = useStage();
  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [fact, setFact] = useState<string | null>(null);
  const [reward, setReward] = useState(0);
  const [fire, setFire] = useState(0);
  const { saveFact } = useStage();

  const slice = 360 / segments.length;
  const gradient = `conic-gradient(${segments
    .map((_, i) => `${segColors[i]} ${i * slice}deg ${(i + 1) * slice}deg`)
    .join(", ")})`;

  const spin = () => {
    if (!canSpin || spinning) return;
    const index = Math.floor(Math.random() * segments.length);
    const won = segments[index] ?? 10;
    const target = 360 * 6 + (360 - index * slice - slice / 2);
    setSpinning(true);
    setAngle((a) => a + target);
    setTimeout(() => {
      const result = doSpin(won);
      setReward(won + result.bonus);
      setFact(result.fact);
      setFire((f) => f + 1);
      setSpinning(false);
      if (result.bonus) toast.success(`Day ${result.streak} streak! +${result.bonus} bonus points 🔥`);
    }, 3200);
  };

  return (
    <section className="relative overflow-hidden rounded-3xl bg-stage p-6 text-primary-foreground shadow-pop sm:p-10">
      <Confetti fire={fire} />
      <div className="grid items-center gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <p className="text-sm font-bold uppercase tracking-widest text-accent">Daily ritual</p>
          <h2 className="text-3xl sm:text-4xl">Spin the wheel. Collect your gbedu points.</h2>
          <p className="text-primary-foreground/85">
            One free spin every day — 10, 20, 50 or 100 points. Keep the streak and day 7 pays you extra.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={spin}
              disabled={!canSpin || spinning}
              size="lg"
              className="rounded-full bg-sun px-8 text-base font-bold text-accent-foreground hover:opacity-90"
            >
              {spinning ? "Spinning…" : canSpin ? "SPIN NOW" : "Come back tomorrow"}
            </Button>
            <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
              🔥 {state.streak} day streak
            </span>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {pointPacks.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  purchase(p.points, `Bought ${p.points} points pack`);
                  toast.success(`Omo! ${p.points} points added. Don't spend it all in one place.`);
                }}
                className="rounded-full border border-white/30 px-3 py-1.5 text-xs font-semibold hover:bg-white/15"
              >
                Buy {p.points} pts · {p.price}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-auto flex flex-col items-center gap-3">
          <div className="relative size-56 sm:size-72">
            <div
              className="size-full rounded-full border-8 border-accent shadow-pop"
              style={{
                background: gradient,
                transform: `rotate(${angle}deg)`,
                transition: "transform 3.1s cubic-bezier(0.15, 0.8, 0.15, 1)",
              }}
            />
            <div className="absolute inset-0 grid place-items-center">
              <div className="grid size-16 place-items-center rounded-full bg-card text-lg font-bold text-foreground shadow-card">
                🎡
              </div>
            </div>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl">🔻</div>
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">10 · 20 · 50 · 100 points</p>
        </div>
      </div>

      <Dialog open={!!fact} onOpenChange={(o) => !o && setFact(null)}>
        <DialogContent className="max-w-md rounded-3xl border-4 border-accent bg-card p-0 text-foreground">
          <div className="animate-pop space-y-4 p-6">
            <p className="text-2xl font-bold text-highlight">+{reward} points! ⚡</p>
            <div className="rounded-2xl bg-sun p-5 text-accent-foreground">
              <p className="font-display text-sm font-bold uppercase tracking-widest">🎤 Did you know?</p>
              <p className="mt-2 text-lg font-semibold leading-snug">{fact}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                className="rounded-full font-bold"
                onClick={() => {
                  if (fact && navigator.clipboard) void navigator.clipboard.writeText(fact);
                  toast.success("Fact copied — go share it 🗣️");
                }}
              >
                Share this fact 🗣️
              </Button>
              <Button
                variant="outline"
                className="rounded-full font-bold"
                onClick={() => {
                  if (fact) saveFact(fact);
                  toast.success("Saved to your trivia deck 📚");
                }}
              >
                Save to trivia deck 📚
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
