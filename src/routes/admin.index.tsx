import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Plus } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AdminShell, Metric, Panel, Pill } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Workspace overview — SPARKFAN Admin" },
      {
        name: "description",
        content:
          "Live engagement metrics for the active SPARKFAN workspace: participants, actions, points issued, verification rate, module performance and daily activity.",
      },
      { property: "og:title", content: "Workspace overview — SPARKFAN Admin" },
      { property: "og:description", content: "Participants, actions, points issued and module performance at a glance." },
    ],
  }),
  component: Overview,
});

const chartColors = ["oklch(0.97 0 0)", "oklch(0.78 0 0)", "oklch(0.6 0 0)", "oklch(0.45 0 0)", "oklch(0.32 0 0)"];

const tooltipStyle = {
  contentStyle: {
    background: "oklch(0.168 0 0)",
    border: "1px solid oklch(1 0 0 / 0.14)",
    borderRadius: 12,
    color: "oklch(0.97 0 0)",
    fontSize: 12,
  },
  itemStyle: { color: "oklch(0.97 0 0)" },
  labelStyle: { color: "oklch(0.7 0 0)" },
};

function Overview() {
  const { campaigns, rewards, surveys, responses, quizResults, gameResults, engagers, activity, tenant } = useAdmin();

  const live = campaigns.filter((c) => c.status === "live");
  const participants = campaigns.reduce((a, c) => a + c.participants, 0);
  const actions = campaigns.reduce((a, c) => a + c.actions, 0);
  const pointsIssued = campaigns.reduce((a, c) => a + c.pointsIssued, 0);
  const verified = live.length ? live.reduce((a, c) => a + c.verification, 0) / live.length : 0;
  const claimed = rewards.reduce((a, r) => a + r.claimed, 0);

  const moduleCounts = new Map<string, number>();
  campaigns.forEach((c) => c.modules.forEach((m) => moduleCounts.set(m, (moduleCounts.get(m) ?? 0) + 1)));

  const gameByType = ["Unscramble the Lyrics", "4 Pics 1 Word", "Guess the Celeb"].map((g) => {
    const rows = gameResults.filter((r) => r.game === g);
    const rounds = rows.reduce((a, r) => a + r.rounds, 0);
    const won = rows.reduce((a, r) => a + r.won, 0);
    return { name: g.split(" ")[0]!, winRate: rounds ? Math.round((won / rounds) * 100) : 0, plays: rows.length };
  });

  const avgQuiz = quizResults.length
    ? Math.round((quizResults.reduce((a, r) => a + r.score / r.total, 0) / quizResults.length) * 100)
    : 0;

  const funnel = [
    { step: "Reached", users: Math.round(participants * 2.1) },
    { step: "Joined", users: participants },
    { step: "1+ action", users: Math.round(participants * 0.78) },
    { step: "Quiz done", users: quizResults.length * 140 },
    { step: "Reward claimed", users: claimed },
  ];

  const cityMap = new Map<string, number>();
  engagers.forEach((e) => cityMap.set(e.city, (cityMap.get(e.city) ?? 0) + e.points));
  const cities = [...cityMap.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5);

  const top = engagers[0];

  return (
    <AdminShell
      title="Workspace overview"
      description={`Everything below is scoped to ${tenant.name}. Switch workspace in the sidebar to see another client's numbers.`}
      actions={
        <Button asChild size="sm" className="rounded-full font-semibold">
          <Link to="/admin/campaigns/new">
            <Plus className="mr-1 size-4" /> New campaign
          </Link>
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Participants" value={participants.toLocaleString()} delta={`${live.length} live`} hint="campaigns running" />
          <Metric label="Actions logged" value={actions.toLocaleString()} delta={`${(actions / Math.max(participants, 1)).toFixed(1)}`} hint="per participant" />
          <Metric label="Points issued" value={pointsIssued.toLocaleString()} delta={`${claimed.toLocaleString()}`} hint="rewards claimed" />
          <Metric label="Verification rate" value={`${verified.toFixed(1)}%`} delta={`${avgQuiz}%`} hint="avg quiz score" />
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <Panel title="Daily activity" description="Joins and actions across the last 14 days" className="xl:col-span-2">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activity}>
                  <defs>
                    <linearGradient id="fillActions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.97 0 0)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="oklch(0.97 0 0)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(1 0 0 / 0.1)" />
                  <XAxis dataKey="day" fontSize={11} stroke="oklch(0.7 0 0)" tickLine={false} axisLine={false} />
                  <YAxis fontSize={11} stroke="oklch(0.7 0 0)" tickLine={false} axisLine={false} />
                  <Tooltip {...tooltipStyle} />
                  <Area type="monotone" dataKey="actions" stroke="oklch(0.97 0 0)" strokeWidth={2} fill="url(#fillActions)" />
                  <Line type="monotone" dataKey="joins" stroke="oklch(0.6 0 0)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="Points by city" description="Where the engagement is concentrated">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={cities} dataKey="value" nameKey="name" innerRadius={52} outerRadius={92} stroke="none">
                    {cities.map((c, i) => (
                      <Cell key={c.name} fill={chartColors[i % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip {...tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              {cities.map((c, i) => (
                <li key={c.name} className="flex items-center gap-2">
                  <span className="size-2 rounded-full" style={{ background: chartColors[i % chartColors.length] }} />
                  {c.name}
                  <span className="ml-auto font-semibold text-foreground">{c.value.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <Panel title="Module coverage" description="How often each module ships in this workspace">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[...moduleCounts.entries()].map(([name, count]) => ({ name: name.split(" ")[0], count }))}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(1 0 0 / 0.1)" />
                  <XAxis dataKey="name" fontSize={11} stroke="oklch(0.7 0 0)" tickLine={false} axisLine={false} />
                  <YAxis fontSize={11} allowDecimals={false} stroke="oklch(0.7 0 0)" tickLine={false} axisLine={false} />
                  <Tooltip {...tooltipStyle} />
                  <Bar dataKey="count" fill="oklch(0.97 0 0)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="Game win rate" description="Share of rounds won per game">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gameByType} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="oklch(1 0 0 / 0.1)" />
                  <XAxis type="number" fontSize={11} stroke="oklch(0.7 0 0)" tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" fontSize={11} width={80} stroke="oklch(0.7 0 0)" tickLine={false} axisLine={false} />
                  <Tooltip {...tooltipStyle} />
                  <Bar dataKey="winRate" fill="oklch(0.8 0 0)" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="Conversion funnel" description="Reach to reward redemption">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={funnel}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(1 0 0 / 0.1)" />
                  <XAxis dataKey="step" fontSize={10} stroke="oklch(0.7 0 0)" tickLine={false} axisLine={false} />
                  <YAxis fontSize={11} stroke="oklch(0.7 0 0)" tickLine={false} axisLine={false} />
                  <Tooltip {...tooltipStyle} />
                  <Line type="monotone" dataKey="users" stroke="oklch(0.97 0 0)" strokeWidth={2} dot />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Panel
            title="Active campaigns"
            className="lg:col-span-2"
            actions={
              <Button asChild size="sm" variant="outline" className="rounded-full">
                <Link to="/admin/campaigns">
                  All campaigns <ArrowUpRight className="ml-1 size-3.5" />
                </Link>
              </Button>
            }
          >
            <ul className="divide-y divide-border">
              {campaigns.slice(0, 5).map((c) => (
                <li key={c.id} className="flex flex-wrap items-center gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{c.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.type} · {c.startsAt} → {c.endsAt} · {c.modules.length} modules
                    </p>
                  </div>
                  <Pill tone={c.status === "live" ? "solid" : "default"}>{c.status}</Pill>
                  <span className="w-24 text-right text-sm font-semibold">{c.participants.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Top engager" description="Highest points in this workspace">
            {top ? (
              <div className="space-y-3">
                <div className="rounded-xl bg-sun p-4 text-accent-foreground">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em]">#1 fan</p>
                  <p className="font-display text-2xl font-bold">{top.fan}</p>
                  <p className="text-sm font-semibold">{top.points.toLocaleString()} pts · {top.city}</p>
                </div>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li className="flex justify-between"><span>Actions</span><span className="font-semibold text-foreground">{top.actions}</span></li>
                  <li className="flex justify-between"><span>Streak</span><span className="font-semibold text-foreground">{top.streak} days</span></li>
                  <li className="flex justify-between"><span>Referrals</span><span className="font-semibold text-foreground">{top.referrals}</span></li>
                  <li className="flex justify-between"><span>Surveys answered</span><span className="font-semibold text-foreground">{responses.length}</span></li>
                  <li className="flex justify-between"><span>Open surveys</span><span className="font-semibold text-foreground">{surveys.filter((s) => s.status === "open").length}</span></li>
                </ul>
                <Button asChild variant="outline" size="sm" className="w-full rounded-full">
                  <Link to="/admin/leaderboard">Open leaderboard</Link>
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No engagement yet in this workspace.</p>
            )}
          </Panel>
        </div>
      </div>
    </AdminShell>
  );
}
