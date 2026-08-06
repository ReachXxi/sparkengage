import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, ExternalLink, MessageSquare, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAdmin, tenantSocialTasks } from "@/lib/admin-store";
import { Bar, DataTable, PageHeader, Panel, Pill, StatCard, Td, nf, shortDate } from "@/components/admin/ConsoleUI";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/social")({
  head: () => ({
    meta: [
      { title: "Social tasks — verify fan posts & approve points | SPARKFAN" },
      {
        name: "description",
        content:
          "Review social proof from fans across Instagram, X, TikTok and streaming platforms: approve or reject submissions in bulk and track verification rates.",
      },
      { property: "og:title", content: "Social tasks — SPARKFAN console" },
      { property: "og:description", content: "Verify fan social submissions and release points." },
    ],
  }),
  component: Social,
});

function Social() {
  const { tenant, submissions, actions } = useAdmin();
  const tasks = useMemo(() => tenantSocialTasks(tenant.id), [tenant.id]);
  const [taskId, setTaskId] = useState(tasks[0]?.id ?? "");
  const active = tasks.find((t) => t.id === taskId) ?? tasks[0];
  const rows = submissions.filter((s) => (active ? s.taskId === active.id : false));

  const pending = submissions.filter((s) => s.status === "pending").length;
  const approved = submissions.filter((s) => s.status === "approved").length;
  const total = submissions.length || 1;

  return (
    <>
      <PageHeader
        title="Social tasks"
        subtitle="Fan-submitted proof waiting on verification before points are released."
        actions={
          active && (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  actions.bulkReview(active.id, "approved");
                  actions.log("Bulk approved submissions", active.label);
                  toast.success("Pending submissions approved");
                }}
              >
                <Check className="size-4" /> Approve all pending
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  actions.bulkReview(active.id, "rejected");
                  actions.log("Bulk rejected submissions", active.label, "warning");
                }}
              >
                <X className="size-4" /> Reject all pending
              </Button>
            </>
          )
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Tasks live" value={nf(tasks.length)} icon={<MessageSquare className="size-4" />} />
        <StatCard label="Submissions" value={nf(submissions.length)} tone="purple" />
        <StatCard label="Awaiting review" value={nf(pending)} tone="gold" />
        <StatCard label="Verification rate" value={`${Math.round((approved / total) * 100)}%`} tone="success" />
      </div>

      <Panel title="Tasks" hint="Select a task to review its queue">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {tasks.map((t) => {
            const rate = t.submissions ? (t.approved / t.submissions) * 100 : 0;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTaskId(t.id)}
                className={cn(
                  "rounded-2xl border p-4 text-left transition",
                  t.id === active?.id ? "border-brand bg-brand/8" : "border-border bg-white hover:bg-brand/5",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-ink">{t.label}</span>
                  <Pill>{t.platform}</Pill>
                </div>
                <p className="mt-1 text-xs text-ink-3">
                  {t.hashtag} · {t.points} pts
                </p>
                <p className="mt-2 text-xs font-semibold text-ink-2">
                  {nf(t.approved)} approved · {nf(t.rejected)} rejected of {nf(t.submissions)}
                </p>
                <div className="mt-2">
                  <Bar value={rate} tone="success" />
                </div>
              </button>
            );
          })}
        </div>
      </Panel>

      <Panel title={`Review queue${active ? ` — ${active.label}` : ""}`} hint={`${rows.length} submissions`}>
        <DataTable head={["Fan", "Handle", "Proof", "Submitted", "Status", ""]}>
          {rows.map((s) => (
            <tr key={s.id}>
              <Td className="font-semibold text-ink">{s.fan}</Td>
              <Td>{s.handle}</Td>
              <Td>
                <a href={s.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-brand">
                  Open <ExternalLink className="size-3.5" />
                </a>
              </Td>
              <Td>{shortDate(s.at)}</Td>
              <Td>
                <Pill tone={s.status}>{s.status}</Pill>
              </Td>
              <Td>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => actions.reviewSubmission(s.id, "approved")}>
                    <Check className="size-3.5" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => actions.reviewSubmission(s.id, "rejected")}>
                    <X className="size-3.5" />
                  </Button>
                </div>
              </Td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <Td className="text-ink-3">No submissions for this task yet.</Td>
            </tr>
          )}
        </DataTable>
      </Panel>
    </>
  );
}
