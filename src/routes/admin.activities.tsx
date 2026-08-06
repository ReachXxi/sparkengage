import { createFileRoute } from "@tanstack/react-router";
import { ListChecks, Pause, Play, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdmin } from "@/lib/admin-store";
import type { Activity } from "@/data/console";
import { Bar, DataTable, PageHeader, Panel, Pill, StatCard, Td, nf } from "@/components/admin/ConsoleUI";

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
              </Td>
            </tr>
          ))}
        </DataTable>
      </Panel>
    </>
  );
}
