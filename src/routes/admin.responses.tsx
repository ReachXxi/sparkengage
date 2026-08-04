import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AdminShell, Metric, Panel, Pill } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdmin } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/responses")({
  head: () => ({
    meta: [
      { title: "Survey responses — SPARKFAN Admin" },
      {
        name: "description",
        content:
          "Read every survey response fan by fan, see aggregated image votes and number averages, and export the raw data for the workspace.",
      },
      { property: "og:title", content: "Survey responses — SPARKFAN Admin" },
      { property: "og:description", content: "Per-fan answers plus aggregated image votes and number averages." },
    ],
  }),
  component: Responses,
});

const tip = {
  contentStyle: {
    background: "oklch(0.168 0 0)",
    border: "1px solid oklch(1 0 0 / 0.14)",
    borderRadius: 12,
    color: "oklch(0.97 0 0)",
    fontSize: 12,
  },
  labelStyle: { color: "oklch(0.7 0 0)" },
};

function Responses() {
  const { surveys, responses } = useAdmin();
  const [surveyId, setSurveyId] = useState(surveys[0]?.id ?? "");
  const survey = surveys.find((s) => s.id === surveyId) ?? surveys[0];
  const rows = responses.filter((r) => r.surveyId === survey?.id);

  return (
    <AdminShell
      title="Survey responses"
      description="Aggregates first, raw answers underneath."
      actions={
        <Button size="sm" variant="outline" className="rounded-full" onClick={() => toast.success("CSV export ready")}>
          <Download className="mr-1 size-4" /> Export CSV
        </Button>
      }
    >
      {!survey ? (
        <Panel>
          <p className="text-sm text-muted-foreground">No surveys in this workspace yet.</p>
        </Panel>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <Select value={survey.id} onValueChange={setSurveyId}>
              <SelectTrigger className="h-9 w-72 rounded-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {surveys.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Pill tone={survey.status === "open" ? "solid" : "default"}>{survey.status}</Pill>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric label="Responses" value={String(rows.length)} />
            <Metric label="Questions" value={String(survey.questions.length)} />
            <Metric
              label="Completion"
              value={`${rows.length ? Math.round((rows.filter((r) => r.answers.length === survey.questions.length).length / rows.length) * 100) : 0}%`}
            />
            <Metric label="Points paid" value={(rows.length * survey.questions.reduce((a, q) => a + q.points, 0)).toLocaleString()} />
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            {survey.questions.map((q) => {
              if (q.kind === "image") {
                const opts = (q.options ?? []).map((o) => ({
                  ...o,
                  votes: rows.filter((r) => r.answers.some((a) => a.questionId === q.id && a.value === o.id)).length,
                }));
                const max = Math.max(1, ...opts.map((o) => o.votes));
                return (
                  <Panel key={q.id} title={q.prompt} description="Image question · vote share">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {opts.map((o) => (
                        <div key={o.id} className="overflow-hidden rounded-xl border border-border">
                          <img src={o.image} alt={o.label} width={200} height={140} loading="lazy" className="h-24 w-full object-cover" />
                          <div className="p-2">
                            <p className="truncate text-xs font-semibold">{o.label}</p>
                            <div className="mt-1 h-1.5 rounded-full bg-muted">
                              <div className="h-1.5 rounded-full bg-primary" style={{ width: `${(o.votes / max) * 100}%` }} />
                            </div>
                            <p className="mt-1 text-[11px] text-muted-foreground">{o.votes} votes</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Panel>
                );
              }
              if (q.kind === "number") {
                const values = rows
                  .map((r) => r.answers.find((a) => a.questionId === q.id)?.value)
                  .filter((v): v is number => typeof v === "number");
                const avg = values.length ? values.reduce((a, v) => a + v, 0) / values.length : 0;
                const buckets = new Map<number, number>();
                values.forEach((v) => buckets.set(v, (buckets.get(v) ?? 0) + 1));
                const data = [...buckets.entries()].sort((a, b) => a[0] - b[0]).map(([value, count]) => ({ value, count }));
                return (
                  <Panel key={q.id} title={q.prompt} description={`Number question · avg ${avg.toFixed(1)} ${q.unit ?? ""}`}>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(1 0 0 / 0.1)" />
                          <XAxis dataKey="value" fontSize={11} stroke="oklch(0.7 0 0)" tickLine={false} axisLine={false} />
                          <YAxis fontSize={11} allowDecimals={false} stroke="oklch(0.7 0 0)" tickLine={false} axisLine={false} />
                          <Tooltip {...tip} />
                          <Bar dataKey="count" fill="oklch(0.97 0 0)" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Panel>
                );
              }
              const texts = rows
                .map((r) => r.answers.find((a) => a.questionId === q.id)?.value)
                .filter((v): v is string => typeof v === "string");
              return (
                <Panel key={q.id} title={q.prompt} description={`Text question · ${texts.length} answers`}>
                  <ul className="max-h-56 space-y-2 overflow-y-auto text-xs">
                    {texts.slice(0, 20).map((t, i) => (
                      <li key={`${t}-${i}`} className="rounded-xl border border-border px-3 py-2 text-muted-foreground">
                        “{t}”
                      </li>
                    ))}
                  </ul>
                </Panel>
              );
            })}
          </div>

          <Panel title="Raw responses" description={`${rows.length} rows`}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-[11px] uppercase tracking-widest text-muted-foreground">
                    <th className="py-2 pr-3 font-semibold">Fan</th>
                    <th className="py-2 pr-3 font-semibold">City</th>
                    <th className="py-2 pr-3 font-semibold">Submitted</th>
                    {survey.questions.map((q, i) => (
                      <th key={q.id} className="py-2 pr-3 font-semibold">
                        Q{i + 1}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rows.slice(0, 40).map((r) => (
                    <tr key={r.id}>
                      <td className="py-2 pr-3 font-semibold">{r.fan}</td>
                      <td className="py-2 pr-3 text-muted-foreground">{r.city}</td>
                      <td className="py-2 pr-3 text-xs text-muted-foreground">{r.at.replace("T", " ").slice(0, 16)}</td>
                      {survey.questions.map((q) => {
                        const val = r.answers.find((a) => a.questionId === q.id)?.value;
                        const label =
                          q.kind === "image" ? (q.options ?? []).find((o) => o.id === val)?.label ?? "—" : String(val ?? "—");
                        return (
                          <td key={q.id} className="max-w-[220px] truncate py-2 pr-3 text-muted-foreground">
                            {label}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>
      )}
    </AdminShell>
  );
}
