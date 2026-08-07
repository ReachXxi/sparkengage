import { createFileRoute } from "@tanstack/react-router";
import { ListChecks, Pause, Pencil, Play, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdmin } from "@/lib/admin-store";
import type { Activity } from "@/data/console";
import { Bar, DataTable, PageHeader, Panel, Pill, StatCard, Td, nf } from "@/components/admin/ConsoleUI";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/activities")({
  head: () => ({
    meta: [
      { title: "Activities — point-earning tasks & completion rates | SPARKFAN" },
      {
        name: "description",
        content:
          "Manage every point-earning activity in a campaign: streams, quizzes, games, social tasks and surveys, with targets, completion rates and pause controls.",
      },
      { property: "og:title", content: "Activities — SPARKFAN console" },
      { property: "og:description", content: "Track and control every point-earning fan activity." },
    ],
  }),
  component: Activities,
});

const TYPES: Activity["type"][] = ["Stream", "Quiz", "Game", "Social", "Survey", "Review"];

function Activities() {
  const { activities, campaigns, tenant, actions } = useAdmin();
  const [editing, setEditing] = useState<Activity | null>(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<Activity["type"]>("Quiz");
  const [points, setPoints] = useState(20);

  const completions = activities.reduce((s, a) => s + a.completions, 0);
  const targets = activities.reduce((s, a) => s + a.target, 0);

  const add = () => {
    if (!title.trim()) {
      toast.error("Name the activity");
      return;
    }
    actions.saveActivity({
      id: `a-${Math.random().toString(36).slice(2, 8)}`,
      tenantId: tenant.id,
      campaignId: campaigns[0]?.id ?? "",
      title,
      type,
      points,
      completions: 0,
      target: 1000,
      status: "active",
    });
    actions.log("Created activity", title);
    toast.success("Activity added");
    setTitle("");
  };

  return (
    <>
      <PageHeader title="Activities" subtitle="Every action a fan can take, what it pays and how far it is from target." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Activities" value={nf(activities.length)} icon={<ListChecks className="size-4" />} />
        <StatCard label="Completions" value={nf(completions)} tone="success" />
        <StatCard label="Against target" value={`${targets ? Math.round((completions / targets) * 100) : 0}%`} tone="gold" />
        <StatCard label="Paused" value={nf(activities.filter((a) => a.status === "paused").length)} tone="purple" />
      </div>

      <Panel title="Add an activity" hint="Appears in the fan app instantly">
        <div className="flex flex-wrap items-end gap-3">
          <Input className="max-w-xs" placeholder="Activity title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <select
            value={type}
            onChange={(e) => setType(e.target.value as Activity["type"])}
            className="rounded-xl border border-border bg-white px-3 py-2 text-sm"
          >
            {TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <Input
            className="w-28"
            type="number"
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
            aria-label="Points"
          />
          <Button onClick={add}>
            <Plus className="size-4" /> Add
          </Button>
        </div>
      </Panel>

      <Panel title="All activities">
        <DataTable head={["Activity", "Type", "Points", "Completions", "Progress", "Status", ""]}>
          {activities.map((a) => (
            <tr key={a.id}>
              <Td className="font-semibold text-ink">{a.title}</Td>
              <Td>{a.type}</Td>
              <Td>{a.points}</Td>
              <Td>
                {nf(a.completions)} / {nf(a.target)}
              </Td>
              <Td className="w-40">
                <Bar value={a.target ? (a.completions / a.target) * 100 : 0} />
              </Td>
              <Td>
                <Pill tone={a.status}>{a.status}</Pill>
              </Td>
              <Td>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => setEditing(a)}>
                    <Pencil className="size-3.5" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      actions.toggleActivity(a.id);
                      actions.log("Toggled activity", a.title);
                    }}
                  >
                    {a.status === "active" ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
                    {a.status === "active" ? "Pause" : "Resume"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-bad hover:bg-bad/10"
                    onClick={() => {
                      actions.deleteActivity(a.id);
                      actions.log("Deleted activity", a.title, "critical");
                      toast.success("Activity removed");
                    }}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </Td>
            </tr>
          ))}
        </DataTable>
      </Panel>

      {editing && (
        <ActivityEditor
          key={editing.id}
          activity={editing}
          campaigns={campaigns.map((c) => ({ id: c.id, name: c.name }))}
          onClose={() => setEditing(null)}
          onSave={(a) => {
            actions.saveActivity(a);
            actions.log("Updated activity", a.title);
            setEditing(null);
            toast.success("Activity updated");
          }}
        />
      )}
    </>
  );
}

function ActivityEditor({
  activity,
  campaigns,
  onClose,
  onSave,
}: {
  activity: Activity;
  campaigns: { id: string; name: string }[];
  onClose: () => void;
  onSave: (a: Activity) => void;
}) {
  const [draft, setDraft] = useState<Activity>(activity);
  const set = <K extends keyof Activity>(k: K, v: Activity[K]) => setDraft((d) => ({ ...d, [k]: v }));

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xl rounded-3xl">
        <DialogHeader>
          <DialogTitle>Edit activity</DialogTitle>
          <DialogDescription>Change the activity type, what it pays and its completion target.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-ink">
            Title
            <Input value={draft.title} onChange={(e) => set("title", e.target.value)} className="mt-1 rounded-xl" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-ink">
              Activity type
              <select
                value={draft.type}
                onChange={(e) => set("type", e.target.value as Activity["type"])}
                className="mt-1 h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
              >
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
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
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block text-sm font-semibold text-ink">
              Points
              <Input type="number" value={draft.points} onChange={(e) => set("points", Number(e.target.value))} className="mt-1 rounded-xl" />
            </label>
            <label className="block text-sm font-semibold text-ink">
              Target
              <Input type="number" value={draft.target} onChange={(e) => set("target", Number(e.target.value))} className="mt-1 rounded-xl" />
            </label>
            <label className="block text-sm font-semibold text-ink">
              Status
              <select
                value={draft.status}
                onChange={(e) => set("status", e.target.value as Activity["status"])}
                className="mt-1 h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
              >
                <option value="active">active</option>
                <option value="paused">paused</option>
              </select>
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSave(draft)}>Save activity</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
