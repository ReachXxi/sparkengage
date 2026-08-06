import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ScrollText, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdmin } from "@/lib/admin-store";
import { DataTable, PageHeader, Panel, Pill, StatCard, Td, exportCsv, nf, shortDate } from "@/components/admin/ConsoleUI";

export const Route = createFileRoute("/admin/logs")({
  head: () => ({
    meta: [
      { title: "System logs — full console audit trail | SPARKFAN" },
      {
        name: "description",
        content:
          "Every console action in one audit trail: who changed what, when, and at what severity — filterable and exportable for compliance reviews.",
      },
      { property: "og:title", content: "System logs — SPARKFAN console" },
      { property: "og:description", content: "A filterable audit trail of every console action." },
    ],
  }),
  component: Logs,
});

const LEVELS = ["all", "info", "warning", "critical"] as const;

function Logs() {
  const { logs, tenant } = useAdmin();
  const [level, setLevel] = useState<(typeof LEVELS)[number]>("all");
  const [q, setQ] = useState("");

  const rows = useMemo(
    () =>
      logs.filter(
        (l) =>
          (level === "all" || l.severity === level) &&
          `${l.actor} ${l.action} ${l.target}`.toLowerCase().includes(q.toLowerCase()),
      ),
    [logs, level, q],
  );

  return (
    <>
      <PageHeader
        title="System logs"
        subtitle={`Audit trail for ${tenant.name}. Every create, edit, approval and point adjustment is recorded.`}
        actions={
          <Button
            variant="outline"
            onClick={() =>
              exportCsv("audit-logs.csv", [
                ["When", "Actor", "Action", "Target", "Severity"],
                ...logs.map((l) => [l.at, l.actor, l.action, l.target, l.severity]),
              ])
            }
          >
            Export CSV
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Entries" value={nf(logs.length)} icon={<ScrollText className="size-4" />} />
        <StatCard label="Warnings" value={nf(logs.filter((l) => l.severity === "warning").length)} tone="gold" />
        <StatCard label="Critical" value={nf(logs.filter((l) => l.severity === "critical").length)} tone="purple" icon={<ShieldAlert className="size-4" />} />
        <StatCard label="Actors" value={nf(new Set(logs.map((l) => l.actor)).size)} tone="success" />
      </div>

      <Panel
        title="Activity trail"
        hint={`${rows.length} entries`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Input className="w-56" placeholder="Search actor, action, target" value={q} onChange={(e) => setQ(e.target.value)} />
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as (typeof LEVELS)[number])}
              className="rounded-xl border border-border bg-white px-3 py-2 text-sm font-semibold text-ink-2"
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l === "all" ? "All severities" : l}
                </option>
              ))}
            </select>
          </div>
        }
      >
        <DataTable head={["When", "Actor", "Action", "Target", "Severity"]}>
          {rows.map((l) => (
            <tr key={l.id}>
              <Td>{shortDate(l.at)}</Td>
              <Td className="font-semibold text-ink">{l.actor}</Td>
              <Td>{l.action}</Td>
              <Td>{l.target}</Td>
              <Td>
                <Pill tone={l.severity}>{l.severity}</Pill>
              </Td>
            </tr>
          ))}
        </DataTable>
      </Panel>
    </>
  );
}
