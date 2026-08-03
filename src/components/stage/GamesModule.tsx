import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Confetti } from "@/components/stage/Confetti";
import { useStage } from "@/lib/stage-store";
import type { Campaign } from "@/data/stage";
import { cn } from "@/lib/utils";

function useTimer(active: boolean) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [active]);
  return seconds;
}

export function GamesModule({ campaign }: { campaign: Campaign }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Unscramble campaign={campaign} />
      <FourPics campaign={campaign} />
      <GuessCelebrity campaign={campaign} />
      <GameLeaderboard campaign={campaign} />
    </div>
  );
}

function Card({
  title,
  subtitle,
  children,
  fire = 0,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  fire?: number;
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-card p-6 shadow-card">
      <Confetti fire={fire} />
      <p className="text-xs font-bold uppercase tracking-widest text-highlight">{subtitle}</p>
      <h3 className="mt-1 text-2xl">{title}</h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function RoundDots({ total, index, cleared }: { total: number; index: number; cleared: number[] }) {
  return (
    <div className="mb-4 flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 flex-1 rounded-full",
            cleared.includes(i) ? "bg-success" : i === index ? "bg-primary" : "bg-muted",
          )}
        />
      ))}
    </div>
  );
}

function Unscramble({ campaign }: { campaign: Campaign }) {
  const { earn, bump } = useStage();
  const rounds = campaign.games.unscramble;
  const [round, setRound] = useState(0);
  const [cleared, setCleared] = useState<number[]>([]);
  const current = rounds[Math.min(round, rounds.length - 1)]!;
  const target = current.line.split(" ");

  // Shuffle only on the client: Math.random() during SSR breaks hydration.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const shuffled = useMemo(
    () => (mounted ? [...current.line.split(" ")].sort(() => Math.random() - 0.5) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [campaign.id, current.id, mounted],
  );
  const [pool, setPool] = useState<string[]>([]);
  const [picked, setPicked] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);
  const [fire, setFire] = useState(0);
  const seconds = useTimer(!solved);

  useEffect(() => {
    setPool(shuffled);
    setPicked([]);
    setSolved(false);
  }, [shuffled]);

  const allDone = cleared.length === rounds.length;

  const check = (next: string[]) => {
    if (next.length !== target.length) return;
    if (next.join(" ") === target.join(" ")) {
      const bonus = seconds < 20 ? 5 : 0;
      earn(current.points + bonus, "game", `Unscramble: ${current.song}`, `${campaign.id}-unscramble-${current.id}`);
      bump("games");
      setSolved(true);
      setCleared((c) => (c.includes(round) ? c : [...c, round]));
      setFire((f) => f + 1);
      toast.success(`Omo! Correct — "${current.song}" by ${current.artist}. +${current.points + bonus} points`);
    } else {
      toast.error("Ope! ❌ That's not the line. Try again.");
      setPicked([]);
      setPool(shuffled);
    }
  };

  return (
    <Card title="Unscramble the Lyrics" subtitle={`Real Afrobeats bars · ${seconds}s`} fire={fire}>
      <RoundDots total={rounds.length} index={round} cleared={cleared} />
      <p className="mb-3 text-sm font-semibold text-muted-foreground">
        Round {round + 1} of {rounds.length} · {solved ? `${current.song} — ${current.artist}` : "Rebuild the hook"}
      </p>
      <div className="min-h-14 rounded-2xl border-2 border-dashed border-border p-3">
        <div className="flex flex-wrap gap-2">
          {picked.map((w, i) => (
            <button
              key={`${w}-${i}`}
              type="button"
              disabled={solved}
              onClick={() => {
                setPicked((p) => p.filter((_, idx) => idx !== i));
                setPool((p) => [...p, w]);
              }}
              className="rounded-xl bg-primary px-3 py-2 text-sm font-bold text-primary-foreground"
            >
              {w}
            </button>
          ))}
          {!picked.length && <span className="text-sm text-muted-foreground">Tap the tiles in order…</span>}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {pool.map((w, i) => (
          <button
            key={`${w}-${i}`}
            type="button"
            disabled={solved}
            onClick={() => {
              const next = [...picked, w];
              setPicked(next);
              setPool((p) => p.filter((_, idx) => idx !== i));
              check(next);
            }}
            className="rounded-xl bg-sun px-3 py-2 text-sm font-bold text-accent-foreground shadow-card"
          >
            {w}
          </button>
        ))}
      </div>
      {solved && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <p className="font-bold text-success">
            Nailed it! ✅ “{current.line}” — {current.artist}
          </p>
          {round + 1 < rounds.length ? (
            <Button className="rounded-full font-bold" onClick={() => setRound((r) => r + 1)}>
              Next lyric
            </Button>
          ) : (
            <p className="font-bold text-highlight">{allDone ? "All rounds cleared. Sharp!" : ""}</p>
          )}
        </div>
      )}
    </Card>
  );
}

function FourPics({ campaign }: { campaign: Campaign }) {
  const { earn, bump, spend } = useStage();
  const puzzles = campaign.games.fourPics;
  const [round, setRound] = useState(0);
  const game = puzzles[Math.min(round, puzzles.length - 1)]!;
  const [guess, setGuess] = useState("");
  const [solved, setSolved] = useState(false);
  const [hint, setHint] = useState(false);
  const [fire, setFire] = useState(0);
  const [cleared, setCleared] = useState<number[]>([]);

  const nextRound = () => {
    setRound((r) => r + 1);
    setGuess("");
    setSolved(false);
    setHint(false);
  };

  return (
    <Card title="4 Pics 1 Word" subtitle={`Naija edition · ${game.points} pts`} fire={fire}>
      <RoundDots total={puzzles.length} index={round} cleared={cleared} />
      <div className="grid grid-cols-2 gap-2">
        {game.images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`Clue ${i + 1} for the hidden word`}
            loading="lazy"
            width={640}
            height={640}
            className="aspect-square w-full rounded-2xl object-cover"
          />
        ))}
      </div>
      <div className="mt-3 flex justify-center gap-1.5">
        {game.answer.split("").map((_, i) => (
          <span
            key={i}
            className="grid size-8 place-items-center rounded-lg bg-muted text-sm font-bold uppercase"
          >
            {solved ? game.answer[i] : ""}
          </span>
        ))}
      </div>
      {hint && <p className="mt-3 rounded-xl bg-muted p-3 text-sm font-semibold">Hint: {game.hint}</p>}
      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (guess.trim().toLowerCase() === game.answer) {
            earn(game.points, "game", `4 Pics 1 Word: ${game.answer}`, `${campaign.id}-fourpics-${game.id}`);
            bump("games");
            setSolved(true);
            setCleared((c) => (c.includes(round) ? c : [...c, round]));
            setFire((f) => f + 1);
            toast.success(`Nailed it! ✅ +${game.points} Points`);
          } else {
            toast.error("Ope! ❌ Not it. Look again.");
          }
        }}
      >
        <Input
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder={`${game.answer.length} letters`}
          disabled={solved}
          className="rounded-full"
        />
        <Button type="submit" disabled={solved} className="rounded-full font-bold">
          Guess
        </Button>
      </form>
      {!solved && (
        <Button
          variant="ghost"
          className="mt-2 rounded-full text-sm font-semibold"
          onClick={() => {
            if (hint) return;
            if (spend(5, "Hint: 4 Pics 1 Word")) setHint(true);
            else toast.error("Not enough points for a hint.");
          }}
        >
          Use hint (5 pts)
        </Button>
      )}
      {solved && (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <p className="font-bold text-success">Correct — it was “{game.answer}”.</p>
          {round + 1 < puzzles.length && (
            <Button className="rounded-full font-bold" onClick={nextRound}>
              Next puzzle
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}

function GuessCelebrity({ campaign }: { campaign: Campaign }) {
  const { earn, bump, spend } = useStage();
  const rounds = campaign.games.celebrity;
  const [round, setRound] = useState(0);
  const game = rounds[Math.min(round, rounds.length - 1)]!;
  const [blur, setBlur] = useState(18);
  const [cluesShown, setCluesShown] = useState(1);
  const [guess, setGuess] = useState("");
  const [solved, setSolved] = useState(false);
  const [fire, setFire] = useState(0);
  const [cleared, setCleared] = useState<number[]>([]);

  const nextRound = () => {
    setRound((r) => r + 1);
    setBlur(18);
    setCluesShown(1);
    setGuess("");
    setSolved(false);
  };

  return (
    <Card title="Guess the Celeb" subtitle={`Afrobeats legends · ${game.points} pts`} fire={fire}>
      <RoundDots total={rounds.length} index={round} cleared={cleared} />
      <div className="relative grid aspect-video place-items-center overflow-hidden rounded-2xl bg-stage">
        <img
          src={campaign.hero}
          alt="Blurred celebrity clue"
          loading="lazy"
          width={1280}
          height={720}
          className="absolute inset-0 size-full object-cover"
          style={{ filter: `blur(${solved ? 0 : blur}px)` }}
        />
        {!solved && <span className="relative text-5xl">🕵️</span>}
      </div>
      <ul className="mt-3 space-y-1 text-sm font-semibold">
        {game.clues.slice(0, solved ? game.clues.length : cluesShown).map((c) => (
          <li key={c} className="rounded-xl bg-muted px-3 py-2">
            Clue: {c}
          </li>
        ))}
      </ul>
      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const value = guess.trim().toLowerCase();
          if (value.includes(game.name) || value.includes(game.aka.toLowerCase())) {
            const points = Math.max(10, game.points - (18 - blur) - (cluesShown - 1) * 5);
            earn(points, "game", `Guess the Celeb: ${game.aka}`, `${campaign.id}-celeb-${game.id}`);
            bump("games");
            setSolved(true);
            setCleared((c) => (c.includes(round) ? c : [...c, round]));
            setFire((f) => f + 1);
            toast.success(`Nailed it! ✅ +${points} Points`);
          } else {
            toast.error("Ope! ❌ Look again.");
          }
        }}
      >
        <Input
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Who is it?"
          disabled={solved}
          className="rounded-full"
        />
        <Button type="submit" disabled={solved} className="rounded-full font-bold">
          Guess
        </Button>
      </form>
      {!solved && (
        <div className="mt-2 flex flex-wrap gap-2">
          <Button
            variant="ghost"
            className="rounded-full text-sm font-semibold"
            onClick={() => {
              if (blur <= 4) return;
              if (spend(5, "Hint: clear the picture")) setBlur((b) => Math.max(4, b - 5));
              else toast.error("Not enough points for a hint.");
            }}
          >
            Clear the image (5 pts)
          </Button>
          <Button
            variant="ghost"
            className="rounded-full text-sm font-semibold"
            onClick={() => {
              if (cluesShown >= game.clues.length) {
                toast.message("No more clues. Guess na!");
                return;
              }
              if (spend(5, "Hint: extra clue")) setCluesShown((c) => c + 1);
              else toast.error("Not enough points for a hint.");
            }}
          >
            Another clue (5 pts)
          </Button>
        </div>
      )}
      {solved && (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <p className="font-bold text-success">
            It was {game.aka}. Sharp eye!
          </p>
          {round + 1 < rounds.length && (
            <Button className="rounded-full font-bold" onClick={nextRound}>
              Next celeb
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}

function GameLeaderboard({ campaign }: { campaign: Campaign }) {
  const { state } = useStage();
  return (
    <Card title="Game leaderboard" subtitle="Top scores this campaign">
      <ol className="space-y-2">
        {campaign.leaderboard.slice(0, 6).map((row, i) => (
          <li
            key={row.name}
            className={cn(
              "flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold",
              i === 0 ? "bg-sun text-accent-foreground" : "bg-muted",
            )}
          >
            <span>
              #{i + 1} {row.name}
            </span>
            <span>{row.points.toLocaleString()}</span>
          </li>
        ))}
        <li className="flex items-center justify-between rounded-xl bg-primary px-3 py-2 text-sm font-bold text-primary-foreground">
          <span>You — {state.displayName}</span>
          <span>{state.points.toLocaleString()}</span>
        </li>
      </ol>
    </Card>
  );
}
