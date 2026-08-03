import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { badgeCatalog, funFacts } from "@/data/stage";

export type Txn = {
  id: string;
  amount: number;
  type: "earn" | "spend" | "purchase" | "bonus";
  source: string;
  label: string;
  at: string;
};

type Counters = { spins: number; quiz: number; social: number; games: number; stream: number };

export type StageState = {
  displayName: string;
  points: number;
  transactions: Txn[];
  lastSpin: string | null;
  streak: number;
  counters: Counters;
  completed: string[];
  savedFacts: string[];
  redemptions: { id: string; title: string; code: string; at: string }[];
  seenTutorial: boolean;
};

const KEY = "sparkfan-state-v1";

const initial: StageState = {
  displayName: "Ada",
  points: 240,
  transactions: [
    {
      id: "seed",
      amount: 240,
      type: "bonus",
      source: "welcome",
      label: "Welcome to SPARKFAN 🎉",
      at: "2026-01-01T00:00:00.000Z",
    },
  ],
  lastSpin: null,
  streak: 0,
  counters: { spins: 0, quiz: 0, social: 0, games: 0, stream: 0 },
  completed: [],
  savedFacts: [],
  redemptions: [],
  seenTutorial: false,
};

type Ctx = {
  state: StageState;
  earn: (amount: number, source: string, label: string, key?: string) => void;
  spend: (amount: number, label: string) => boolean;
  purchase: (amount: number, label: string) => void;
  bump: (kind: keyof Counters, by?: number) => void;
  markDone: (key: string) => void;
  isDone: (key: string) => boolean;
  canSpin: boolean;
  doSpin: (reward: number) => { fact: string; bonus: number; streak: number };
  saveFact: (fact: string) => void;
  redeem: (title: string, cost: number) => string | null;
  finishTutorial: () => void;
  unlockedBadges: string[];
  setDisplayName: (name: string) => void;
};

const StageContext = createContext<Ctx | null>(null);

const today = () => new Date().toISOString().slice(0, 10);

export function StageProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StageState>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...initial, ...(JSON.parse(raw) as StageState) });
    } catch {
      /* ignore corrupted state */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const addTxn = (s: StageState, amount: number, type: Txn["type"], source: string, label: string): StageState => ({
    ...s,
    points: Math.max(0, s.points + amount),
    transactions: [
      { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, amount, type, source, label, at: new Date().toISOString() },
      ...s.transactions,
    ].slice(0, 80),
  });

  const earn = useCallback((amount: number, source: string, label: string, key?: string) => {
    setState((s) => {
      if (key && s.completed.includes(key)) return s;
      const next = addTxn(s, amount, "earn", source, label);
      return key ? { ...next, completed: [...next.completed, key] } : next;
    });
  }, []);

  const spend = useCallback((amount: number, label: string) => {
    let ok = false;
    setState((s) => {
      if (s.points < amount) return s;
      ok = true;
      return addTxn(s, -amount, "spend", "spend", label);
    });
    return ok;
  }, []);

  const purchase = useCallback((amount: number, label: string) => {
    setState((s) => addTxn(s, amount, "purchase", "purchase", label));
  }, []);

  const bump = useCallback((kind: keyof Counters, by = 1) => {
    setState((s) => ({ ...s, counters: { ...s.counters, [kind]: s.counters[kind] + by } }));
  }, []);

  const markDone = useCallback((key: string) => {
    setState((s) => (s.completed.includes(key) ? s : { ...s, completed: [...s.completed, key] }));
  }, []);

  const isDone = useCallback((key: string) => state.completed.includes(key), [state.completed]);

  const canSpin = hydrated && state.lastSpin !== today();

  const doSpin = useCallback((reward: number) => {
    const fact = funFacts[Math.floor(Math.random() * funFacts.length)] ?? funFacts[0]!;
    let streakOut = 1;
    let bonusOut = 0;
    setState((s) => {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const streak = s.lastSpin === yesterday ? s.streak + 1 : 1;
      const bonus = streak > 0 && streak % 7 === 0 ? 50 : 0;
      streakOut = streak;
      bonusOut = bonus;
      let next = addTxn(s, reward, "earn", "spin", `Daily spin — ${reward} pts`);
      if (bonus) next = addTxn(next, bonus, "bonus", "streak", `Day ${streak} streak bonus`);
      return {
        ...next,
        lastSpin: today(),
        streak,
        counters: { ...next.counters, spins: next.counters.spins + 1 },
      };
    });
    return { fact, bonus: bonusOut, streak: streakOut };
  }, []);

  const saveFact = useCallback((fact: string) => {
    setState((s) => (s.savedFacts.includes(fact) ? s : { ...s, savedFacts: [fact, ...s.savedFacts] }));
  }, []);

  const redeem = useCallback((title: string, cost: number) => {
    let code: string | null = null;
    setState((s) => {
      if (s.points < cost) return s;
      code = `SPARK-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      const next = addTxn(s, -cost, "spend", "redeem", `Redeemed ${title}`);
      return { ...next, redemptions: [{ id: code, title, code, at: new Date().toISOString() }, ...next.redemptions] };
    });
    return code;
  }, []);

  const finishTutorial = useCallback(() => setState((s) => ({ ...s, seenTutorial: true })), []);
  const setDisplayName = useCallback((name: string) => setState((s) => ({ ...s, displayName: name })), []);

  const unlockedBadges = useMemo(
    () =>
      badgeCatalog
        .filter((b) => {
          const value = b.kind === "points" ? state.points : state.counters[b.kind as keyof Counters];
          return value >= b.need;
        })
        .map((b) => b.id),
    [state.points, state.counters],
  );

  const value: Ctx = {
    state,
    earn,
    spend,
    purchase,
    bump,
    markDone,
    isDone,
    canSpin,
    doSpin,
    saveFact,
    redeem,
    finishTutorial,
    unlockedBadges,
    setDisplayName,
  };

  return <StageContext.Provider value={value}>{children}</StageContext.Provider>;
}

export function useStage() {
  const ctx = useContext(StageContext);
  if (!ctx) throw new Error("useStage must be used inside StageProvider");
  return ctx;
}
