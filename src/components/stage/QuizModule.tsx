import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Confetti } from "@/components/stage/Confetti";
import { useStage } from "@/lib/stage-store";
import { BRAND, type Campaign } from "@/data/stage";
import { cn } from "@/lib/utils";

function verdict(correct: number, total: number) {
  const pct = (correct / total) * 100;
  if (pct === 100) return "Certified. You should be on the label's payroll. 🏆";
  if (pct >= 70) return "Solid. You've clearly been paying attention at every owambe. 🔥";
  if (pct >= 40) return "Mid. You know the choruses but not the verses. 😬";
  return "Ah ah. Return your Naija passport at the front desk. 😭";
}

export function QuizModule({ campaign }: { campaign: Campaign }) {
  const { earn, bump } = useStage();
  const questions = campaign.quiz.questions;
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [fire, setFire] = useState(0);
  const [done, setDone] = useState(false);

  const q = questions[index];

  const pick = (i: number) => {
    if (picked !== null || !q) return;
    setPicked(i);
    bump("quiz");
    if (i === q.correctAnswer) {
      const bonus = streak >= 2 ? 5 : 0;
      earn(q.points + bonus, "quiz", `Quiz: ${campaign.quiz.title}`, `${campaign.id}-quiz-${q.id}`);
      setScore((s) => s + q.points + bonus);
      setCorrectCount((c) => c + 1);
      setStreak((s) => s + 1);
      setFire((f) => f + 1);
      toast.success(bonus ? `Streak! ✅ +${q.points + bonus} Points` : `Nailed it! ✅ +${q.points} Points`);
    } else {
      setStreak(0);
      toast.error("Ope! ❌ Next one, no wahala.");
    }
  };

  const next = () => {
    setPicked(null);
    if (index + 1 >= questions.length) setDone(true);
    else setIndex((i) => i + 1);
  };

  if (done) {
    return (
      <div className="space-y-5">
        <div className="relative overflow-hidden rounded-3xl bg-stage p-8 text-center text-primary-foreground shadow-pop">
          <Confetti fire={fire + 1} />
          <h3 className="text-3xl">Quiz complete! 🎉</h3>
          <p className="mt-2 text-lg">
            {correctCount}/{questions.length} correct · {score} points banked
          </p>
          <p className="mx-auto mt-2 max-w-md font-semibold text-primary-foreground/90">
            {verdict(correctCount, questions.length)}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button
              className="rounded-full bg-sun font-bold text-accent-foreground"
              onClick={() => {
                void navigator.clipboard?.writeText(
                  `I scored ${correctCount}/${questions.length} on "${campaign.quiz.title}" on ${BRAND} 🎤 Try and beat me.`,
                );
                toast.success("Result copied — post it and drag your friends in.");
              }}
            >
              Share results
            </Button>
            <Button
              variant="secondary"
              className="rounded-full font-bold"
              onClick={() => {
                setDone(false);
                setIndex(0);
                setScore(0);
                setCorrectCount(0);
                setStreak(0);
              }}
            >
              Play again
            </Button>
          </div>
        </div>
        {campaign.personality && <PersonalityQuiz campaign={campaign} />}
      </div>
    );
  }

  if (!q) return null;

  return (
    <div className="relative space-y-5">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm font-bold">
          <span>
            Question {index + 1} of {questions.length}
          </span>
          <span className="text-highlight">
            {score} pts {streak >= 2 && `· ${streak} streak 🔥`}
          </span>
        </div>
        <Progress value={((index + (picked !== null ? 1 : 0)) / questions.length) * 100} />
      </div>

      <div className="relative overflow-hidden rounded-3xl bg-cool p-8 text-primary-foreground shadow-pop">
        <Confetti fire={fire} />
        <p className="text-xs font-bold uppercase tracking-widest text-accent">{campaign.quiz.title}</p>
        <p className="mt-1 text-sm text-primary-foreground/80">{campaign.quiz.subtitle}</p>
        <h3 className="mt-3 text-2xl leading-tight sm:text-3xl">{q.question}</h3>
        <div className="mt-6 grid gap-3">
          {q.options.map((opt, i) => {
            const isCorrect = i === q.correctAnswer;
            const state =
              picked === null ? "idle" : isCorrect ? "correct" : picked === i ? "wrong" : "dim";
            return (
              <button
                key={opt}
                type="button"
                onClick={() => pick(i)}
                disabled={picked !== null}
                className={cn(
                  "rounded-2xl border-2 px-5 py-4 text-left text-base font-semibold transition-all",
                  state === "idle" && "border-white/30 bg-white/10 hover:bg-white/20",
                  state === "correct" && "border-success bg-success text-success-foreground",
                  state === "wrong" && "border-destructive bg-destructive text-destructive-foreground",
                  state === "dim" && "border-white/10 bg-white/5 opacity-60",
                )}
              >
                {opt}
              </button>
            );
          })}
        </div>
        {picked !== null && (
          <div className="mt-6 space-y-3">
            <p className="animate-pop text-lg font-bold">
              {picked === q.correctAnswer
                ? `Nailed it! ✅ +${q.points} Points`
                : `Ope! ❌ Correct answer: ${q.options[q.correctAnswer]}`}
            </p>
            <p className="rounded-2xl bg-white/10 p-4 text-sm font-semibold">{q.explainer}</p>
            <div className="flex justify-end">
              <Button onClick={next} className="rounded-full bg-sun font-bold text-accent-foreground">
                {index + 1 >= questions.length ? "See my result" : "Next"}
              </Button>
            </div>
          </div>
        )}
      </div>

      {campaign.personality && <PersonalityQuiz campaign={campaign} />}
    </div>
  );
}

function PersonalityQuiz({ campaign }: { campaign: Campaign }) {
  const personality = campaign.personality!;
  const { earn } = useStage();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ title: string; body: string } | null>(null);

  const submit = () => {
    const tally: Record<string, number> = {};
    Object.values(answers).forEach((tag) => {
      tally[tag] = (tally[tag] ?? 0) + 1;
    });
    const winner = Object.entries(tally).sort((a, b) => b[1] - a[1])[0]?.[0];
    if (!winner) return;
    setResult(
      personality.results[winner] ?? { title: "You are one of a kind ✨", body: "We genuinely cannot categorise you." },
    );
    earn(20, "quiz", "Personality quiz completed", `${campaign.id}-personality`);
  };

  return (
    <div className="rounded-3xl bg-card p-6 shadow-card">
      <p className="text-xs font-bold uppercase tracking-widest text-highlight">Personality quiz</p>
      <h3 className="mt-1 text-2xl">{personality.title}</h3>
      <p className="text-sm text-muted-foreground">{personality.subtitle}</p>
      <div className="mt-5 space-y-5">
        {personality.questions.map((pq) => (
          <div key={pq.id}>
            <p className="font-semibold">{pq.question}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {pq.options.map((o) => (
                <button
                  key={o.label}
                  type="button"
                  onClick={() => setAnswers((a) => ({ ...a, [pq.id]: o.tag }))}
                  className={cn(
                    "rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors",
                    answers[pq.id] === o.tag
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:bg-muted",
                  )}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Button
        className="mt-6 rounded-full font-bold"
        disabled={Object.keys(answers).length < personality.questions.length}
        onClick={submit}
      >
        Reveal my result
      </Button>
      {result && (
        <div className="animate-pop mt-5 rounded-2xl bg-sun p-5 text-accent-foreground">
          <p className="font-display text-xl font-bold">{result.title}</p>
          <p className="mt-1 font-semibold">{result.body}</p>
          <Button
            variant="secondary"
            className="mt-3 rounded-full font-bold"
            onClick={() => {
              void navigator.clipboard?.writeText(`${result.title} — ${result.body} (via ${BRAND})`);
              toast.success("Result copied. Post it 📸");
            }}
          >
            Share result
          </Button>
        </div>
      )}
    </div>
  );
}
