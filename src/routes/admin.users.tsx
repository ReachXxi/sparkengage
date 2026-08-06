import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Ban, Minus, Plus, Search, UserCheck, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdmin } from "@/lib/admin-store";
import { DataTable, PageHeader, Panel, Pill, StatCard, Td, dayOnly, exportCsv, nf, shortDate } from "@/components/admin/ConsoleUI";

export const Route = createFileRoute("/admin/users")({
  head: () => ({
    meta: [
      { title: "Fan directory — segments, points & manual adjustments | SPARKFAN" },
      {
        name: "description",
        content:
          "Search the fan directory by name, city or segment, adjust point balances with an audited reason, and suspend or restore accounts.",
      },
      { property: "og:title", content: "Fan directory — SPARKFAN console" },
      { property: "og:description", content: "Search fans, adjust points and manage account status." },
    ],
  }),
  component: UsersPage,
});

const SEGMENTS = ["all", "Superfan", "Regular", "New", "Dormant"] as const;

function UsersPage() {
  const { users, adjustments, actions } = useAdmin();
  const [q, setQ] = useState("");
  const [segment, setSegment] = useState<(typeof SEGMENTS)[number]>("all");
  const [amount, setAmount] = useState(50);
  const [reason, setReason] = useState("Manual bonus — community moderation");

  const rows = useMemo(
    () =>
      users.filter((u) => {
        const matchesQ = `${u.name} ${u.email} ${u.city}`.toLowerCase().includes(q.toLowerCase());
        return matchesQ && (segment === "all" || u.segment === segment);
      }),
    [users, q, segment],
  );

  const adjust = (id: string, delta: number, name: string) => {
    actions.adjustPoints(id, delta, reason);
    toast.success(`${delta > 0 ? "Added" : "Removed"} ${Math.abs(delta)} pts · ${name}`);
  };

  return (
    <>
      <PageHeader
        title="Users"
        subtitle="The fan directory — search, adjust balances and manage account status. Every change is audited."
        actions={
          <Button
            variant="outline"
            onClick={() =>
              exportCsv("fans.csv", [
                ["Name", "Email", "City", "Segment", "Points", "Actions", "Streak", "Referrals", "Joined", "Status"],
                ...users.map((u) => [u.name, u.email, u.city, u.segment, u.points, u.actions, u.streak, u.referrals, u.joinedAt, u.status]),
              ])
            }
          >
            Export CSV
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Fans" value={nf(users.length)} icon={<Users className="size-4" />} />
        <StatCard label="Active" value={nf(users.filter((u) => u.status === "active").length)} tone="success" icon={<UserCheck className="size-4" />} />
        <StatCard label="Suspended" value={nf(users.filter((u) => u.status === "suspended").length)} tone="gold" icon={<Ban className="size-4" />} />
        <StatCard label="Average points" value={nf(Math.round(users.reduce((s, u) => s + u.points, 0) / (users.length || 1)))} tone="purple" />
      </div>

      <Panel title="Adjustment settings" hint="Applied when you use the +/- buttons in the table">
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-xs font-semibold text-ink-3">
            Amount
            <Input className="w-28" type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
          </label>
          <label className="min-w-[16rem] flex-1 text-xs font-semibold text-ink-3">
            Reason (stored in the audit log)
            <Input value={reason} onChange={(e) => setReason(e.target.value)} />
          </label>
        </div>
      </Panel>

      <Panel
        title="Fan directory"
        hint={`${rows.length} of ${users.length} fans`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-3" />
              <Input className="w-56 pl-9" placeholder="Search name, email, city" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <select
              value={segment}
              onChange={(e) => setSegment(e.target.value as (typeof SEGMENTS)[number])}
              className="rounded-xl border border-border bg-white px-3 py-2 text-sm font-semibold text-ink-2"
            >
              {SEGMENTS.map((s) => (
                <option key={s} value={s}>
                  {s === "all" ? "All segments" : s}
                </option>
              ))}
            </select>
          </div>
        }
      >
        <DataTable head={["Fan", "City", "Segment", "Points", "Actions", "Streak", "Joined", "Status", "Adjust"]}>
          {rows.map((u) => (
            <tr key={u.id}>
              <Td>
                <span className="block font-semibold text-ink">{u.name}</span>
                <span className="block text-[11px] text-ink-3">{u.email}</span>
              </Td>
              <Td>{u.city}</Td>
              <Td>
                <Pill>{u.segment}</Pill>
              </Td>
              <Td className="font-semibold text-ink">{nf(u.points)}</Td>
              <Td>{nf(u.actions)}</Td>
              <Td>{u.streak}d</Td>
              <Td>{dayOnly(u.joinedAt)}</Td>
              <Td>
                <button
                  type="button"
                  onClick={() => {
                    actions.setUserStatus(u.id, u.status === "active" ? "suspended" : "active");
                    actions.log("Changed fan status", `${u.name} → ${u.status === "active" ? "suspended" : "active"}`, "warning");
                  }}
                >
                  <Pill tone={u.status}>{u.status}</Pill>
                </button>
              </Td>
              <Td>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" aria-label={`Add points to ${u.name}`} onClick={() => adjust(u.id, amount, u.name)}>
                    <Plus className="size-3.5" />
                  </Button>
                  <Button size="sm" variant="outline" aria-label={`Remove points from ${u.name}`} onClick={() => adjust(u.id, -amount, u.name)}>
                    <Minus className="size-3.5" />
                  </Button>
                </div>
              </Td>
            </tr>
          ))}
        </DataTable>
      </Panel>

      <Panel title="Point adjustments" hint="Most recent first">
        <DataTable head={["Fan", "Delta", "Reason", "By", "When"]}>
          {adjustments.slice(0, 15).map((a) => (
            <tr key={a.id}>
              <Td className="font-semibold text-ink">{a.fan}</Td>
              <Td className={a.delta > 0 ? "font-semibold text-ok" : "font-semibold text-bad"}>
                {a.delta > 0 ? "+" : ""}
                {a.delta}
              </Td>
              <Td>{a.reason}</Td>
              <Td>{a.by}</Td>
              <Td>{shortDate(a.at)}</Td>
            </tr>
          ))}
        </DataTable>
      </Panel>
    </>
  );
}
