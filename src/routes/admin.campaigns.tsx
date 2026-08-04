import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ExternalLink, Pause, Play, Plus } from "lucide-react";
import { toast } from "sonner";
import { AdminShell, Metric, Panel, Pill } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdmin } from "@/lib/admin-store";
import type { CampaignStatus } from "@/data/admin";

export const Route = createFileRoute("/admin/campaigns")({
  head: () => ({
    meta: [
      { title: "Campaigns — SPARKFAN Admin" },
      {
        name: "description",
        content:
          "Manage every SPARKFAN campaign in the workspace: status, schedule, modules, point economy, prizes and live participation numbers.",
      },
      { property: "og:title", content: "Campaigns — SPARKFAN Admin" },
      { property: "og:description", content: "Status, schedule, modules and live participation for every campaign." },
    ],
  }),
  component: Campaigns,
});

const statuses: (CampaignStatus | "all")[] = ["all", "live", "scheduled", "draft", "ended"];

function Campaigns() {
  const { campaigns, updateCampaign } = useAdmin();
  const [filter, setFilter] = useState<CampaignStatus | "all">("all");
  const [q, setQ] = useState("");

  const rows = campaigns.filter(
    (c) => (filter === "all" || c.status === filter) && c.name.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <AdminShell
      title="Campaigns"
      description="Every campaign in this workspace, with the levers you need to pause, publish or preview."
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
          <Metric label="Total campaigns" value={String(campaigns.length)} />
          <Metric label="Live now" value={String(campaigns.filter((c) => c.status === "live").length)} />
          <Metric label="Scheduled" value={String(campaigns.filter((c) => c.status === "scheduled").length)} />
          <Metric
            label="Avg verification"
            value={`${(
              campaigns.filter((c) => c.verification > 0).reduce((a, c) => a + c.verification, 0) /
                Math.max(campaigns.filter((c) => c.verification > 0).length, 1)
            ).toFixed(1)}%`}
          />
        </div>

        <Panel>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search campaigns"
              className="h-9 max-w-xs rounded-full"
            />
            <Select value={filter} onValueChange={(v) => setFilter(v as CampaignStatus | "all")}>
              <SelectTrigger className="h-9 w-36 rounded-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s === "all" ? "All statuses" : s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-[11px] uppercase tracking-widest text-muted-foreground">
                  <th className="py-2 pr-3 font-semibold">Campaign</th>
                  <th className="py-2 pr-3 font-semibold">Window</th>
                  <th className="py-2 pr-3 font-semibold">Modules</th>
                  <th className="py-2 pr-3 text-right font-semibold">Participants</th>
                  <th className="py-2 pr-3 text-right font-semibold">Points</th>
                  <th className="py-2 pr-3 font-semibold">Status</th>
                  <th className="py-2 font-semibold" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((c) => (
                  <tr key={c.id} className="align-top">
                    <td className="py-3 pr-3">
                      <p className="font-semibold">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.type}</p>
                    </td>
                    <td className="py-3 pr-3 text-xs text-muted-foreground">
                      {c.startsAt}
                      <br />→ {c.endsAt}
                    </td>
                    <td className="py-3 pr-3">
                      <div className="flex max-w-[240px] flex-wrap gap-1">
                        {c.modules.slice(0, 4).map((m) => (
                          <Pill key={m} tone="muted">
                            {m}
                          </Pill>
                        ))}
                        {c.modules.length > 4 && <Pill tone="muted">+{c.modules.length - 4}</Pill>}
                      </div>
                    </td>
                    <td className="py-3 pr-3 text-right font-semibold">{c.participants.toLocaleString()}</td>
                    <td className="py-3 pr-3 text-right font-semibold">{c.pointsIssued.toLocaleString()}</td>
                    <td className="py-3 pr-3">
                      <Pill tone={c.status === "live" ? "solid" : "default"}>{c.status}</Pill>
                    </td>
                    <td className="py-3">
                      <div className="flex justify-end gap-1">
                        {c.status === "live" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-full"
                            onClick={() => {
                              updateCampaign(c.id, { status: "draft" });
                              toast.success(`${c.name} paused`);
                            }}
                          >
                            <Pause className="size-3.5" />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-full"
                            onClick={() => {
                              updateCampaign(c.id, { status: "live" });
                              toast.success(`${c.name} is live`);
                            }}
                          >
                            <Play className="size-3.5" />
                          </Button>
                        )}
                        {c.publicId && (
                          <Button asChild size="sm" variant="ghost" className="rounded-full">
                            <Link to="/campaign/$id" params={{ id: c.publicId }}>
                              <ExternalLink className="size-3.5" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {!rows.length && (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                      No campaigns match that filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </AdminShell>
  );
}
