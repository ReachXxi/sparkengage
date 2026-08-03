import { useEffect, useState } from "react";

const colors = ["bg-accent", "bg-highlight", "bg-primary", "bg-electric", "bg-success"];

export function Confetti({ fire }: { fire: number }) {
  const [bits, setBits] = useState<number[]>([]);

  useEffect(() => {
    if (!fire) return;
    setBits(Array.from({ length: 24 }, (_, i) => i));
    const t = setTimeout(() => setBits([]), 1700);
    return () => clearTimeout(t);
  }, [fire]);

  if (!bits.length) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {bits.map((i) => (
        <span
          key={i}
          className={`confetti-bit ${colors[i % colors.length]}`}
          style={{ left: `${(i * 4.1) % 100}%`, top: "-10px", animationDelay: `${(i % 6) * 0.08}s` }}
        />
      ))}
    </div>
  );
}
