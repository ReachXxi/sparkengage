import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  Bar as RBar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Gamepad2, Target, Timer, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/lib/admin-store";
import {
  Bar,
  CHART,
  CHART_SERIES,
  DataTable,
  PageHeader,
  Panel,
  StatCard,
  Td,
  exportCsv,
  nf,
  shortDate,
} from "@/components/admin/ConsoleUI";

export const Route = createFileRoute("/admin/games")({
  head: () => ({
    meta: [
      { title: "Games & quiz results — accuracy and solve rates | SPARKFAN" },
      {
        name: "description",
        content:
          "Read quiz scores, per-question accuracy, Guess the Celebrity solve rates and results from memory and word games across every fan campaign.",
      },
      { property: "og:title", content: "Games & quiz results — SPARKFAN console" },
      { property: "og:description", content: "Quiz accuracy, celebrity solve rates and game leaderboards." },
    ],
  }),
  component: Games,
});

function Games() {
  const { quizResults, gameResults, quizQuestions, celebrities, campaigns } = useAdmin();
  const campaignIds = campaigns.map((c) => c.id);

  const questions = quizQuestions.filter((q) => campaignIds.includes(q.campaignId));
  const celebs = celebrities.filter((c) => campaignIds.includes(c.campaignId));

  const avgScore = quizResults.length
    ? Math.round(
        (quizResults.reduce((s, r) => s + r.score / (r.total || 1), 0) / quizResults.length) * 100,
      )
    : 0;
  const avgSeconds = quizResults.length
    ? Math.round(quizResults.reduce((s, r) => s + r.seconds, 0) / quizResults.length)
    : 0;

  const byGame = useMemo(() => {
    const map = new Map<string, { name: string; plays: number; won: number; points: number }>();
    gameResults.forEach((g) => {
      const cur = map.get(g.game) ?? { name: g.game, plays: 0, won: 0, points: 0 };
      cur.plays += g.rounds;
      cur.won += g.won;
      cur.points += g.points;
      map.set(g.game, cur);
    });
    return [...map.values()];
  }, [gameResults]);

  const hardest = [...questions].sort((a, b) => a.accuracy - b.accuracy).slice(0, 10);

  return (
    <>
      <PageHeader
        title="Games & quiz results"
        subtitle="How fans are actually performing — question by question, round by round."
        actions={
          <Button
            variant="outline"
            onClick={() =>
              exportCsv("game-results.csv", [
                ["Fan", "Game", "Rounds", "Won", "Points", "At"],
                ...gameResults.map((g) => [g.fan, g.game, g.rounds, g.won, g.points, g.at]),
              ])
            }
          >
            Export CSV
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Quiz attempts" value={nf(quizResults.length)} icon={<Target className="size-4" />} />
        <StatCard label="Average score" value={`${avgScore}%`} tone="success" />
        <StatCard label="Average time" value={`${avgSeconds}s`} tone="purple" icon={<Timer className="size-4" />} />
        <StatCard label="Game rounds played" value={nf(gameResults.reduce((s, g) => s + g.rounds, 0))} tone="gold" icon={<Gamepad2 className="size-4" />} />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Panel title="Win rate by game" hint="Rounds won vs played">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byGame}>
                <CartesianGrid stroke={CHART.grid} vertical={false} />
                <XAxis dataKey="name" stroke={CHART.axis} fontSize={11} />
                <YAxis stroke={CHART.axis} fontSize={11} />
                <Tooltip />
                <Legend />
                <RBar dataKey="plays" name="Rounds" fill={CHART.blueLight} radius={[6, 6, 0, 0]} />
                <RBar dataKey="won" name="Won" fill={CHART.blue} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Points issued by game" hint="Share of game points">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={byGame} dataKey="points" nameKey="name" innerRadius={50} outerRadius={90}>
                  {byGame.map((_, i) => (
                    <Cell key={i} fill={CHART_SERIES[i % CHART_SERIES.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel title="Guess the Celebrity — solve rates" hint="Real photos used in the fan app">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {celebs.map((c) => {
            const rate = c.guesses ? (c.solved / c.guesses) * 100 : 0;
            return (
              <div key={c.id} className="flex items-center gap-3 rounded-2xl border border-border bg-white p-3">
                <img src={c.image} alt={c.name} loading="lazy" className="size-16 rounded-xl object-cover object-top" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-ink">{c.name}</p>
                  <p className="truncate text-[11px] text-ink-3">{c.hint}</p>
                  <div className="mt-2">
                    <Bar value={rate} tone={rate > 70 ? "success" : "gold"} />
                  </div>
                  <p className="mt-1 text-[11px] font-semibold text-ink-2">
                    {Math.round(rate)}% solved · {nf(c.guesses)} guesses
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      <div className="grid gap-5 xl:grid-cols-2">
        <Panel title="Hardest quiz questions" hint="Lowest accuracy first">
          <DataTable head={["Question", "Answer", "Accuracy"]}>
            {hardest.map((q) => (
              <tr key={q.id}>
                <Td className="font-semibold text-ink">{q.q}</Td>
                <Td>{q.a}</Td>
                <Td className="w-32">
                  <Bar value={q.accuracy} tone={q.accuracy < 40 ? "gold" : "brand"} />
                  <span className="text-[11px] text-ink-3">{q.accuracy}%</span>
                </Td>
              </tr>
            ))}
          </DataTable>
        </Panel>

        <Panel title="Top quiz scores" hint="Fastest perfect runs first">
          <DataTable head={["Fan", "Score", "Time", "When"]}>
            {[...quizResults]
              .sort((a, b) => b.score / b.total - a.score / a.total || a.seconds - b.seconds)
              .slice(0, 12)
              .map((r) => (
                <tr key={r.id}>
                  <Td className="font-semibold text-ink">{r.fan}</Td>
                  <Td>
                    {r.score}/{r.total}
                  </Td>
                  <Td>{r.seconds}s</Td>
                  <Td>{shortDate(r.at)}</Td>
                </tr>
              ))}
          </DataTable>
        </Panel>
      </div>

      <Panel title="Recent game results" hint={`${nf(gameResults.length)} results`}>
        <DataTable head={["Fan", "Game", "Rounds", "Won", "Points", "When"]}>
          {gameResults.slice(0, 15).map((g) => (
            <tr key={g.id}>
              <Td className="font-semibold text-ink">{g.fan}</Td>
              <Td>{g.game}</Td>
              <Td>{g.rounds}</Td>
              <Td>
                <span className="inline-flex items-center gap-1 font-semibold text-ok">
                  <Trophy className="size-3.5" /> {g.won}
                </span>
              </Td>
              <Td>{nf(g.points)}</Td>
              <Td>{shortDate(g.at)}</Td>
            </tr>
          ))}
        </DataTable>
      </Panel>
    </>
  );
}
