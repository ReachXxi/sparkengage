import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Plus, Sparkles, Trash2, Wand2, Pencil, Upload, Play, Pause } from "lucide-react";
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
import { draftCampaign, draftCampaignCopy, draftRewards, draftSurveyQuestions } from "@/lib/ai-drafts";
import { moduleOptions, targetingOptions, type Campaign, type CampaignStatus } from "@/data/console";
import { DataTable, PageHeader, Panel, Pill, Td, nf } from "@/components/admin/ConsoleUI";
import { cn } from "@/lib/utils";
import { askCampaignBuilder, getBuilderHistory } from "@/lib/campaign-builder.functions";
import { useServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/admin/campaigns")({
  head: () => ({
    meta: [
      { title: "Campaign management — create & run fan campaigns | SPARKFAN" },
      {
        name: "description",
        content:
          "Create multi-tenant fan campaigns: cover art, dates, module mix, a points rules engine, audience targeting and AI-drafted copy, rewards and survey questions.",
      },
      { property: "og:title", content: "Campaign management — SPARKFAN console" },
      { property: "og:description", content: "Create and run album, movie and book campaigns with a full rules engine." },
    ],
  }),
  component: Campaigns,
});

const STATUSES: CampaignStatus[] = ["draft", "scheduled", "live", "ended"];

function emptyCampaign(tenantId: string): Campaign {
  const today = new Date().toISOString().slice(0, 10);
  return {
    id: `c-${Math.random().toString(36).slice(2, 8)}`,
    tenantId,
    name: "",
    kind: "album",
    status: "draft",
    description: "",
    cover: "https://picsum.photos/seed/new-campaign/960/540",
    startsAt: today,
    endsAt: today,
    creator: "",
    genre: "",
    rating: 0,
    headline: "",
    facts: [],
    themes: [],
    modules: ["Quiz", "Social Tasks", "Survey"],
    rules: [{ id: "r1", label: "Correct quiz answer", value: 15, cap: 30 }],
    targeting: ["Nigeria"],
    prize: "",
    participants: 0,
    actions: 0,
    pointsIssued: 0,
    verification: 0,
  };
}

function Campaigns() {
  const { tenant, tenants, campaigns, actions, rewards, surveys } = useAdmin();
  const [editing, setEditing] = useState<Campaign | null>(null);
  const [prompt, setPrompt] = useState(
    "Launching BNXN's deluxe edition next weekend — I want streams, a 30-question quiz and celebrity guessing.",
  );
  const [filter, setFilter] = useState<"all" | CampaignStatus>("all");
  const askBuilder = useServerFn(askCampaignBuilder);
  const loadBuilderHistory = useServerFn(getBuilderHistory);
  const [builderMessage, setBuilderMessage] = useState("");
  const [builderReply, setBuilderReply] = useState("");
  const [builderBusy, setBuilderBusy] = useState(false);
  useEffect(() => { void loadBuilderHistory().then((history) => setBuilderReply(history.at(-1)?.role === "assistant" ? history.at(-1)?.content ?? "" : "")); }, [loadBuilderHistory]);

  const visible = useMemo(
    () => (filter === "all" ? campaigns : campaigns.filter((c) => c.status === filter)),
    [campaigns, filter],
  );

  const generate = () => {
    const draft = draftCampaign(prompt, tenant.id);
    draft.prize = draft.prize;
    setEditing(draft);
    toast.success("Draft campaign generated — review the rules and publish.");
  };

  const save = (c: Campaign) => {
    if (!c.name.trim()) {
      toast.error("Give the campaign a name first.");
      return;
    }
    actions.saveCampaign(c);
    actions.log(campaigns.some((x) => x.id === c.id) ? "Updated campaign" : "Created campaign", c.name);
    setEditing(null);
    toast.success(`${c.name} saved.`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Campaigns"
        subtitle={`${campaigns.length} campaigns for ${tenant.name}. Every campaign carries its own modules, points rules, rewards and audience targeting.`}
        actions={
          <Button
            className="rounded-full bg-brand-gradient font-bold text-white shadow-console hover:opacity-95"
            onClick={() => setEditing(emptyCampaign(tenant.id))}
          >
            <Plus className="mr-1 size-4" /> New campaign
          </Button>
        }
      />

      <Panel
        title="AI campaign assistant"
        hint="Describe the drop in one line — modules, points, targeting and copy get drafted for you."
        className="border-brand/20 bg-brand/[0.04]"
      >
        <div className="mb-4 rounded-2xl border border-brand/15 bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-highlight">One ongoing conversation</p>
          <p className="mt-1 text-sm text-ink-2">Ask for setup guidance, revisions, validation, entry rules, P2P games or rewards. The assistant only proposes changes; it never publishes without your review.</p>
          {builderReply && <div className="mt-3 whitespace-pre-wrap rounded-xl bg-brand/5 p-3 text-sm text-ink-2">{builderReply}</div>}
          <div className="mt-3 flex gap-2">
            <Input value={builderMessage} onChange={(event) => setBuilderMessage(event.target.value)} placeholder="e.g. Make this a 50-Coin P2P quiz with 7 days and 100 winners" />
            <Button disabled={builderBusy || !builderMessage.trim()} className="shrink-0 rounded-full bg-brand-gradient font-bold text-white" onClick={async () => { setBuilderBusy(true); try { const result = await askBuilder({ data: { message: builderMessage } }); setBuilderReply(result.reply); setBuilderMessage(""); toast.success("Assistant updated the campaign proposal."); } catch (error) { toast.error(error instanceof Error ? error.message : "Assistant unavailable"); } finally { setBuilderBusy(false); } }}>{builderBusy ? "Thinking…" : "Ask assistant"}</Button>
          </div>
        </div>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={2}
          className="rounded-2xl border-brand/20 bg-white"
          placeholder="e.g. Book launch for a YA fantasy in September, reading check-ins and Goodreads reviews."
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <Button className="rounded-full bg-brand-gradient font-bold text-white" onClick={generate}>
            <Wand2 className="mr-1 size-4" /> Generate campaign
          </Button>
          <Button
            variant="outline"
            className="rounded-full font-bold"
            onClick={() => {
              const target = campaigns[0];
              if (!target) { toast.error("Create a campaign first."); return; }
              draftRewards(target).forEach((r) => actions.saveReward(r));
              actions.log("AI generated rewards", `${target.name} · 5 rewards`);
              toast.success("5 rewards drafted for " + target.name);
            }}
          >
            <Sparkles className="mr-1 size-4" /> Draft rewards
          </Button>
          <Button
            variant="outline"
            className="rounded-full font-bold"
            onClick={() => {
              const target = campaigns[0];
              if (!target) { toast.error("Create a campaign first."); return; }
              const sv = surveys.find((s) => s.campaignId === target.id);
              const questions = draftSurveyQuestions(target);
              if (sv) {
                questions.forEach((q) => actions.saveQuestion(sv.id, q));
                toast.success(`4 questions added to “${sv.title}”`);
              } else {
                actions.saveSurvey({
                  id: `sv-${Math.random().toString(36).slice(2, 7)}`,
                  tenantId: tenant.id,
                  campaignId: target.id,
                  title: `${target.name} survey`,
                  description: "AI-drafted survey with image, number and text questions.",
                  status: "open",
                  questions,
                });
                toast.success("Survey drafted with 4 questions");
              }
              actions.log("AI generated survey questions", target.name);
            }}
          >
            <Sparkles className="mr-1 size-4" /> Draft survey questions
          </Button>
        </div>
      </Panel>

      <div className="flex flex-wrap gap-2">
        {(["all", ...STATUSES] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={cn(
              "rounded-full border px-4 py-2 text-xs font-bold capitalize transition",
              filter === s ? "border-transparent bg-brand-gradient text-white" : "border-border bg-white text-ink-2",
            )}
          >
            {s} ({s === "all" ? campaigns.length : campaigns.filter((c) => c.status === s).length})
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {visible.map((c) => {
          const cRewards = rewards.filter((r) => r.campaignId === c.id);
          return (
            <article key={c.id} className="console-card overflow-hidden">
              <div className="relative h-40">
                <img src={c.cover} alt={`${c.name} cover`} loading="lazy" className="size-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
                <div className="absolute inset-x-4 bottom-3 flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-white/80">{c.kind}</p>
                    <h3 className="truncate text-base font-bold text-white">{c.name}</h3>
                  </div>
                  <Pill>{c.status}</Pill>
                </div>
              </div>
              <div className="space-y-4 p-5">
                <p className="line-clamp-2 text-sm text-ink-2">{c.description}</p>
                <div className="grid grid-cols-4 gap-2 text-center">
                  {[
                    { l: "Fans", v: nf(c.participants) },
                    { l: "Actions", v: nf(c.actions) },
                    { l: "Points", v: nf(c.pointsIssued) },
                    { l: "Rewards", v: String(cRewards.length) },
                  ].map((s) => (
                    <div key={s.l} className="rounded-xl bg-brand/6 px-2 py-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-ink-3">{s.l}</p>
                      <p className="text-sm font-bold text-ink">{s.v}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {c.modules.map((m) => (
                    <span key={m} className="rounded-full bg-brand-purple/10 px-2.5 py-1 text-[11px] font-semibold text-brand-purple">
                      {m}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" className="rounded-full font-bold" onClick={() => setEditing(c)}>
                    <Pencil className="mr-1 size-3.5" /> Edit
                  </Button>
                  {c.status === "live" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full font-bold"
                      onClick={() => {
                        actions.setCampaignStatus(c.id, "ended");
                        actions.log("Ended campaign", c.name, "warning");
                        toast.success(`${c.name} ended.`);
                      }}
                    >
                      <Pause className="mr-1 size-3.5" /> End
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="rounded-full bg-brand-gradient font-bold text-white"
                      onClick={() => {
                        actions.setCampaignStatus(c.id, "live");
                        actions.log("Published campaign", c.name);
                        toast.success(`${c.name} is live 🎉`);
                      }}
                    >
                      <Play className="mr-1 size-3.5" /> Publish
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" asChild className="rounded-full font-bold text-ink-2">
                    <Link to="/admin/leaderboard">Leaderboard</Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="ml-auto rounded-full text-bad hover:bg-bad/10"
                    onClick={() => {
                      actions.deleteCampaign(c.id);
                      actions.log("Deleted campaign", c.name, "critical");
                      toast.success("Campaign deleted");
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

      <Panel title="Points rules across campaigns" hint="The rules engine that converts fan actions into points">
        <DataTable head={["Campaign", "Rule", "Points", "Daily cap", "Max per fan"]}>
          {campaigns.flatMap((c) =>
            c.rules.map((r) => (
              <tr key={`${c.id}-${r.id}`}>
                <Td className="font-semibold text-ink">{c.name}</Td>
                <Td>{r.label}</Td>
                <Td className="font-bold text-brand">{r.value}</Td>
                <Td>{r.cap}</Td>
                <Td>{nf(r.value * r.cap)}</Td>
              </tr>
            )),
          )}
        </DataTable>
      </Panel>

      {editing && (
        <CampaignEditor
          key={editing.id}
          campaign={editing}
          tenants={tenants.map((t) => ({ id: t.id, name: t.name }))}
          onClose={() => setEditing(null)}
          onSave={save}
        />
      )}
    </div>
  );
}

function CampaignEditor({
  campaign,
  tenants,
  onClose,
  onSave,
}: {
  campaign: Campaign;
  tenants: { id: string; name: string }[];
  onClose: () => void;
  onSave: (c: Campaign) => void;
}) {
  const [draft, setDraft] = useState<Campaign>(campaign);
  const set = <K extends keyof Campaign>(k: K, v: Campaign[K]) => setDraft((d) => ({ ...d, [k]: v }));

  const toggleList = (key: "modules" | "targeting", value: string) =>
    setDraft((d) => ({
      ...d,
      [key]: d[key].includes(value) ? d[key].filter((v) => v !== value) : [...d[key], value],
    }));

  const onCover = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      set("cover", String(reader.result));
      toast.success("Cover image uploaded");
    };
    reader.readAsDataURL(file);
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto rounded-3xl">
        <DialogHeader>
          <DialogTitle>{campaign.name ? "Edit campaign" : "Create campaign"}</DialogTitle>
          <DialogDescription>
            Setup, rules engine and targeting. Everything here drives what fans see and how they earn.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-ink">
              Campaign name
              <Input value={draft.name} onChange={(e) => set("name", e.target.value)} className="mt-1 rounded-xl" placeholder='Album Launch — "The Game Needs Us"' />
            </label>
            <label className="block text-sm font-semibold text-ink">
              Tenancy
              <select
                value={draft.tenantId}
                onChange={(e) => set("tenantId", e.target.value)}
                className="mt-1 h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
              >
                {tenants.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block text-sm font-semibold text-ink">
            Description
            <Textarea value={draft.description} onChange={(e) => set("description", e.target.value)} rows={3} className="mt-1 rounded-xl" />
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block text-sm font-semibold text-ink">
              Type
              <select
                value={draft.kind}
                onChange={(e) => set("kind", e.target.value as Campaign["kind"])}
                className="mt-1 h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
              >
                <option value="album">Album</option>
                <option value="movie">Movie</option>
                <option value="book">Book</option>
              </select>
            </label>
            <label className="block text-sm font-semibold text-ink">
              Starts
              <Input type="date" value={draft.startsAt} onChange={(e) => set("startsAt", e.target.value)} className="mt-1 rounded-xl" />
            </label>
            <label className="block text-sm font-semibold text-ink">
              Ends
              <Input type="date" value={draft.endsAt} onChange={(e) => set("endsAt", e.target.value)} className="mt-1 rounded-xl" />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-ink">
              Creator / artist
              <Input value={draft.creator} onChange={(e) => set("creator", e.target.value)} className="mt-1 rounded-xl" />
            </label>
            <label className="block text-sm font-semibold text-ink">
              Genre
              <Input value={draft.genre} onChange={(e) => set("genre", e.target.value)} className="mt-1 rounded-xl" />
            </label>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink">Cover image</p>
            <div className="mt-2 flex items-center gap-3">
              <img src={draft.cover} alt="Cover preview" className="h-20 w-32 rounded-xl object-cover" />
              <label className="cursor-pointer rounded-full border border-border px-4 py-2 text-xs font-bold text-ink-2 hover:bg-brand/5">
                <Upload className="mr-1 inline size-3.5" /> Upload image
                <input type="file" accept="image/*" className="hidden" onChange={(e) => onCover(e.target.files?.[0])} />
              </label>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink">Modules</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {moduleOptions.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => toggleList("modules", m)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                    draft.modules.includes(m) ? "border-transparent bg-brand-gradient text-white" : "border-border text-ink-2",
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-ink">Rules engine</p>
              <Button
                size="sm"
                variant="outline"
                className="rounded-full text-xs font-bold"
                onClick={() =>
                  set("rules", [...draft.rules, { id: `r-${Math.random().toString(36).slice(2, 6)}`, label: "New action", value: 10, cap: 10 }])
                }
              >
                <Plus className="mr-1 size-3.5" /> Add rule
              </Button>
            </div>
            <div className="mt-2 space-y-2">
              {draft.rules.map((r, i) => (
                <div key={r.id} className="flex flex-wrap items-center gap-2 rounded-xl bg-brand/5 p-2">
                  <Input
                    value={r.label}
                    onChange={(e) => {
                      const rules = [...draft.rules];
                      rules[i] = { ...r, label: e.target.value };
                      set("rules", rules);
                    }}
                    className="h-9 min-w-40 flex-1 rounded-lg bg-white"
                  />
                  <Input
                    type="number"
                    value={r.value}
                    onChange={(e) => {
                      const rules = [...draft.rules];
                      rules[i] = { ...r, value: Number(e.target.value) };
                      set("rules", rules);
                    }}
                    className="h-9 w-24 rounded-lg bg-white"
                    aria-label="Points"
                  />
                  <Input
                    type="number"
                    value={r.cap}
                    onChange={(e) => {
                      const rules = [...draft.rules];
                      rules[i] = { ...r, cap: Number(e.target.value) };
                      set("rules", rules);
                    }}
                    className="h-9 w-24 rounded-lg bg-white"
                    aria-label="Cap"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-bad"
                    onClick={() => set("rules", draft.rules.filter((x) => x.id !== r.id))}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink">Audience targeting</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {targetingOptions.map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => toggleList("targeting", o)}
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

          <label className="block text-sm font-semibold text-ink">
            Prize structure
            <Input value={draft.prize} onChange={(e) => set("prize", e.target.value)} className="mt-1 rounded-xl" />
          </label>

          <Button
            variant="outline"
            className="rounded-full text-xs font-bold"
            onClick={() => {
              set("description", draftCampaignCopy(draft));
              toast.success("Fan-facing copy drafted");
            }}
          >
            <Sparkles className="mr-1 size-3.5" /> AI: rewrite fan copy
          </Button>
        </div>

        <DialogFooter>
          <Button variant="ghost" className="rounded-full font-bold" onClick={onClose}>
            Cancel
          </Button>
          <Button className="rounded-full bg-brand-gradient font-bold text-white" onClick={() => onSave(draft)}>
            Save campaign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
