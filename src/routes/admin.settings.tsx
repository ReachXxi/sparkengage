import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AdminShell, Metric, Panel, Pill } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdmin } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [
      { title: "Workspace settings — SPARKFAN Admin" },
      {
        name: "description",
        content:
          "Manage the active workspace: name, plan, industry, team roles and create additional tenants for other artists, labels or brands.",
      },
      { property: "og:title", content: "Workspace settings — SPARKFAN Admin" },
      { property: "og:description", content: "Multi-tenant workspaces, plans and team roles." },
    ],
  }),
  component: Settings,
});

function Settings() {
  const { tenant, tenants, campaigns, engagers, addTenant, setTenant } = useAdmin();
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("Music");

  return (
    <AdminShell title="Workspace" description="Multi-tenant control — one login, many artists and brands.">
      <div className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Workspace" value={tenant.name} hint={tenant.slug} />
          <Metric label="Plan" value={tenant.plan} />
          <Metric label="Campaigns" value={String(campaigns.length)} />
          <Metric label="Fans tracked" value={engagers.length.toLocaleString()} />
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <Panel title="Team" description={`${tenant.members.length} members`}>
            <ul className="divide-y divide-border">
              {tenant.members.map((m) => (
                <li key={m.id} className="flex items-center gap-3 py-2.5">
                  <span className="grid size-9 place-items-center rounded-xl bg-muted text-xs font-semibold">
                    {m.name.slice(0, 2).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{m.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{m.email}</p>
                  </div>
                  <Pill tone={m.role === "Owner" ? "solid" : "muted"}>{m.role}</Pill>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Workspaces" description="Switch or create a new tenant">
            <ul className="space-y-2">
              {tenants.map((t) => (
                <li key={t.id} className="flex items-center gap-3 rounded-2xl border border-border px-3 py-2.5">
                  <span className="text-lg">{t.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.industry} · {t.plan}
                    </p>
                  </div>
                  {t.id === tenant.id ? (
                    <Pill tone="solid">Active</Pill>
                  ) : (
                    <Button size="sm" variant="outline" className="rounded-full" onClick={() => setTenant(t.id)}>
                      Switch
                    </Button>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-4 space-y-3 border-t border-border pt-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground">Workspace name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Wizkid HQ" className="mt-1 rounded-xl" />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground">Industry</Label>
                  <Input value={industry} onChange={(e) => setIndustry(e.target.value)} className="mt-1 rounded-xl" />
                </div>
              </div>
              <Button
                className="w-full rounded-full font-semibold"
                onClick={() => {
                  if (!name.trim()) {
                    toast.error("Name the workspace first.");
                    return;
                  }
                  addTenant(name, industry);
                  setName("");
                  toast.success("Workspace created and activated");
                }}
              >
                Create workspace
              </Button>
            </div>
          </Panel>
        </div>
      </div>
    </AdminShell>
  );
}
