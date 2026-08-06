import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
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
import { MessageSquareQuote, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/lib/admin-store";
import { CHART, CHART_SERIES, DataTable, PageHeader, Panel, StatCard, Td, exportCsv, nf, shortDate } from "@/components/admin/ConsoleUI";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/responses")({
  head: () => ({
    meta: [
      { title: "Survey responses — fan sentiment analytics | SPARKFAN" },
      {
        name: "description",
        content:
          "Read every survey response: image-choice vote shares, numeric averages and distributions, verbatim fan quotes and a full CSV export.",
      },
      { property: "og:title", content: "Survey responses — SPARKFAN console" },
      { property: "og:description", content: "Vote shares, averages and verbatim fan feedback per survey question." },
    ],
  }),
  component: Responses,
});

function Responses() {
  const { surveys, responses, campaigns } = useAdmin();
  const [surveyId, setSurveyId] = useState(surveys[0]?.id ?? "");
  const survey = surveys.find((s) => s.id === surveyId) ?? surveys[0];
  const rows = useMemo(() => (survey ? responses.filter((r) => r.surveyId === survey.id) : []), [responses, survey]);

  const cities = useMemo(() => {
    const map = new Map<string, number>();
    rows.forEach((r) => map.set(r.city, (map.get(r.city) ?? 0) + 1));
    return [...map.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [rows]);

  const completion = survey && survey.questions.length
    ? Math.round(
        (rows.reduce((s, r) => s + r.answers.length, 0) / (rows.length * survey.questions.length || 1)) * 100,
      )
    : 0;

  if (!survey) {
    return (
      <>
        <PageHeader title="Survey responses" subtitle="Aggregated fan answers per question." />
        <Panel>
          <p className="text-sm text-ink-3">No surveys for this tenant yet.</p>
        </Panel>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Survey responses"
        subtitle={`${survey.title} · ${campaigns.find((c) => c.id === survey.campaignId)?.name ?? "—"}`}
        actions={
          <>
            <select
              value={surveyId}
              onChange={(e) => setSurveyId(e.target.value)}
              className="rounded-xl border border-border bg-white px-3 py-2 text-sm font-semibold text-ink-2"
            >
              {surveys.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              onClick={() =>
                exportCsv(`${survey.id}-responses.csv`, [
                  ["Fan", "City", "Submitted", ...survey.questions.map((q) => q.prompt)],
                  ...rows.map((r) => [
                    r.fan,
                    r.city,
                    r.at,
                    ...survey.questions.map((q) => String(r.answers.find((a) => a.questionId === q.id)?.value ?? "")),
                  ]),
                ])
              }
            >
              Export CSV
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Respondents" value={nf(rows.length)} icon={<Users className="size-4" />} />
        <StatCard label="Questions" value={nf(survey.questions.length)} tone="purple" />
        <StatCard label="Answer completion" value={`${completion}%`} tone="success" />
        <StatCard label="Cities reached" value={nf(cities.length)} tone="gold" />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {survey.questions.map((q) => {
          const answers = rows
            .map((r) => r.answers.find((a) => a.questionId === q.id)?.value)
            .filter((v): v is string | number => v !== undefined && v !== "");

          if (q.kind === "image") {
            const counts = new Map<string, number>();
            answers.forEach((v) => counts.set(String(v), (counts.get(String(v)) ?? 0) + 1));
            const data = (q.options ?? []).map((o) => ({
              name: o.label,
              image: o.image,
              value: counts.get(o.id) ?? counts.get(o.label) ?? 0,
            }));
            const total = data.reduce((s, d) => s + d.value, 0) || 1;
            return (
              <Panel key={q.id} title={q.prompt} hint={`Image choice · ${nf(answers.length)} votes`}>
                <div className="space-y-3">
                  {data
                    .slice()
                    .sort((a, b) => b.value - a.value)
                    .map((d, i) => (
                      <div key={d.name} className="flex items-center gap-3">
                        <img src={d.image} alt={d.name} loading="lazy" className="size-12 rounded-xl object-cover" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between text-xs font-bold text-ink">
                            <span className="truncate">{d.name}</span>
                            <span>{Math.round((d.value / total) * 100)}%</span>
                          </div>
                          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-brand/10">
                            <div
                              className={cn("h-full rounded-full", i === 0 ? "bg-gold" : "bg-brand-gradient")}
                              style={{ width: `${(d.value / total) * 100}%` }}
                            />
                          </div>
                        </div>
                        <span className="w-12 text-right text-xs font-semibold text-ink-3">{nf(d.value)}</span>
                      </div>
                    ))}
                </div>
              </Panel>
            );
          }

          if (q.kind === "number") {
            const nums = answers.map(Number).filter((n) => Number.isFinite(n));
            const avg = nums.length ? nums.reduce((s, n) => s + n, 0) / nums.length : 0;
            const min = q.min ?? 0;
            const max = q.max ?? 10;
            const buckets = Array.from({ length: Math.min(10, Math.max(1, max - min + 1)) }, (_, i) => {
              const size = (max - min + 1) / Math.min(10, Math.max(1, max - min + 1));
              const lo = Math.round(min + i * size);
              const hi = Math.round(min + (i + 1) * size) - 1;
              return {
                name: lo === hi ? `${lo}` : `${lo}–${hi}`,
                value: nums.filter((n) => n >= lo && n <= Math.max(lo, hi)).length,
              };
            });
            return (
              <Panel
                key={q.id}
                title={q.prompt}
                hint={`Number · average ${avg.toFixed(1)}${q.unit ?? ""} across ${nf(nums.length)} answers`}
              >
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={buckets}>
                      <CartesianGrid stroke={CHART.grid} vertical={false} />
                      <XAxis dataKey="name" stroke={CHART.axis} fontSize={11} />
                      <YAxis stroke={CHART.axis} fontSize={11} />
                      <Tooltip />
                      <RBar dataKey="value" fill={CHART.blue} radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Panel>
            );
          }

          return (
            <Panel key={q.id} title={q.prompt} hint={`Free text · ${nf(answers.length)} answers`}>
              <ul className="max-h-56 space-y-2 overflow-y-auto pr-1">
                {answers.slice(0, 24).map((v, i) => (
                  <li key={i} className="flex gap-2 rounded-xl bg-brand/5 p-3 text-sm text-ink-2">
                    <MessageSquareQuote className="mt-0.5 size-4 shrink-0 text-brand" />
                    <span>{String(v)}</span>
                  </li>
                ))}
                {answers.length === 0 && <li className="text-sm text-ink-3">No answers yet.</li>}
              </ul>
            </Panel>
          );
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Panel title="Where responses come from" hint="Top cities by respondent count">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={cities.slice(0, 6)} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90}>
                  {cities.slice(0, 6).map((_, i) => (
                    <Cell key={i} fill={CHART_SERIES[i % CHART_SERIES.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Latest submissions" hint={`${nf(rows.length)} total`}>
          <DataTable head={["Fan", "City", "Answers", "Submitted"]}>
            {rows.slice(0, 12).map((r) => (
              <tr key={r.id}>
                <Td className="font-semibold text-ink">{r.fan}</Td>
                <Td>{r.city}</Td>
                <Td>{r.answers.length}</Td>
                <Td>{shortDate(r.at)}</Td>
              </tr>
            ))}
          </DataTable>
        </Panel>
      </div>
    </>
  );
}
