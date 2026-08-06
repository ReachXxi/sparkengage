import { createFileRoute } from "@tanstack/react-router";
import { Crown, Flame, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/lib/admin-store";
import { DataTable, PageHeader, Panel, Pill, StatCard, Td, exportCsv, nf } from "@/components/admin/ConsoleUI";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/leaderboard")({
  head: () => ({
    meta: [
      { title: "Live leaderboard — fan ranks, badges & prize tiers | SPARKFAN" },
      {
        name: "description",
        content:
          "A real-time fan leaderboard with ranks, badges and prize tiers — see who is climbing, who is stalling and who wins the campaign.",
      },
      { property: "og:title", content: "Live leaderboard — SPARKFAN console" },
      { property: "og:description", content: "Real-time fan ranks, badges and prize tiers." },
    ],
  }),
  component: Leaderboard,
});

function Leaderboard() {
  const { leaderboard, tenant, campaigns } = useAdmin();
  const podium = leaderboard.slice(0, 3);
  const prize = campaigns.find((c) => c.status === "live")?.prize ?? "Set a prize on the live campaign";

  return (
    <>
      <PageHeader
        title="Leaderboard"
        subtitle={`Live ranks for ${tenant.name} — updates every few seconds as fans earn.`}
        actions={
          <Button
            variant="outline"
            onClick={() =>
              exportCsv("leaderboard.csv", [
                ["Rank", "Fan", "City", "Points", "Actions", "Streak", "Badge"],
                ...leaderboard.map((u) => [u.rank, u.name, u.city, u.points, u.actions, u.streak, u.badge]),
              ])
            }
          >
            Export CSV
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Ranked fans" value={nf(leaderboard.length)} icon={<Crown className="size-4" />} />
        <StatCard label="Leader points" value={nf(leaderboard[0]?.points ?? 0)} tone="gold" />
        <StatCard label="Points in play" value={nf(leaderboard.reduce((s, u) => s + u.points, 0))} tone="purple" />
        <StatCard label="Longest streak" value={`${Math.max(0, ...leaderboard.map((u) => u.streak))} days`} tone="success" icon={<Flame className="size-4" />} />
      </div>

      <Panel title="Podium" hint={prize}>
        <div className="grid gap-4 sm:grid-cols-3">
          {podium.map((u, i) => (
            <div
              key={u.id}
              className={cn(
                "rounded-2xl border p-5 text-center",
                i === 0 ? "border-gold bg-gold/8" : "border-border bg-white",
              )}
            >
              <p className="font-display text-3xl">{i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}</p>
              <p className="mt-2 text-sm font-bold text-ink">{u.name}</p>
              <p className="text-[11px] text-ink-3">{u.city}</p>
              <p className="mt-2 font-display text-2xl font-bold text-brand">{nf(u.points)}</p>
              <p className="mt-1 text-[11px] font-semibold text-ink-2">{u.badge}</p>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Full ranking" hint="Live delta shows movement since the last refresh">
        <DataTable head={["#", "Fan", "City", "Segment", "Points", "Live", "Streak", "Badge"]}>
          {leaderboard.map((u) => (
            <tr key={u.id}>
              <Td className="font-bold text-ink">{u.rank}</Td>
              <Td className="font-semibold text-ink">{u.name}</Td>
              <Td>{u.city}</Td>
              <Td>
                <Pill>{u.segment}</Pill>
              </Td>
              <Td className="font-semibold text-ink">{nf(u.points)}</Td>
              <Td>
                {u.live > 0 ? (
                  <span className="inline-flex items-center gap-1 font-semibold text-ok">
                    <TrendingUp className="size-3.5" /> +{u.live}
                  </span>
                ) : (
                  <span className="text-ink-3">—</span>
                )}
              </Td>
              <Td>{u.streak}d</Td>
              <Td>{u.badge}</Td>
            </tr>
          ))}
        </DataTable>
      </Panel>
    </>
  );
}
