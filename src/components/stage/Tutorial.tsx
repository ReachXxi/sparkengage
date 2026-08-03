import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useStage } from "@/lib/stage-store";

const steps = [
  { emoji: "🎡", title: "Spin the wheel", body: "One free spin daily. 10 to 100 points, plus a fun fact to flex in the group chat." },
  { emoji: "🧠", title: "Play a quiz", body: "Zikoko-style questions. Nail it, bank 15 points. Ope? Try the next one." },
  { emoji: "🎁", title: "Cash your points", body: "Merch, exclusive drops, premiere tickets. Redeem from your wallet instantly." },
];

export function Tutorial() {
  const { state, finishTutorial } = useStage();
  const [i, setI] = useState(0);
  const open = !state.seenTutorial;
  const step = steps[i]!;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && finishTutorial()}>
      <DialogContent className="max-w-md rounded-3xl border-4 border-accent p-0">
        <div className="animate-pop space-y-4 p-8 text-center">
          <div className="text-6xl">{step.emoji}</div>
          <h2 className="text-2xl">{step.title}</h2>
          <p className="text-muted-foreground">{step.body}</p>
          <div className="flex justify-center gap-1.5 pt-2">
            {steps.map((s, idx) => (
              <span
                key={s.title}
                className={`h-2 w-6 rounded-full ${idx === i ? "bg-primary" : "bg-muted"}`}
              />
            ))}
          </div>
          <Button
            className="w-full rounded-full font-bold"
            onClick={() => (i + 1 < steps.length ? setI(i + 1) : finishTutorial())}
          >
            {i + 1 < steps.length ? "Next" : "Let's go 🎤"}
          </Button>
          <button type="button" onClick={finishTutorial} className="text-sm font-semibold text-muted-foreground">
            Skip
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
