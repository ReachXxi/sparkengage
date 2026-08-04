import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Hash, ImageIcon, Plus, Trash2, Type } from "lucide-react";
import { toast } from "sonner";
import { AdminShell, Metric, Panel, Pill } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { imageOptionBank, type SurveyQuestion, type SurveyQuestionKind } from "@/data/admin";
import { useAdmin } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/surveys")({
  head: () => ({
    meta: [
      { title: "Survey builder — SPARKFAN Admin" },
      {
        name: "description",
        content:
          "Build fan surveys with image, text and number questions, set points per answer, attach them to a campaign and open or close collection.",
      },
      { property: "og:title", content: "Survey builder — SPARKFAN Admin" },
      { property: "og:description", content: "Image, text and number questions with points and required flags." },
    ],
  }),
  component: Surveys,
});

const kindIcon: Record<SurveyQuestionKind, typeof Type> = { text: Type, number: Hash, image: ImageIcon };

let qid = 0;
const newQuestion = (kind: SurveyQuestionKind): SurveyQuestion => ({
  id: `nq-${++qid}`,
  kind,
  prompt: kind === "image" ? "Pick the option that fits" : kind === "number" ? "How many?" : "Tell us in one line",
  required: true,
  points: kind === "text" ? 15 : 10,
  ...(kind === "number" ? { min: 0, max: 10, unit: "" } : {}),
  ...(kind === "image" ? { options: imageOptionBank.slice(0, 3) } : {}),
});

function Surveys() {
  const { surveys, campaigns, responses, addSurvey, updateSurvey } = useAdmin();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [campaignId, setCampaignId] = useState(campaigns[0]?.id ?? "");
  const [questions, setQuestions] = useState<SurveyQuestion[]>([newQuestion("image"), newQuestion("number"), newQuestion("text")]);

  const patchQ = (id: string, patch: Partial<SurveyQuestion>) =>
    setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, ...patch } : q)));

  const toggleOption = (q: SurveyQuestion, optId: string) => {
    const current = q.options ?? [];
    const next = current.some((o) => o.id === optId)
      ? current.filter((o) => o.id !== optId)
      : [...current, imageOptionBank.find((o) => o.id === optId)!];
    patchQ(q.id, { options: next });
  };

  const save = () => {
    if (!title.trim()) {
      toast.error("Give the survey a title.");
      return;
    }
    if (!campaignId) {
      toast.error("Attach the survey to a campaign.");
      return;
    }
    if (!questions.length) {
      toast.error("Add at least one question.");
      return;
    }

    addSurvey({ title, description, campaignId, questions });
    setTitle("");
    setDescription("");
    setQuestions([newQuestion("image"), newQuestion("number"), newQuestion("text")]);
    toast.success("Survey created and open for responses");
  };

  return (
    <AdminShell
      title="Surveys"
      description="First-party data out of every drop. Image, text and number questions, each worth points."
      actions={
        <Button asChild size="sm" variant="outline" className="rounded-full">
          <Link to="/admin/responses">View responses</Link>
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Surveys" value={String(surveys.length)} />
          <Metric label="Open" value={String(surveys.filter((s) => s.status === "open").length)} />
          <Metric label="Responses" value={responses.length.toLocaleString()} />
          <Metric
            label="Questions"
            value={String(surveys.reduce((a, s) => a + s.questions.length, 0))}
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <Panel title="Live surveys">
            <ul className="space-y-3">
              {surveys.map((s) => {
                const campaign = campaigns.find((c) => c.id === s.campaignId);
                const count = responses.filter((r) => r.surveyId === s.id).length;
                return (
                  <li key={s.id} className="rounded-2xl border border-border p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="min-w-0 flex-1 truncate font-semibold">{s.title}</p>
                      <Pill tone={s.status === "open" ? "solid" : "default"}>{s.status}</Pill>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full"
                        onClick={() => {
                          const status = s.status === "open" ? "closed" : "open";
                          updateSurvey(s.id, { status });
                          toast.success(`${s.title} ${status}`);
                        }}
                      >
                        {s.status === "open" ? "Close" : "Reopen"}
                      </Button>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{s.description}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {campaign?.name ?? "Unassigned"} · {s.questions.length} questions · {count} responses
                    </p>
                    <div className="mt-3 space-y-1.5">
                      {s.questions.map((q) => {
                        const Icon = kindIcon[q.kind];
                        return (
                          <div key={q.id} className="flex items-center gap-2 text-xs">
                            <Icon className="size-3.5 shrink-0 text-muted-foreground" />
                            <span className="min-w-0 flex-1 truncate">{q.prompt}</span>
                            <Pill tone="muted">{q.points} pts</Pill>
                          </div>
                        );
                      })}
                    </div>
                  </li>
                );
              })}
              {!surveys.length && <p className="text-sm text-muted-foreground">No surveys yet in this workspace.</p>}
            </ul>
          </Panel>

          <Panel title="Build a survey" description="Mix question types — image, number, text">
            <div className="space-y-3">
              <div>
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Deluxe tracklist survey" className="mt-1 rounded-xl" />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Description</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="mt-1 rounded-xl" />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Campaign</Label>
                <Select value={campaignId} onValueChange={setCampaignId}>
                  <SelectTrigger className="mt-1 rounded-xl">
                    <SelectValue placeholder="Select a campaign" />
                  </SelectTrigger>
                  <SelectContent>
                    {campaigns.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3 border-t border-border pt-3">
                {questions.map((q, i) => {
                  const Icon = kindIcon[q.kind];
                  return (
                    <div key={q.id} className="rounded-2xl border border-border p-3">
                      <div className="flex items-center gap-2">
                        <Icon className="size-4 text-muted-foreground" />
                        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          Q{i + 1} · {q.kind}
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="ml-auto size-7"
                          onClick={() => setQuestions((qs) => qs.filter((x) => x.id !== q.id))}
                          aria-label="Remove question"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                      <Input
                        value={q.prompt}
                        onChange={(e) => patchQ(q.id, { prompt: e.target.value })}
                        className="mt-2 h-9 rounded-xl"
                      />
                      {q.kind === "number" && (
                        <div className="mt-2 grid grid-cols-3 gap-2">
                          <Input
                            type="number"
                            value={q.min ?? 0}
                            onChange={(e) => patchQ(q.id, { min: Number(e.target.value) })}
                            className="h-9 rounded-xl"
                            placeholder="Min"
                          />
                          <Input
                            type="number"
                            value={q.max ?? 10}
                            onChange={(e) => patchQ(q.id, { max: Number(e.target.value) })}
                            className="h-9 rounded-xl"
                            placeholder="Max"
                          />
                          <Input
                            value={q.unit ?? ""}
                            onChange={(e) => patchQ(q.id, { unit: e.target.value })}
                            className="h-9 rounded-xl"
                            placeholder="Unit"
                          />
                        </div>
                      )}
                      {q.kind === "image" && (
                        <div className="mt-2 grid grid-cols-3 gap-2">
                          {imageOptionBank.map((o) => {
                            const on = (q.options ?? []).some((x) => x.id === o.id);
                            return (
                              <button
                                key={o.id}
                                type="button"
                                onClick={() => toggleOption(q, o.id)}
                                className={
                                  on
                                    ? "overflow-hidden rounded-xl ring-2 ring-primary"
                                    : "overflow-hidden rounded-xl opacity-55 ring-1 ring-border hover:opacity-90"
                                }
                              >
                                <img src={o.image} alt={o.label} width={160} height={110} loading="lazy" className="h-16 w-full object-cover" />
                                <span className="block truncate px-1 py-1 text-[10px] font-semibold">{o.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                      <div className="mt-3 flex items-center gap-3">
                        <Label className="text-xs text-muted-foreground">Points</Label>
                        <Input
                          type="number"
                          value={q.points}
                          onChange={(e) => patchQ(q.id, { points: Number(e.target.value) })}
                          className="h-8 w-20 rounded-xl"
                        />
                        <Label className="ml-auto text-xs text-muted-foreground">Required</Label>
                        <Switch checked={q.required} onCheckedChange={(v) => patchQ(q.id, { required: v })} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap gap-2">
                {(["image", "text", "number"] as SurveyQuestionKind[]).map((k) => (
                  <Button
                    key={k}
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => setQuestions((qs) => [...qs, newQuestion(k)])}
                  >
                    <Plus className="mr-1 size-3.5" /> {k}
                  </Button>
                ))}
              </div>

              <Button className="w-full rounded-full font-semibold" onClick={save}>
                Create survey
              </Button>
            </div>
          </Panel>
        </div>
      </div>
    </AdminShell>
  );
}
