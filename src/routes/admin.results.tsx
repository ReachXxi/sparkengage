import { createFileRoute } from "@tanstack/react-router";
import { AdminShell, Metric, Panel, Pill } from "@/components/admin/AdminShell";
import { useAdmin } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/results")({
  head: () => ({
    meta: [
      { title: "Quiz & game results — SPARKFAN Admin" },
      {
        name: "description",
        content:
          "Every quiz attempt and game round in the workspace: scores, completion time, rounds won and points awarded per fan.",
      },
      { property: "og:title", content: "Quiz & game results — SPARKFAN Admin" },
      { property: "og:description", content: "Scores, speed and points from quizzes and games." },
    ],
  }),
  component: Results,
});

function Results() {
  const { quizResults, gameResults, campaigns } = useAdmin();
  const name = (id: string) => campaigns.find((c) => c.id === id)?.name ?? "—";
  const avgScore = quizResults.length
    ? Math.round((quizResults.reduce((a, r) => a + r.score / r.total, 0) / quizResults.length) * 100)
    : 0;
  const gamePoints = gameResults.reduce((a, r) => a + r.points, 0);

  return (
    <AdminShell title="Quiz & games" description="Raw performance logs behind the leaderboard.">
      <div className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Quiz attempts" value={quizResults.length.toLocaleString()} />
          <Metric label="Avg quiz score" value={`${avgScore}%`} />
          <Metric label="Game rounds" value={gameResults.reduce((a, r) => a + r.rounds, 0).toLocaleString()} />
          <Metric label="Game points" value={gamePoints.toLocaleString()} />
        </div>

        <Panel title="Quiz results" description={`${quizResults.length} attempts`}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-[11px] uppercase tracking-widest text-muted-foreground">
                  <th className="py-2 pr-3 font-semibold">Fan</th>
                  <th className="py-2 pr-3 font-semibold">Campaign</th>
                  <th className="py-2 pr-3 font-semibold">Score</th>
                  <th className="py-2 pr-3 font-semibold">Time</th>
                  <th className="py-2 pr-3 font-semibold">When</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {quizResults.slice(0, 40).map((r) => (
                  <tr key={r.id}>
                    <td className="py-2 pr-3 font-semibold">{r.fan}</td>
                    <td className="py-2 pr-3 text-muted-foreground">{name(r.campaignId)}</td>
                    <td className="py-2 pr-3">
                      <Pill tone={r.score / r.total >= 0.8 ? "solid" : "muted"}>
                        {r.score}/{r.total}
                      </Pill>
                    </td>
                    <td className="py-2 pr-3 text-muted-foreground">{r.seconds}s</td>
                    <td className="py-2 pr-3 text-xs text-muted-foreground">{r.at.replace("T", " ").slice(0, 16)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Game results" description={`${gameResults.length} sessions`}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-[11px] uppercase tracking-widest text-muted-foreground">
                  <th className="py-2 pr-3 font-semibold">Fan</th>
                  <th className="py-2 pr-3 font-semibold">Game</th>
                  <th className="py-2 pr-3 font-semibold">Campaign</th>
                  <th className="py-2 pr-3 font-semibold">Won</th>
                  <th className="py-2 pr-3 font-semibold">Points</th>
                  <th className="py-2 pr-3 font-semibold">When</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {gameResults.slice(0, 40).map((r) => (
                  <tr key={r.id}>
                    <td className="py-2 pr-3 font-semibold">{r.fan}</td>
                    <td className="py-2 pr-3">{r.game}</td>
                    <td className="py-2 pr-3 text-muted-foreground">{name(r.campaignId)}</td>
                    <td className="py-2 pr-3 text-muted-foreground">
                      {r.won}/{r.rounds}
                    </td>
                    <td className="py-2 pr-3 font-semibold">{r.points.toLocaleString()}</td>
                    <td className="py-2 pr-3 text-xs text-muted-foreground">{r.at.replace("T", " ").slice(0, 16)}</td>
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
