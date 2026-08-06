import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Radio, Plus, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdmin } from "@/lib/admin-store";
import type { Stream } from "@/data/console";
import { DataTable, PageHeader, Panel, Pill, StatCard, Td, nf, shortDate } from "@/components/admin/ConsoleUI";

export const Route = createFileRoute("/admin/streams")({
  head: () => ({
    meta: [
      { title: "Streams — listening parties, premieres & readings | SPARKFAN" },
      {
        name: "description",
        content:
          "Schedule and run live fan sessions: listening parties, premieres, readings and interviews with viewer counts, peak concurrency and go-live controls.",
      },
      { property: "og:title", content: "Streams — SPARKFAN console" },
      { property: "og:description", content: "Schedule listening parties and premieres, then go live in one click." },
    ],
  }),
  component: Streams,
});

const KINDS: Stream["kind"][] = ["Listening party", "Premiere", "Reading", "Interview", "Behind the scenes"];

function Streams() {
  const { streams, campaigns, tenant, actions } = useAdmin();
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState<Stream["kind"]>("Listening party");
  const [when, setWhen] = useState(new Date().toISOString().slice(0, 16));

  const viewers = streams.reduce((s, x) => s + x.viewers, 0);
  const minutes = streams.reduce((s, x) => s + x.minutes, 0);

  const add = () => {
    if (!title.trim()) {
      toast.error("Name the session");
      return;
    }
    actions.saveStream({
      id: `st-${Math.random().toString(36).slice(2, 8)}`,
      tenantId: tenant.id,
      campaignId: campaigns[0]?.id ?? "",
      title,
      kind,
      host: tenant.members[0]?.name ?? "Host",
      scheduledAt: new Date(when).toISOString(),
      minutes: 0,
      viewers: 0,
      peak: 0,
      status: "scheduled",
    });
    actions.log("Scheduled stream", title);
    toast.success("Session scheduled");
    setTitle("");
  };

  return (
    <>
      <PageHeader title="Streams" subtitle="Live sessions that pull fans in and pay out watch-time points." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Sessions" value={nf(streams.length)} icon={<Radio className="size-4" />} />
        <StatCard label="Total viewers" value={nf(viewers)} tone="success" icon={<Users className="size-4" />} />
        <StatCard label="Minutes streamed" value={nf(minutes)} tone="purple" />
        <StatCard label="Peak concurrent" value={nf(Math.max(0, ...streams.map((s) => s.peak)))} tone="gold" />
      </div>

      <Panel title="Schedule a session">
        <div className="flex flex-wrap items-end gap-3">
          <Input className="max-w-xs" placeholder="Session title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value as Stream["kind"])}
            className="rounded-xl border border-border bg-white px-3 py-2 text-sm"
          >
            {KINDS.map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
          <Input type="datetime-local" className="w-56" value={when} onChange={(e) => setWhen(e.target.value)} />
          <Button onClick={add}>
            <Plus className="size-4" /> Schedule
          </Button>
        </div>
      </Panel>

      <Panel title="All sessions">
        <DataTable head={["Session", "Type", "Host", "When", "Viewers", "Peak", "Status", ""]}>
          {streams.map((s) => (
            <tr key={s.id}>
              <Td className="font-semibold text-ink">{s.title}</Td>
              <Td>{s.kind}</Td>
              <Td>{s.host}</Td>
              <Td>{shortDate(s.scheduledAt)}</Td>
              <Td>{nf(s.viewers)}</Td>
              <Td>{nf(s.peak)}</Td>
              <Td>
                <Pill tone={s.status}>{s.status}</Pill>
              </Td>
              <Td>
                <div className="flex gap-2">
                  {s.status !== "live" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        actions.setStreamStatus(s.id, "live");
                        actions.log("Went live", s.title);
                      }}
                    >
                      Go live
                    </Button>
                  )}
                  {s.status === "live" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        actions.setStreamStatus(s.id, "ended");
                        actions.log("Ended stream", s.title);
                      }}
                    >
                      End
                    </Button>
                  )}
                </div>
              </Td>
            </tr>
          ))}
        </DataTable>
      </Panel>
    </>
  );
}
