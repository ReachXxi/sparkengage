import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Eye, MousePointerClick, Pause, Play, Plus, Star, Trash2, Upload, Wand2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAdmin } from "@/lib/admin-store";
import { adPlacements, targetingOptions, type Ad } from "@/data/console";
import { Bar, DataTable, PageHeader, Panel, Pill, StatCard, Td, nf } from "@/components/admin/ConsoleUI";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/ads")({
  head: () => ({
    meta: [
      { title: "Ads manager — banners, flight dates & targeting | SPARKFAN" },
      {
        name: "description",
        content:
          "Create sponsored banners for the SPARKFAN fan app: upload creative, set flight duration, choose placement, target audiences and read impressions, clicks and CTR.",
      },
      { property: "og:title", content: "Ads manager — SPARKFAN console" },
      { property: "og:description", content: "Banner upload, flight duration, placement and audience targeting." },
    ],
  }),
  component: AdsPage,
});

const STATUSES: Ad["status"][] = ["active", "scheduled", "paused", "ended"];

function daysBetween(a: string, b: string) {
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Math.max(1, Math.round(ms / 86_400_000));
}

function emptyAd(tenantId: string, campaignId: string): Ad {
  const today = new Date().toISOString().slice(0, 10);
  const end = new Date(Date.now() + 14 * 86_400_000).toISOString().slice(0, 10);
  return {
    id: `ad-${Math.random().toString(36).slice(2, 8)}`,
    tenantId,
    campaignId,
    name: "",
    advertiser: "",
    headline: "",
    body: "",
    cta: "Learn more",
    ctaUrl: "https://",
    banner: "https://picsum.photos/seed/new-ad-banner/1200/500",
    placement: "Landing feed",
    startsAt: today,
    endsAt: end,
    duration: 14,
    targeting: ["Nigeria"],
    budget: 500,
    impressions: 0,
    clicks: 0,
    status: "scheduled",
    featured: false,
  };
}

function AdsPage() {
  const { tenant, ads, campaigns, actions } = useAdmin();
  const [editing, setEditing] = useState<Ad | null>(null);

  const impressions = ads.reduce((s, a) => s + a.impressions, 0);
  const clicks = ads.reduce((s, a) => s + a.clicks, 0);
  const spend = ads.reduce((s, a) => s + a.budget, 0);

  const save = (ad: Ad) => {
    if (!ad.name.trim() || !ad.headline.trim()) {
      toast.error("Give the ad a name and a headline.");
      return;
    }
    actions.saveAd(ad);
    actions.log(ads.some((a) => a.id === ad.id) ? "Updated ad" : "Created ad", ad.name);
    setEditing(null);
    toast.success(`${ad.name} saved.`);
  };

  return (
    <>
      <PageHeader
        title="Ads"
        subtitle={`${ads.length} sponsored placements for ${tenant.name}. Upload a banner, set the flight duration, choose where it shows and who sees it.`}
        actions={
          <Button
            className="rounded-full bg-brand-gradient font-bold text-white shadow-console hover:opacity-95"
            onClick={() => setEditing(emptyAd(tenant.id, campaigns[0]?.id ?? ""))}
          >
            <Plus className="mr-1 size-4" /> New ad
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Impressions" value={nf(impressions)} icon={<Eye className="size-4" />} />
        <StatCard label="Clicks" value={nf(clicks)} tone="purple" icon={<MousePointerClick className="size-4" />} />
        <StatCard
          label="Click-through rate"
          value={`${impressions ? ((clicks / impressions) * 100).toFixed(2) : "0.00"}%`}
          tone="success"
        />
        <StatCard label="Budget committed" value={`$${nf(spend)}`} tone="gold" />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {ads.map((ad) => {
          const ctr = ad.impressions ? (ad.clicks / ad.impressions) * 100 : 0;
          const campaign = campaigns.find((c) => c.id === ad.campaignId);
          return (
            <article key={ad.id} className="console-card overflow-hidden">
              <div className="relative h-40">
                <img src={ad.banner} alt={`${ad.name} banner`} loading="lazy" className="size-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />
                <div className="absolute inset-x-4 bottom-3 flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-white/80">{ad.advertiser}</p>
                    <h3 className="truncate text-base font-bold text-white">{ad.name}</h3>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    {ad.featured && <Pill tone="premium">Featured</Pill>}
                    <Pill>{ad.status}</Pill>
                  </div>
                </div>
              </div>
              <div className="space-y-4 p-5">
                <p className="line-clamp-2 text-sm text-ink-2">{ad.headline}</p>
                <div className="grid grid-cols-4 gap-2 text-center">
                  {[
                    { l: "Placement", v: ad.placement.replace("Landing ", "") },
                    { l: "Duration", v: `${ad.duration}d` },
                    { l: "Impr.", v: nf(ad.impressions) },
                    { l: "CTR", v: `${ctr.toFixed(1)}%` },
                  ].map((s) => (
                    <div key={s.l} className="rounded-xl bg-brand/6 px-2 py-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-ink-3">{s.l}</p>
                      <p className="truncate text-sm font-bold text-ink">{s.v}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {ad.targeting.map((t) => (
                    <span key={t} className="rounded-full bg-gold/15 px-2.5 py-1 text-[11px] font-semibold text-ink-2">
                      {t}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-ink-3">
                  {ad.startsAt} → {ad.endsAt}
                  {campaign ? ` · ${campaign.name}` : ""}
                </p>
                <div>
                  <Bar value={Math.min(100, ctr * 10)} tone="success" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" className="rounded-full font-bold" onClick={() => setEditing(ad)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full font-bold"
                    onClick={() => {
                      const next = ad.status === "active" ? "paused" : "active";
                      actions.setAdStatus(ad.id, next);
                      actions.log(next === "active" ? "Resumed ad" : "Paused ad", ad.name, "warning");
                      toast.success(`${ad.name} ${next}.`);
                    }}
                  >
                    {ad.status === "active" ? <Pause className="mr-1 size-3.5" /> : <Play className="mr-1 size-3.5" />}
                    {ad.status === "active" ? "Pause" : "Run"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-full font-bold text-ink-2"
                    onClick={() => {
                      actions.featureAd(ad.id);
                      actions.log("Featured ad on landing page", ad.name);
                      toast.success(`${ad.name} is now the featured landing ad.`);
                    }}
                  >
                    <Star className="mr-1 size-3.5" /> Feature
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="ml-auto rounded-full text-bad hover:bg-bad/10"
                    onClick={() => {
                      actions.deleteAd(ad.id);
                      actions.log("Deleted ad", ad.name, "critical");
                      toast.success("Ad deleted");
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <Panel title="Delivery report" hint="Impressions, clicks and CTR per placement">
        <DataTable head={["Ad", "Advertiser", "Placement", "Flight", "Impressions", "Clicks", "CTR", "Status"]}>
          {ads.map((ad) => (
            <tr key={ad.id}>
              <Td className="font-semibold text-ink">{ad.name}</Td>
              <Td>{ad.advertiser}</Td>
              <Td>{ad.placement}</Td>
              <Td>
                {ad.duration} days
              </Td>
              <Td>{nf(ad.impressions)}</Td>
              <Td>{nf(ad.clicks)}</Td>
              <Td className="font-bold text-brand">
                {ad.impressions ? ((ad.clicks / ad.impressions) * 100).toFixed(2) : "0.00"}%
              </Td>
              <Td>
                <Pill>{ad.status}</Pill>
              </Td>
            </tr>
          ))}
        </DataTable>
      </Panel>

      {editing && (
        <AdEditor
          key={editing.id}
          ad={editing}
          campaigns={campaigns.map((c) => ({ id: c.id, name: c.name }))}
          onClose={() => setEditing(null)}
          onSave={save}
        />
      )}
    </>
  );
}

function AdEditor({
  ad,
  campaigns,
  onClose,
  onSave,
}: {
  ad: Ad;
  campaigns: { id: string; name: string }[];
  onClose: () => void;
  onSave: (ad: Ad) => void;
}) {
  const [draft, setDraft] = useState<Ad>(ad);
  const set = <K extends keyof Ad>(k: K, v: Ad[K]) => setDraft((d) => ({ ...d, [k]: v }));

  const setDuration = (days: number) => {
    const d = Math.max(1, days);
    const end = new Date(new Date(draft.startsAt).getTime() + d * 86_400_000).toISOString().slice(0, 10);
    setDraft((prev) => ({ ...prev, duration: d, endsAt: end }));
  };

  const setEnd = (endsAt: string) => setDraft((prev) => ({ ...prev, endsAt, duration: daysBetween(prev.startsAt, endsAt) }));

  const onBanner = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      set("banner", String(reader.result));
      toast.success("Banner uploaded");
    };
    reader.readAsDataURL(file);
  };

  const toggleTarget = (value: string) =>
    setDraft((d) => ({
      ...d,
      targeting: d.targeting.includes(value) ? d.targeting.filter((x) => x !== value) : [...d.targeting, value],
    }));

  const preview = useMemo(() => draft, [draft]);

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto rounded-3xl">
        <DialogHeader>
          <DialogTitle>{ad.name ? "Edit ad" : "Create ad"}</DialogTitle>
          <DialogDescription>Banner creative, flight duration, placement and audience targeting.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-ink">
              Ad name
              <Input value={draft.name} onChange={(e) => set("name", e.target.value)} className="mt-1 rounded-xl" placeholder="ORIADÉ — album takeover" />
            </label>
            <label className="block text-sm font-semibold text-ink">
              Advertiser
              <Input value={draft.advertiser} onChange={(e) => set("advertiser", e.target.value)} className="mt-1 rounded-xl" />
            </label>
          </div>

          <label className="block text-sm font-semibold text-ink">
            Headline
            <Input value={draft.headline} onChange={(e) => set("headline", e.target.value)} className="mt-1 rounded-xl" />
          </label>

          <label className="block text-sm font-semibold text-ink">
            Body copy
            <Textarea value={draft.body} onChange={(e) => set("body", e.target.value)} rows={3} className="mt-1 rounded-xl" />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-ink">
              Button label
              <Input value={draft.cta} onChange={(e) => set("cta", e.target.value)} className="mt-1 rounded-xl" />
            </label>
            <label className="block text-sm font-semibold text-ink">
              Destination link
              <Input value={draft.ctaUrl} onChange={(e) => set("ctaUrl", e.target.value)} className="mt-1 rounded-xl" placeholder="https://…" />
            </label>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink">Banner image</p>
            <div className="mt-2 flex items-center gap-3">
              <img src={preview.banner} alt="Banner preview" className="h-20 w-40 rounded-xl object-cover" />
              <div className="space-y-2">
                <label className="inline-flex cursor-pointer items-center rounded-full border border-border px-4 py-2 text-xs font-bold text-ink-2 hover:bg-brand/5">
                  <Upload className="mr-1 inline size-3.5" /> Upload banner
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => onBanner(e.target.files?.[0])} />
                </label>
                <Input
                  value={draft.banner.startsWith("data:") ? "" : draft.banner}
                  onChange={(e) => set("banner", e.target.value)}
                  placeholder="…or paste an image URL"
                  className="h-9 w-64 rounded-xl text-xs"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <label className="block text-sm font-semibold text-ink">
              Starts
              <Input type="date" value={draft.startsAt} onChange={(e) => set("startsAt", e.target.value)} className="mt-1 rounded-xl" />
            </label>
            <label className="block text-sm font-semibold text-ink">
              Ends
              <Input type="date" value={draft.endsAt} onChange={(e) => setEnd(e.target.value)} className="mt-1 rounded-xl" />
            </label>
            <label className="block text-sm font-semibold text-ink">
              Duration (days)
              <Input type="number" value={draft.duration} onChange={(e) => setDuration(Number(e.target.value))} className="mt-1 rounded-xl" />
            </label>
            <label className="block text-sm font-semibold text-ink">
              Budget ($)
              <Input type="number" value={draft.budget} onChange={(e) => set("budget", Number(e.target.value))} className="mt-1 rounded-xl" />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block text-sm font-semibold text-ink">
              Placement
              <select
                value={draft.placement}
                onChange={(e) => set("placement", e.target.value as Ad["placement"])}
                className="mt-1 h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
              >
                {adPlacements.map((p) => (
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
                <option value="">No campaign</option>
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-semibold text-ink">
              Status
              <select
                value={draft.status}
                onChange={(e) => set("status", e.target.value as Ad["status"])}
                className="mt-1 h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink">Audience targeting</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {targetingOptions.map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => toggleTarget(o)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                    draft.targeting.includes(o) ? "border-transparent bg-gold text-ink" : "border-border text-ink-2",
                  )}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            className="rounded-full text-xs font-bold"
            onClick={() => {
              set(
                "body",
                `${draft.headline || draft.name} — only on SPARKFAN. Tap in, play the games and earn points while you're there.`,
              );
              toast.success("Ad copy drafted");
            }}
          >
            <Wand2 className="mr-1 size-3.5" /> AI: draft ad copy
          </Button>

          <div className="rounded-2xl border border-border bg-brand/5 p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-ink-3">Fan-app preview</p>
            <div className="mt-2 overflow-hidden rounded-2xl bg-white shadow-console">
              <img src={preview.banner} alt="" className="h-28 w-full object-cover" />
              <div className="space-y-1 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-ink-3">Sponsored · {preview.advertiser || "Advertiser"}</p>
                <p className="text-sm font-bold text-ink">{preview.headline || "Your headline shows here"}</p>
                <p className="line-clamp-2 text-xs text-ink-2">{preview.body}</p>
                <span className="mt-1 inline-block rounded-full bg-brand-gradient px-3 py-1 text-[11px] font-bold text-white">
                  {preview.cta || "Learn more"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" className="rounded-full font-bold" onClick={onClose}>
            Cancel
          </Button>
          <Button className="rounded-full bg-brand-gradient font-bold text-white" onClick={() => onSave(draft)}>
            Save ad
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
