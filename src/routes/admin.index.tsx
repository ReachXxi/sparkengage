import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, Gift, Radio, Sparkles, Trophy, Users } from "lucide-react";
import { useAdmin, tenantSocialTasks } from "@/lib/admin-store";
import { activitySeries } from "@/data/console";
import {
  Bar as MiniBar,
  CHART,
  CHART_SERIES,
  DataTable,
  PageHeader,
  Panel,
  Pill,
  StatCard,
  Td,
  nf,
} from "@/components/admin/ConsoleUI";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Console overview — live campaign metrics | SPARKFAN" },
      {
        name: "description",
        content:
          "Total fans, active streams, engagement rate, points distributed and survey completion in one live console overview, with the top engagers leaderboard.",
      },
      { property: "og:title", content: "Console overview — live campaign metrics" },
      { property: "og:description", content: "Live SPARKFAN campaign metrics, charts and top engagers." },
    ],
  }),
  component: Overview,
});

function Overview() {
  const { tenant, campaigns, users, streams, responses, surveys, rewards, leaderboard, gameResults, quizResults } =
    useAdmin();

  const series = activitySeries(tenant.id);
  const liveStreams = streams.filter((s) => s.status === "live");
  const totalPoints = campaigns.reduce((a, c) => a + c.pointsIssued, 0);
  const totalActions = campaigns.reduce((a, c) => a + c.actions, 0);
  const participants = campaigns.reduce((a, c) => a + c.participants, 0);
  const engagement = participants ? Math.round((totalActions / participants) * 10) / 10 : 0;
  const surveyTargets = surveys.reduce((a) => a + 100, 0);
  const completion = surveyTargets
    ? Math.min(100, Math.round((responses.length / (surveys.length * 80)) * 100))
    : 0;

  const social = tenantSocialTasks(tenant.id);
  const platformSplit = Object.values(
    social.reduce<Record<string, { name: string; value: number }>>((acc, t) => {
      acc[t.platform] = { name: t.platform, value: (acc[t.platform]?.value ?? 0) + t.approved };
      return acc;
    }, {}),
  );

  const funnel = [
    { step: "Viewed", users: Math.round(participants * 2.4) },
    { step: "Joined", users: participants },
    { step: "1+ action", users: Math.round(participants * 0.78) },
    { step: "Quiz done", users: quizResults.length * 210 },
    { step: "Redeemed", users: rewards.reduce((a, r) => a + r.redeemed, 0) },
  ];

  const gameSplit = Object.values(
    gameResults.reduce<Record<string, { name: string; plays: number; points: number }>>((acc, g) => {
      const row = acc[g.game] ?? { name: g.game, plays: 0, points: 0 };
      row.plays += 1;
      row.points += g.points;
      acc[g.game] = row;
      return acc;
    }, {}),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Console overview"
        subtitle={`Everything happening across ${tenant.name} right now — engagement, points, streams and the fans driving it.`}
        actions={
          <>
            <Link
              to="/admin/campaigns"
              className="rounded-full bg-brand-gradient px-4 py-2.5 text-sm font-bold text-white shadow-console"
            >
              <Sparkles className="mr-1 inline size-4" /> New campaign
            </Link>
            <Link
              to="/admin/leaderboard"
              className="rounded-full border border-border bg-white px-4 py-2.5 text-sm font-bold text-ink-2 hover:bg-brand/5"
            >
              Leaderboard
            </Link>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total users" value={nf(users.length * 812)} delta="+6.4% vs last week" icon={<Users className="size-4" />} />
        <StatCard label="Active streams" value={`${liveStreams.length} live`} delta={`${nf(streams.reduce((a, s) => a + s.viewers, 0))} views total`} icon={<Radio className="size-4" />} tone="purple" />
        <StatCard label="Engagement rate" value={`${engagement} actions / fan`} delta={`${nf(totalActions)} actions logged`} icon={<Activity className="size-4" />} tone="success" />
        <StatCard label="Points distributed" value={nf(totalPoints)} delta={`${nf(Math.round(totalPoints / 1000))}k this cycle`} icon={<Trophy className="size-4" />} tone="gold" />
        <StatCard label="Survey completion" value={`${completion}%`} delta={`${nf(responses.length)} responses`} icon={<Sparkles className="size-4" />} />
        <StatCard label="Rewards redeemed" value={nf(rewards.reduce((a, r) => a + r.redeemed, 0))} delta={`${rewards.filter((r) => r.status === "active").length} active rewards`} icon={<Gift className="size-4" />} tone="purple" />
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <Panel title="Engagement over 14 days" hint="Joins, actions and points issued" className="xl:col-span-2">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series}>
                <defs>
                  <linearGradient id="gJoins" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART.blue} stopOpacity={0.45} />
                    <stop offset="100%" stopColor={CHART.blue} stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gActions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART.purple} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={CHART.purple} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={CHART.grid} vertical={false} />
                <XAxis dataKey="day" fontSize={11} stroke={CHART.axis} tickLine={false} />
                <YAxis fontSize={11} stroke={CHART.axis} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 16, border: `1px solid ${CHART.grid}` }} />
                <Legend />
                <Area type="monotone" dataKey="actions" stroke={CHART.purple} fill="url(#gActions)" strokeWidth={2.5} name="Actions" />
                <Area type="monotone" dataKey="joins" stroke={CHART.blue} fill="url(#gJoins)" strokeWidth={2.5} name="Joins" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Social actions by platform" hint="Verified submissions">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={platformSplit} dataKey="value" nameKey="name" innerRadius={52} outerRadius={92} paddingAngle={3}>
                  {platformSplit.map((p, i) => (
                    <Cell key={p.name} fill={CHART_SERIES[i % CHART_SERIES.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip contentStyle={{ borderRadius: 16, border: `1px solid ${CHART.grid}` }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Fan funnel" hint="From impression to redemption" className="xl:col-span-2">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={funnel}>
                <CartesianGrid stroke={CHART.grid} vertical={false} />
                <XAxis dataKey="step" fontSize={11} stroke={CHART.axis} tickLine={false} />
                <YAxis fontSize={11} stroke={CHART.axis} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 16, border: `1px solid ${CHART.grid}` }} />
                <Line type="monotone" dataKey="users" stroke={CHART.blue} strokeWidth={3} dot={{ r: 4, fill: CHART.purple }} name="Fans" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Games played" hint="Plays per game type">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gameSplit}>
                <CartesianGrid stroke={CHART.grid} vertical={false} />
                <XAxis dataKey="name" fontSize={10} stroke={CHART.axis} tickLine={false} interval={0} angle={-12} dy={8} height={50} />
                <YAxis fontSize={11} stroke={CHART.axis} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 16, border: `1px solid ${CHART.grid}` }} />
                <Bar dataKey="plays" fill={CHART.purple} radius={[8, 8, 0, 0]} name="Plays" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Panel
          title="Top engagers"
          hint="Live ranking, updates every few seconds"
          actions={
            <Link to="/admin/engagers" className="text-xs font-bold text-brand hover:underline">
              View all
            </Link>
          }
        >
          <ul className="space-y-3">
            {leaderboard.slice(0, 8).map((u) => (
              <li key={u.id} className="flex items-center gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-brand/10 text-xs font-bold text-brand">
                  {u.rank}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 text-sm font-semibold text-ink">
                    <span className="truncate">{u.name}</span>
                    <span className="shrink-0 text-[11px] text-ink-3">{u.badge}</span>
                  </span>
                  <MiniBar value={(u.points / (leaderboard[0]?.points || 1)) * 100} tone={u.rank <= 3 ? "gold" : "brand"} />
                </span>
                <span className="shrink-0 text-right">
                  <span className="block text-sm font-bold text-ink">{nf(u.points)}</span>
                  <span className="block text-[11px] text-ink-3">{u.city}</span>
                </span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          title="Campaigns"
          hint="Status, participation and verification"
          actions={
            <Link to="/admin/campaigns" className="text-xs font-bold text-brand hover:underline">
              Manage
            </Link>
          }
        >
          <DataTable head={["Campaign", "Status", "Fans", "Actions", "Verified"]}>
            {campaigns.map((c) => (
              <tr key={c.id}>
                <Td className="font-semibold text-ink">
                  <span className="line-clamp-1">{c.name}</span>
                  <span className="block text-[11px] text-ink-3">
                    {c.startsAt} → {c.endsAt}
                  </span>
                </Td>
                <Td>
                  <Pill>{c.status}</Pill>
                </Td>
                <Td>{nf(c.participants)}</Td>
                <Td>{nf(c.actions)}</Td>
                <Td>{c.verification ? `${c.verification}%` : "—"}</Td>
              </tr>
            ))}
          </DataTable>
        </Panel>
      </div>
    </div>
  );
}
