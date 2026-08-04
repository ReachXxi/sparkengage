import { createFileRoute } from "@tanstack/react-router";
import { Crown, Flame } from "lucide-react";
import { AdminShell, Metric, Panel, Pill } from "@/components/admin/AdminShell";
import { useAdmin } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard & top engagers — SPARKFAN Admin" },
      {
        name: "description",
        content:
          "Rank fans by points, actions, streaks and referrals to find the top engagers worth rewarding in every workspace campaign.",
      },
      { property: "og:title", content: "Leaderboard & top engagers — SPARKFAN Admin" },
      { property: "og:description", content: "Points, actions, streaks and referrals per fan." },
    ],
  }),
  component: Leaderboard,
});

function Leaderboard() {
  const { engagers } = useAdmin();
  const ranked = [...engagers].sort((a, b) => b.points - a.points);
  const top = ranked[0];

  return (
    <AdminShell title="Leaderboard" description="Who is actually carrying the campaign.">
      <div className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Ranked fans" value={ranked.length.toLocaleString()} />
          <Metric label="Top engager" value={top?.fan ?? "—"} hint={top ? `${top.points.toLocaleString()} pts` : ""} />
          <Metric label="Total points" value={ranked.reduce((a, r) => a + r.points, 0).toLocaleString()} />
          <Metric label="Referrals" value={ranked.reduce((a, r) => a + r.referrals, 0).toLocaleString()} />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {ranked.slice(0, 3).map((e, i) => (
            <Panel key={e.id}>
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-muted">
                  {i === 0 ? <Crown className="size-5" /> : <span className="font-semibold">#{i + 1}</span>}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold">{e.fan}</p>
                  <p className="text-xs text-muted-foreground">{e.city}</p>
                </div>
                <Pill tone="solid" className="ml-auto">
                  {e.points.toLocaleString()} pts
                </Pill>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span>{e.actions.toLocaleString()} actions</span>
                <span className="inline-flex items-center gap-1">
                  <Flame className="size-3.5" /> {e.streak}-day streak
                </span>
                <span>{e.referrals} referrals</span>
              </div>
            </Panel>
          ))}
        </div>

        <Panel title="Full ranking" description={`${ranked.length} fans`}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-[11px] uppercase tracking-widest text-muted-foreground">
                  <th className="py-2 pr-3 font-semibold">#</th>
                  <th className="py-2 pr-3 font-semibold">Fan</th>
                  <th className="py-2 pr-3 font-semibold">City</th>
                  <th className="py-2 pr-3 font-semibold">Points</th>
                  <th className="py-2 pr-3 font-semibold">Actions</th>
                  <th className="py-2 pr-3 font-semibold">Streak</th>
                  <th className="py-2 pr-3 font-semibold">Referrals</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ranked.map((e, i) => (
                  <tr key={e.id}>
                    <td className="py-2 pr-3 text-muted-foreground">{i + 1}</td>
                    <td className="py-2 pr-3 font-semibold">{e.fan}</td>
                    <td className="py-2 pr-3 text-muted-foreground">{e.city}</td>
                    <td className="py-2 pr-3 font-semibold">{e.points.toLocaleString()}</td>
                    <td className="py-2 pr-3 text-muted-foreground">{e.actions.toLocaleString()}</td>
                    <td className="py-2 pr-3 text-muted-foreground">{e.streak}d</td>
                    <td className="py-2 pr-3 text-muted-foreground">{e.referrals}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </AdminShell>
  );
}
