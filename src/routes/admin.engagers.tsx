import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Bar as RBar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Crown, Share2, Zap } from "lucide-react";
import { useAdmin } from "@/lib/admin-store";
import { Bar, CHART, DataTable, PageHeader, Panel, Pill, StatCard, Td, nf, dayOnly } from "@/components/admin/ConsoleUI";

export const Route = createFileRoute("/admin/engagers")({
  head: () => ({
    meta: [
      { title: "Top engagers — superfans, streaks & referrals | SPARKFAN" },
      {
        name: "description",
        content:
          "Find the fans doing the heavy lifting: highest action counts, longest streaks and most referrals, scored into a single engagement index.",
      },
      { property: "og:title", content: "Top engagers — SPARKFAN console" },
      { property: "og:description", content: "Rank superfans by actions, streaks and referrals." },
    ],
  }),
  component: Engagers,
});

function Engagers() {
  const { users, quizResults, gameResults, responses } = useAdmin();

  const scored = useMemo(
    () =>
      users
        .map((u) => {
          const quizzes = quizResults.filter((r) => r.fan === u.name).length;
          const games = gameResults.filter((r) => r.fan === u.name).length;
          const surveys = responses.filter((r) => r.fan === u.name).length;
          const score = u.actions * 1 + u.streak * 6 + u.referrals * 12 + quizzes * 4 + games * 3 + surveys * 8;
          return { ...u, quizzes, games, surveys, score };
        })
        .sort((a, b) => b.score - a.score),
    [users, quizResults, gameResults, responses],
  );

  const max = scored[0]?.score ?? 1;
  const chart = scored.slice(0, 10).map((u) => ({ name: u.name.split(" ")[0] ?? u.name, score: u.score }));

  return (
    <>
      <PageHeader title="Top engagers" subtitle="A single engagement index across actions, streaks, referrals and content played." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Superfans" value={nf(users.filter((u) => u.segment === "Superfan").length)} icon={<Crown className="size-4" />} />
        <StatCard label="Total actions" value={nf(users.reduce((s, u) => s + u.actions, 0))} tone="purple" icon={<Zap className="size-4" />} />
        <StatCard label="Referrals driven" value={nf(users.reduce((s, u) => s + u.referrals, 0))} tone="success" icon={<Share2 className="size-4" />} />
        <StatCard label="Best index" value={nf(max)} tone="gold" />
      </div>

      <Panel title="Engagement index — top 10" hint="Weighted: actions ×1, streak ×6, referrals ×12, plays ×3–8">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart}>
              <CartesianGrid stroke={CHART.grid} vertical={false} />
              <XAxis dataKey="name" stroke={CHART.axis} fontSize={11} />
              <YAxis stroke={CHART.axis} fontSize={11} />
              <Tooltip />
              <RBar dataKey="score" name="Index" fill={CHART.purple} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <Panel title="Engager breakdown">
        <DataTable head={["#", "Fan", "Segment", "Actions", "Streak", "Referrals", "Quizzes", "Games", "Surveys", "Index", "Joined"]}>
          {scored.map((u, i) => (
            <tr key={u.id}>
              <Td className="font-bold text-ink">{i + 1}</Td>
              <Td className="font-semibold text-ink">{u.name}</Td>
              <Td>
                <Pill>{u.segment}</Pill>
              </Td>
              <Td>{nf(u.actions)}</Td>
              <Td>{u.streak}d</Td>
              <Td>{u.referrals}</Td>
              <Td>{u.quizzes}</Td>
              <Td>{u.games}</Td>
              <Td>{u.surveys}</Td>
              <Td className="w-32">
                <Bar value={(u.score / max) * 100} tone={i < 3 ? "gold" : "brand"} />
                <span className="text-[11px] text-ink-3">{nf(u.score)}</span>
              </Td>
              <Td>{dayOnly(u.joinedAt)}</Td>
            </tr>
          ))}
        </DataTable>
      </Panel>
    </>
  );
}
