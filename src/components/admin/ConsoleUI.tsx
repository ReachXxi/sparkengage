import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Chart palette (kept in sync with the console tokens)                */
/* ------------------------------------------------------------------ */

export const CHART = {
  blue: "#4F6FF7",
  blueLight: "#7B93FA",
  purple: "#7C6BEA",
  gold: "#D4AF37",
  success: "#4CAF84",
  warning: "#E8A83C",
  error: "#E8606C",
  grid: "#E4E7F2",
  axis: "#7A7A9A",
};

export const CHART_SERIES = [CHART.blue, CHART.purple, CHART.blueLight, CHART.gold, CHART.success, CHART.warning];

/* ------------------------------------------------------------------ */
/* Layout primitives                                                   */
/* ------------------------------------------------------------------ */

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-ink sm:text-3xl">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-ink-2">{subtitle}</p>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function Panel({
  title,
  hint,
  actions,
  className,
  children,
}: {
  title?: string;
  hint?: string;
  actions?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={cn("console-card p-5 sm:p-6", className)}>
      {(title || actions) && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            {title ? <h2 className="text-base font-bold text-ink">{title}</h2> : null}
            {hint ? <p className="text-xs text-ink-3">{hint}</p> : null}
          </div>
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}

export function StatCard({
  label,
  value,
  delta,
  icon,
  tone = "brand",
}: {
  label: string;
  value: string;
  delta?: string;
  icon?: ReactNode;
  tone?: "brand" | "gold" | "success" | "purple";
}) {
  const tones = {
    brand: "bg-brand/10 text-brand",
    gold: "bg-gold/15 text-gold",
    success: "bg-ok/15 text-ok",
    purple: "bg-brand-purple/12 text-brand-purple",
  } as const;
  return (
    <div className="console-card p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-3">{label}</p>
        {icon ? <span className={cn("grid size-9 place-items-center rounded-xl", tones[tone])}>{icon}</span> : null}
      </div>
      <p className="mt-3 font-display text-2xl font-bold text-ink">{value}</p>
      {delta ? <p className="mt-1 text-xs font-semibold text-ok">{delta}</p> : null}
    </div>
  );
}

const pillTones: Record<string, string> = {
  live: "bg-ok/15 text-ok",
  active: "bg-ok/15 text-ok",
  approved: "bg-ok/15 text-ok",
  open: "bg-ok/15 text-ok",
  scheduled: "bg-brand/10 text-brand",
  pending: "bg-warn/18 text-warn",
  paused: "bg-warn/18 text-warn",
  draft: "bg-ink-3/15 text-ink-2",
  inactive: "bg-ink-3/15 text-ink-2",
  closed: "bg-ink-3/15 text-ink-2",
  ended: "bg-ink-3/15 text-ink-2",
  rejected: "bg-bad/15 text-bad",
  critical: "bg-bad/15 text-bad",
  warning: "bg-warn/18 text-warn",
  info: "bg-brand/10 text-brand",
  suspended: "bg-bad/15 text-bad",
  premium: "bg-gold/18 text-gold",
};

export function Pill({ children, tone }: { children: ReactNode; tone?: string }) {
  const key = (tone ?? String(children)).toLowerCase();
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold capitalize",
        pillTones[key] ?? "bg-brand/10 text-brand",
      )}
    >
      {children}
    </span>
  );
}

export function DataTable({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="-mx-2 overflow-x-auto px-2">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            {head.map((h) => (
              <th key={h} className="whitespace-nowrap px-3 py-2 text-xs font-bold uppercase tracking-wider text-ink-3">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/70">{children}</tbody>
      </table>
    </div>
  );
}

export function Td({ children, className }: { children: ReactNode; className?: string }) {
  return <td className={cn("px-3 py-3 align-middle text-ink-2", className)}>{children}</td>;
}

export function Bar({ value, tone = "brand" }: { value: number; tone?: "brand" | "gold" | "success" }) {
  const bg = tone === "gold" ? "bg-gold" : tone === "success" ? "bg-ok" : "bg-brand-gradient";
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-brand/10">
      <div className={cn("h-full rounded-full", bg)} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

export const nf = (n: number) => n.toLocaleString("en-US");

export function shortDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

export function dayOnly(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function exportCsv(filename: string, rows: (string | number)[][]) {
  const csv = rows
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
