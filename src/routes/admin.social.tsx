import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, ExternalLink, Link2, MessageSquare, Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/lib/admin-store";
import type { SocialTask } from "@/data/console";
import { Button as UIButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  const { tenant, submissions, socialTasks, campaigns, actions } = useAdmin();
  const tasks = useMemo(() => socialTasks, [socialTasks]);
  const [taskId, setTaskId] = useState(tasks[0]?.id ?? "");
  const [editing, setEditing] = useState<SocialTask | null>(null);
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
          <>
            <UIButton
              className="rounded-full bg-brand-gradient font-bold text-white"
              onClick={() =>
                setEditing({
                  id: `so-${Math.random().toString(36).slice(2, 8)}`,
                  tenantId: tenant.id,
                  campaignId: campaigns[0]?.id ?? "",
                  platform: "Instagram",
                  label: "",
                  hashtag: "#",
                  url: "https://",
                  points: 25,
                  submissions: 0,
                  approved: 0,
                  rejected: 0,
                })
              }
            >
              <Plus className="size-4" /> New social task
            </UIButton>
            {active && (
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
            )}
          </>
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
                {t.url && (
                  <a
                    href={t.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="mt-1 inline-flex max-w-full items-center gap-1 truncate text-[11px] font-semibold text-brand"
                  >
                    <Link2 className="size-3" /> <span className="truncate">{t.url}</span>
                  </a>
                )}
                <p className="mt-2 text-xs font-semibold text-ink-2">
                  {nf(t.approved)} approved · {nf(t.rejected)} rejected of {nf(t.submissions)}
                </p>
                <div className="mt-2">
                  <Bar value={rate} tone="success" />
                </div>
                <div className="mt-3 flex gap-2">
                  <UIButton
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditing(t);
                    }}
                  >
                    <Pencil className="size-3.5" /> Edit
                  </UIButton>
                  <UIButton
                    size="sm"
                    variant="ghost"
                    className="rounded-full text-bad hover:bg-bad/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      actions.deleteSocialTask(t.id);
                      actions.log("Deleted social task", t.label, "critical");
                      toast.success("Task removed");
                    }}
                  >
                    <Trash2 className="size-3.5" />
                  </UIButton>
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

      {editing && (
        <TaskEditor
          key={editing.id}
          task={editing}
          campaigns={campaigns.map((c) => ({ id: c.id, name: c.name }))}
          onClose={() => setEditing(null)}
          onSave={(t) => {
            if (!t.label.trim()) {
              toast.error("Name the task first.");
              return;
            }
            actions.saveSocialTask(t);
            actions.log("Saved social task", t.label);
            setEditing(null);
            setTaskId(t.id);
            toast.success("Social task saved");
          }}
        />
      )}
    </>
  );
}

const PLATFORMS: SocialTask["platform"][] = ["Instagram", "X", "TikTok", "Spotify", "Apple Music", "Goodreads"];

function TaskEditor({
  task,
  campaigns,
  onClose,
  onSave,
}: {
  task: SocialTask;
  campaigns: { id: string; name: string }[];
  onClose: () => void;
  onSave: (t: SocialTask) => void;
}) {
  const [draft, setDraft] = useState<SocialTask>(task);
  const set = <K extends keyof SocialTask>(k: K, v: SocialTask[K]) => setDraft((d) => ({ ...d, [k]: v }));

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xl rounded-3xl">
        <DialogHeader>
          <DialogTitle>{task.label ? "Edit social task" : "New social task"}</DialogTitle>
          <DialogDescription>Platform, hashtag, the link fans are sent to and the points it pays.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-ink">
            Task label
            <Input value={draft.label} onChange={(e) => set("label", e.target.value)} className="mt-1 rounded-xl" placeholder="Share the album art" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-ink">
              Platform
              <select
                value={draft.platform}
                onChange={(e) => set("platform", e.target.value as SocialTask["platform"])}
                className="mt-1 h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-semibold text-ink">
              Campaign
              <select
                value={draft.campaignId}
                onChange={(e) => set("campaignId", e.target.value)}
                className="mt-1 h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
              >
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-ink">
              Hashtag
              <Input value={draft.hashtag} onChange={(e) => set("hashtag", e.target.value)} className="mt-1 rounded-xl" />
            </label>
            <label className="block text-sm font-semibold text-ink">
              Points
              <Input type="number" value={draft.points} onChange={(e) => set("points", Number(e.target.value))} className="mt-1 rounded-xl" />
            </label>
          </div>
          <label className="block text-sm font-semibold text-ink">
            Task link (where the fan completes it)
            <Input
              value={draft.url ?? ""}
              onChange={(e) => set("url", e.target.value)}
              className="mt-1 rounded-xl"
              placeholder="https://instagram.com/p/…"
            />
          </label>
        </div>
        <DialogFooter>
          <UIButton variant="ghost" onClick={onClose}>
            Cancel
          </UIButton>
          <UIButton onClick={() => onSave(draft)}>Save task</UIButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
