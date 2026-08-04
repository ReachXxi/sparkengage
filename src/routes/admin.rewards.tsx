import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { AdminShell, Metric, Panel, Pill } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { rewardCategories } from "@/data/admin";
import { useAdmin } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/rewards")({
  head: () => ({
    meta: [
      { title: "Rewards catalogue — SPARKFAN Admin" },
      {
        name: "description",
        content:
          "Create and manage the rewards fans redeem with points: exclusives, merch, tickets, experiences and airtime, with stock, cost and claim tracking.",
      },
      { property: "og:title", content: "Rewards catalogue — SPARKFAN Admin" },
      { property: "og:description", content: "Point costs, stock levels and claim rates for every reward." },
    ],
  }),
  component: Rewards,
});

const emojis = ["🎁", "🖼️", "🎵", "🎟️", "🧢", "🎚️", "📱", "🍾", "👕", "🏆"];

function Rewards() {
  const { rewards, campaigns, addReward, updateReward } = useAdmin();
  const [form, setForm] = useState({
    title: "",
    category: rewardCategories[0] as string,
    emoji: "🎁",
    cost: 500,
    stock: 100,
    campaignId: "none",
  });

  const claimed = rewards.reduce((a, r) => a + r.claimed, 0);
  const pointsBurned = rewards.reduce((a, r) => a + r.claimed * r.cost, 0);

  const submit = () => {
    if (!form.title.trim()) {
      toast.error("Give the reward a title.");
      return;
    }
    addReward({
      title: form.title,
      category: form.category,
      emoji: form.emoji,
      cost: Number(form.cost),
      stock: Number(form.stock),
      campaignId: form.campaignId === "none" ? null : form.campaignId,
    });
    setForm({ ...form, title: "" });
    toast.success("Reward added to the catalogue");
  };

  return (
    <AdminShell title="Rewards" description="The redemption side of the economy — what points are actually worth.">
      <div className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Rewards" value={String(rewards.length)} />
          <Metric label="Active" value={String(rewards.filter((r) => r.status === "active").length)} />
          <Metric label="Claims" value={claimed.toLocaleString()} />
          <Metric label="Points burned" value={pointsBurned.toLocaleString()} />
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <Panel title="Catalogue" className="xl:col-span-2">
            <ul className="space-y-3">
              {rewards.map((r) => {
                const pct = r.stock ? Math.min(100, Math.round((r.claimed / r.stock) * 100)) : 0;
                const campaign = campaigns.find((c) => c.id === r.campaignId);
                return (
                  <li key={r.id} className="rounded-2xl border border-border p-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-muted text-lg">{r.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">{r.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {r.category} · {campaign ? campaign.name : "Workspace-wide"}
                        </p>
                      </div>
                      <Pill tone={r.status === "active" ? "solid" : "default"}>{r.status}</Pill>
                      <span className="text-sm font-semibold">{r.cost.toLocaleString()} pts</span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full"
                        onClick={() => {
                          const next = r.status === "active" ? "paused" : "active";
                          updateReward(r.id, { status: next });
                          toast.success(`${r.title} ${next}`);
                        }}
                      >
                        {r.status === "active" ? "Pause" : "Activate"}
                      </Button>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <Progress value={pct} className="h-1.5" />
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {r.claimed.toLocaleString()} / {r.stock > 5000 ? "∞" : r.stock.toLocaleString()} claimed
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Panel>

          <Panel title="Create a reward" description="Appears instantly in the fan wallet">
            <div className="space-y-3">
              <div>
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Title</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Signed vinyl"
                  className="mt-1 rounded-xl"
                />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger className="mt-1 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {rewardCategories.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Campaign</Label>
                <Select value={form.campaignId} onValueChange={(v) => setForm({ ...form, campaignId: v })}>
                  <SelectTrigger className="mt-1 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Workspace-wide</SelectItem>
                    {campaigns.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground">Cost (pts)</Label>
                  <Input
                    type="number"
                    value={form.cost}
                    onChange={(e) => setForm({ ...form, cost: Number(e.target.value) })}
                    className="mt-1 rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground">Stock</Label>
                  <Input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                    className="mt-1 rounded-xl"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Icon</Label>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {emojis.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setForm({ ...form, emoji: e })}
                      className={
                        form.emoji === e
                          ? "grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground"
                          : "grid size-9 place-items-center rounded-lg border border-border hover:bg-muted"
                      }
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
              <Button className="w-full rounded-full font-semibold" onClick={submit}>
                <Plus className="mr-1 size-4" /> Add reward
              </Button>
            </div>
          </Panel>
        </div>
      </div>
    </AdminShell>
  );
}
