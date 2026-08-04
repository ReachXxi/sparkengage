import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { AdminShell, Panel, Pill } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { moduleLabels } from "@/data/admin";
import { draftFromPrompt, type CampaignDraft } from "@/lib/admin-ai";
import { useAdmin } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/campaigns/new")({
  head: () => ({
    meta: [
      { title: "Create a campaign — SPARKFAN Admin" },
      {
        name: "description",
        content:
          "Describe your drop in one line and SPARKFAN drafts the whole campaign: modules, point economy, prizes, quiz questions, rewards and a survey you can edit before publishing.",
      },
      { property: "og:title", content: "Create a campaign — SPARKFAN Admin" },
      { property: "og:description", content: "AI-drafted modules, points, prizes, quiz questions, rewards and surveys." },
    ],
  }),
  component: NewCampaign,
});

const campaignTypes = ["Album Launch", "Movie Premiere", "Event Series", "Brand Collab", "Fan Club"];

function NewCampaign() {
  const { addCampaign, addReward, addSurvey } = useAdmin();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState(
    "I'm rolling out Davido's 'ORIADÉ' deluxe in two weeks. I want streams, lyric games and TikTok shares, plus a survey to pick the deluxe headliner.",
  );
  const [working, setWorking] = useState(false);
  const [draft, setDraft] = useState<CampaignDraft | null>(null);
  const [alsoRewards, setAlsoRewards] = useState(true);
  const [alsoSurvey, setAlsoSurvey] = useState(true);

  const generate = () => {
    if (!prompt.trim()) {
      toast.error("Describe the campaign first.");
      return;
    }
    setWorking(true);
    setTimeout(() => {
      setDraft(draftFromPrompt(prompt));
      setWorking(false);
      toast.success("Draft ready — review and publish.");
    }, 700);
  };

  const patch = (p: Partial<CampaignDraft>) => setDraft((d) => (d ? { ...d, ...p } : d));

  const toggleModule = (m: string) =>
    patch({ modules: draft!.modules.includes(m) ? draft!.modules.filter((x) => x !== m) : [...draft!.modules, m] });

  const publish = (status: "live" | "draft") => {
    if (!draft) return;
    const id = addCampaign({
      name: draft.name,
      type: draft.type,
      status,
      startsAt: draft.startsAt,
      endsAt: draft.endsAt,
      modules: draft.modules,
      points: draft.points,
      prize: draft.prize,
      copy: draft.copy,
    });
    if (alsoRewards) draft.rewards.forEach((r) => addReward({ ...r, campaignId: id }));
    if (alsoSurvey)
      addSurvey({
        campaignId: id,
        title: draft.surveyTitle,
        description: "Auto-drafted with the campaign. Edit the questions any time.",
        questions: draft.surveyQuestions,
      });
    toast.success(status === "live" ? "Campaign published 🎉" : "Saved as draft");
    navigate({ to: "/admin/campaigns" });
  };

  return (
    <AdminShell
      title="Create a campaign"
      description="Start from a one-line brief. Every field stays editable before you publish."
    >
      <div className="space-y-6">
        <Panel className="bg-ink">
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <Sparkles className="size-3.5" /> Campaign assistant
          </p>
          <h2 className="mt-2 text-xl font-bold tracking-tight">Describe the drop</h2>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            className="mt-4 rounded-xl"
            placeholder="e.g. We premiere a Nollywood comedy next weekend — trivia, celebrity guessing and TikTok shares, tickets as prizes."
          />
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button onClick={generate} disabled={working} className="rounded-full font-semibold">
              <Wand2 className="mr-1 size-4" /> {working ? "Drafting…" : "Generate campaign"}
            </Button>
            <p className="text-xs text-muted-foreground">
              Modules, point economy, prizes, quiz bank, rewards and a survey — all drafted at once.
            </p>
          </div>
        </Panel>

        {draft && (
          <div className="grid gap-4 xl:grid-cols-3">
            <Panel title="Campaign details" className="xl:col-span-2">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground">Name</Label>
                  <Input value={draft.name} onChange={(e) => patch({ name: e.target.value })} className="mt-1 rounded-xl" />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground">Type</Label>
                  <Select value={draft.type} onValueChange={(v) => patch({ type: v })}>
                    <SelectTrigger className="mt-1 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {campaignTypes.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs uppercase tracking-widest text-muted-foreground">Starts</Label>
                    <Input type="date" value={draft.startsAt} onChange={(e) => patch({ startsAt: e.target.value })} className="mt-1 rounded-xl" />
                  </div>
                  <div>
                    <Label className="text-xs uppercase tracking-widest text-muted-foreground">Ends</Label>
                    <Input type="date" value={draft.endsAt} onChange={(e) => patch({ endsAt: e.target.value })} className="mt-1 rounded-xl" />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground">Modules</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {moduleLabels.map((m) => {
                      const on = draft.modules.includes(m);
                      return (
                        <button
                          key={m}
                          type="button"
                          onClick={() => toggleModule(m)}
                          className={
                            on
                              ? "rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                              : "rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted"
                          }
                        >
                          {m}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground">Point economy</Label>
                  <ul className="mt-2 space-y-2">
                    {draft.points.map((p, i) => (
                      <li key={p.label} className="flex items-center gap-2">
                        <Input
                          value={p.label}
                          onChange={(e) => {
                            const points = [...draft.points];
                            points[i] = { ...points[i]!, label: e.target.value };
                            patch({ points });
                          }}
                          className="h-9 rounded-xl"
                        />
                        <Input
                          type="number"
                          value={p.value}
                          onChange={(e) => {
                            const points = [...draft.points];
                            points[i] = { ...points[i]!, value: Number(e.target.value) };
                            patch({ points });
                          }}
                          className="h-9 w-24 rounded-xl"
                        />
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 rounded-full"
                    onClick={() => patch({ points: [...draft.points, { label: "New action", value: 10 }] })}
                  >
                    Add action
                  </Button>
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground">Prize structure</Label>
                  <Input value={draft.prize} onChange={(e) => patch({ prize: e.target.value })} className="mt-1 rounded-xl" />
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground">Fan-facing copy</Label>
                  <Textarea value={draft.copy} onChange={(e) => patch({ copy: e.target.value })} rows={3} className="mt-1 rounded-xl" />
                </div>
              </div>

              <div className="mt-5 space-y-3 border-t border-border pt-4">
                <label className="flex items-center justify-between gap-3 text-sm">
                  <span>
                    Create the {draft.rewards.length} drafted rewards
                    <span className="block text-xs text-muted-foreground">Added to the rewards catalogue as active.</span>
                  </span>
                  <Switch checked={alsoRewards} onCheckedChange={setAlsoRewards} />
                </label>
                <label className="flex items-center justify-between gap-3 text-sm">
                  <span>
                    Create the drafted survey ({draft.surveyQuestions.length} questions)
                    <span className="block text-xs text-muted-foreground">Image, number and text questions included.</span>
                  </span>
                  <Switch checked={alsoSurvey} onCheckedChange={setAlsoSurvey} />
                </label>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Button className="rounded-full font-semibold" onClick={() => publish("live")}>
                    Publish campaign
                  </Button>
                  <Button variant="outline" className="rounded-full font-semibold" onClick={() => publish("draft")}>
                    Save as draft
                  </Button>
                  <Button variant="ghost" className="rounded-full font-semibold" onClick={() => setDraft(draftFromPrompt(prompt))}>
                    Regenerate
                  </Button>
                </div>
              </div>
            </Panel>

            <div className="space-y-4">
              <Panel title="Why this shape" description="Assistant reasoning">
                <ul className="space-y-2 text-xs text-muted-foreground">
                  {draft.rationale.map((r) => (
                    <li key={r} className="flex gap-2">
                      <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
                      {r}
                    </li>
                  ))}
                </ul>
              </Panel>

              <Panel title="Quiz bank" description={`${draft.quizQuestions.length} drafted questions`}>
                <ol className="list-decimal space-y-1.5 pl-4 text-xs text-muted-foreground">
                  {draft.quizQuestions.map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ol>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full rounded-full"
                  onClick={() => toast.success("15 more questions added to the bank")}
                >
                  Generate 15 more
                </Button>
              </Panel>

              <Panel title="Drafted rewards">
                <ul className="space-y-2 text-xs">
                  {draft.rewards.map((r) => (
                    <li key={r.title} className="flex items-center gap-2 rounded-xl border border-border px-3 py-2">
                      <span>{r.emoji}</span>
                      <span className="min-w-0 flex-1 truncate font-semibold">{r.title}</span>
                      <Pill tone="muted">{r.cost} pts</Pill>
                    </li>
                  ))}
                </ul>
              </Panel>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
