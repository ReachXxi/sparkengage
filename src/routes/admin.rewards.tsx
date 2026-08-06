import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Gift, Plus, Sparkles, Trash2, Pencil, Power, Ticket } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/lib/admin-store";
import { draftRewards } from "@/lib/ai-drafts";
import { rewardCategories, type Reward } from "@/data/console";
import { Bar, DataTable, PageHeader, Panel, Pill, StatCard, Td, exportCsv, nf } from "@/components/admin/ConsoleUI";

export const Route = createFileRoute("/admin/rewards")({
  head: () => ({
    meta: [
      { title: "Rewards catalogue — points, stock & redemptions | SPARKFAN" },
      {
        name: "description",
        content:
          "Build the reward catalogue fans spend points on: digital merch, exclusive content, discount codes and experiences with live stock and redemption tracking.",
      },
      { property: "og:title", content: "Rewards catalogue — SPARKFAN console" },
      { property: "og:description", content: "Create rewards, set point costs and track redemptions in real time." },
    ],
  }),
  component: Rewards,
});

function emptyReward(tenantId: string, campaignId: string): Reward {
  return {
    id: `rw-${Math.random().toString(36).slice(2, 8)}`,
    tenantId,
    campaignId,
    title: "",
    description: "",
    category: rewardCategories[0],
    image: "https://picsum.photos/seed/new-reward/480/320",
    cost: 500,
    quantity: 100,
    redeemed: 0,
    status: "active",
  };
}

function Rewards() {
  const { rewards, campaigns, tenant, actions } = useAdmin();
  const [editing, setEditing] = useState<Reward | null>(null);
  const [filter, setFilter] = useState("all");

  const shown = useMemo(
    () => (filter === "all" ? rewards : rewards.filter((r) => r.campaignId === filter)),
    [rewards, filter],
  );

  const totals = useMemo(() => {
    const redeemed = rewards.reduce((s, r) => s + r.redeemed, 0);
    const stock = rewards.reduce((s, r) => s + r.quantity, 0);
    const pointsBurned = rewards.reduce((s, r) => s + r.redeemed * r.cost, 0);
    return { redeemed, stock, pointsBurned, active: rewards.filter((r) => r.status === "active").length };
  }, [rewards]);

  const save = () => {
    if (!editing) return;
    if (!editing.title.trim()) {
      toast.error("Give the reward a title");
      return;
    }
    actions.saveReward(editing);
    actions.log("Saved reward", editing.title);
    toast.success(`Saved “${editing.title}”`);
    setEditing(null);
  };

  const aiFill = () => {
    const campaign = campaigns.find((c) => c.id === (filter === "all" ? campaigns[0]?.id : filter));
    if (!campaign) {
      toast.error("Create a campaign first");
      return;
    }
    const drafted = draftRewards(campaign);
    drafted.forEach((r) => actions.saveReward(r));
    actions.log("AI drafted rewards", `${drafted.length} tiers · ${campaign.name}`);
    toast.success(`Drafted ${drafted.length} reward tiers`);
  };

  return (
    <>
      <PageHeader
        title="Rewards"
        subtitle={`What fans of ${tenant.name} can unlock with the points they earn.`}
        actions={
          <>
            <Button variant="outline" onClick={aiFill}>
              <Sparkles className="size-4" /> AI draft tiers
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                exportCsv(
                  "rewards.csv",
                  [
                    ["Reward", "Category", "Cost", "Stock", "Redeemed", "Status"],
                    ...rewards.map((r) => [r.title, r.category, r.cost, r.quantity, r.redeemed, r.status]),
                  ],
                )
              }
            >
              Export CSV
            </Button>
            <Button onClick={() => setEditing(emptyReward(tenant.id, campaigns[0]?.id ?? ""))}>
              <Plus className="size-4" /> New reward
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active rewards" value={nf(totals.active)} icon={<Gift className="size-4" />} />
        <StatCard label="Total redemptions" value={nf(totals.redeemed)} tone="success" icon={<Ticket className="size-4" />} />
        <StatCard label="Stock available" value={nf(totals.stock - totals.redeemed)} tone="purple" />
        <StatCard label="Points burned" value={nf(totals.pointsBurned)} tone="gold" />
      </div>

      <Panel
        title="Catalogue"
        hint={`${shown.length} rewards`}
        actions={
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-xl border border-border bg-white px-3 py-2 text-sm font-semibold text-ink-2"
          >
            <option value="all">All campaigns</option>
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        }
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {shown.map((r) => {
            const pct = r.quantity ? (r.redeemed / r.quantity) * 100 : 0;
            return (
              <article key={r.id} className="overflow-hidden rounded-2xl border border-border bg-white">
                <img src={r.image} alt={r.title} loading="lazy" className="h-32 w-full object-cover" />
                <div className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-bold text-ink">{r.title}</h3>
                      <p className="text-[11px] text-ink-3">{r.category}</p>
                    </div>
                    <Pill tone={r.status}>{r.status}</Pill>
                  </div>
                  <p className="line-clamp-2 text-xs text-ink-2">{r.description}</p>
                  <div className="flex items-center justify-between text-xs font-bold text-ink">
                    <span className="text-brand">{nf(r.cost)} pts</span>
                    <span className="text-ink-3">
                      {nf(r.redeemed)}/{nf(r.quantity)} claimed
                    </span>
                  </div>
                  <Bar value={pct} tone={pct > 85 ? "gold" : "brand"} />
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Button size="sm" variant="outline" onClick={() => setEditing(r)}>
                      <Pencil className="size-3.5" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        actions.toggleReward(r.id);
                        actions.log("Toggled reward", r.title);
                      }}
                    >
                      <Power className="size-3.5" /> {r.status === "active" ? "Pause" : "Activate"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        actions.redeemReward(r.id);
                        actions.log("Manual redemption", r.title);
                        toast.success("Redemption recorded");
                      }}
                    >
                      Redeem
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        actions.deleteReward(r.id);
                        actions.log("Deleted reward", r.title, "warning");
                      }}
                    >
                      <Trash2 className="size-3.5 text-bad" />
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Panel>

      <Panel title="Redemption ledger" hint="Highest-demand rewards first">
        <DataTable head={["Reward", "Campaign", "Cost", "Redeemed", "Fill rate", "Status"]}>
          {[...rewards]
            .sort((a, b) => b.redeemed - a.redeemed)
            .map((r) => (
              <tr key={r.id}>
                <Td className="font-semibold text-ink">{r.title}</Td>
                <Td>{campaigns.find((c) => c.id === r.campaignId)?.name ?? "—"}</Td>
                <Td>{nf(r.cost)}</Td>
                <Td>{nf(r.redeemed)}</Td>
                <Td className="w-40">
                  <Bar value={r.quantity ? (r.redeemed / r.quantity) * 100 : 0} />
                </Td>
                <Td>
                  <Pill tone={r.status}>{r.status}</Pill>
                </Td>
              </tr>
            ))}
        </DataTable>
      </Panel>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing?.title ? "Edit reward" : "New reward"}</DialogTitle>
            <DialogDescription>Rewards are what fans spend their campaign points on.</DialogDescription>
          </DialogHeader>
          {editing && (
            <div className="space-y-3">
              <Input
                placeholder="Reward title"
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              />
              <Textarea
                placeholder="What the fan gets"
                value={editing.description}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  className="rounded-xl border border-border bg-white px-3 py-2 text-sm"
                >
                  {rewardCategories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <select
                  value={editing.campaignId}
                  onChange={(e) => setEditing({ ...editing, campaignId: e.target.value })}
                  className="rounded-xl border border-border bg-white px-3 py-2 text-sm"
                >
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <label className="text-xs font-semibold text-ink-3">
                  Point cost
                  <Input
                    type="number"
                    value={editing.cost}
                    onChange={(e) => setEditing({ ...editing, cost: Number(e.target.value) })}
                  />
                </label>
                <label className="text-xs font-semibold text-ink-3">
                  Quantity
                  <Input
                    type="number"
                    value={editing.quantity}
                    onChange={(e) => setEditing({ ...editing, quantity: Number(e.target.value) })}
                  />
                </label>
              </div>
              <Input
                placeholder="Image URL"
                value={editing.image}
                onChange={(e) => setEditing({ ...editing, image: e.target.value })}
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button onClick={save}>Save reward</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
