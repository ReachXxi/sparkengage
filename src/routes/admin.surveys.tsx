import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ClipboardList, Hash, Image as ImageIcon, Plus, Sparkles, Trash2, Type } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/lib/admin-store";
import { draftSurveyQuestions } from "@/lib/ai-drafts";
import { imageOptionBank, type QuestionKind, type Survey, type SurveyQuestion } from "@/data/console";
import { DataTable, PageHeader, Panel, Pill, StatCard, Td, nf } from "@/components/admin/ConsoleUI";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/surveys")({
  head: () => ({
    meta: [
      { title: "Survey builder — image, text & number questions | SPARKFAN" },
      {
        name: "description",
        content:
          "Build fan surveys with image-choice, free-text and numeric questions, set point values, reorder the flow and open or close collection per campaign.",
      },
      { property: "og:title", content: "Survey builder — SPARKFAN console" },
      { property: "og:description", content: "Set survey questions with image, text and number answer types." },
    ],
  }),
  component: Surveys,
});

const KIND_META: Record<QuestionKind, { icon: typeof Type; label: string }> = {
  text: { icon: Type, label: "Text" },
  number: { icon: Hash, label: "Number" },
  image: { icon: ImageIcon, label: "Image choice" },
};

function newQuestion(kind: QuestionKind): SurveyQuestion {
  const base = {
    id: `q-${Math.random().toString(36).slice(2, 8)}`,
    kind,
    prompt: "",
    required: true,
    points: 10,
  };
  if (kind === "number") return { ...base, min: 1, max: 10, unit: "/10" };
  if (kind === "image") return { ...base, options: imageOptionBank.slice(0, 3) };
  return base;
}

function Surveys() {
  const { surveys, campaigns, responses, tenant, actions } = useAdmin();
  const [activeId, setActiveId] = useState(surveys[0]?.id ?? "");
  const survey = surveys.find((s) => s.id === activeId) ?? surveys[0];

  const totalQuestions = surveys.reduce((s, x) => s + x.questions.length, 0);
  const points = surveys.reduce((s, x) => s + x.questions.reduce((a, q) => a + q.points, 0), 0);

  const respondents = useMemo(
    () => (survey ? responses.filter((r) => r.surveyId === survey.id).length : 0),
    [responses, survey],
  );

  const createSurvey = () => {
    const campaign = campaigns[0];
    if (!campaign) {
      toast.error("Create a campaign first");
      return;
    }
    const sv: Survey = {
      id: `sv-${Math.random().toString(36).slice(2, 8)}`,
      tenantId: tenant.id,
      campaignId: campaign.id,
      title: "Untitled survey",
      description: "Describe what you want to learn from fans.",
      status: "open",
      questions: [],
    };
    actions.saveSurvey(sv);
    actions.log("Created survey", sv.title);
    setActiveId(sv.id);
  };

  const update = (patch: Partial<Survey>) => {
    if (!survey) return;
    actions.saveSurvey({ ...survey, ...patch });
  };

  const aiQuestions = () => {
    if (!survey) return;
    const campaign = campaigns.find((c) => c.id === survey.campaignId) ?? campaigns[0];
    if (!campaign) return;
    draftSurveyQuestions(campaign).forEach((q) => actions.saveQuestion(survey.id, q));
    actions.log("AI drafted survey questions", survey.title);
    toast.success("Added AI-drafted questions");
  };

  return (
    <>
      <PageHeader
        title="Surveys"
        subtitle="Set the questions fans answer for points — image choice, free text or a number."
        actions={
          <>
            <Button variant="outline" onClick={aiQuestions} disabled={!survey}>
              <Sparkles className="size-4" /> AI draft questions
            </Button>
            <Button onClick={createSurvey}>
              <Plus className="size-4" /> New survey
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Surveys" value={nf(surveys.length)} icon={<ClipboardList className="size-4" />} />
        <StatCard label="Questions" value={nf(totalQuestions)} tone="purple" />
        <StatCard label="Points on offer" value={nf(points)} tone="gold" />
        <StatCard label="Responses (this survey)" value={nf(respondents)} tone="success" />
      </div>

      <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
        <Panel title="Your surveys" hint={`${surveys.length} total`}>
          <div className="space-y-2">
            {surveys.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveId(s.id)}
                className={cn(
                  "w-full rounded-xl border px-3 py-2.5 text-left transition",
                  s.id === survey?.id ? "border-brand bg-brand/8" : "border-border hover:bg-brand/5",
                )}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-bold text-ink">{s.title}</span>
                  <Pill tone={s.status}>{s.status}</Pill>
                </span>
                <span className="mt-0.5 block text-[11px] text-ink-3">
                  {s.questions.length} questions · {campaigns.find((c) => c.id === s.campaignId)?.name ?? "—"}
                </span>
              </button>
            ))}
            {surveys.length === 0 && <p className="text-sm text-ink-3">No surveys yet.</p>}
          </div>
        </Panel>

        {survey ? (
          <div className="space-y-5">
            <Panel
              title="Survey settings"
              actions={
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => update({ status: survey.status === "open" ? "closed" : "open" })}
                  >
                    {survey.status === "open" ? "Close collection" : "Re-open"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      actions.deleteSurvey(survey.id);
                      actions.log("Deleted survey", survey.title, "warning");
                      setActiveId("");
                    }}
                  >
                    <Trash2 className="size-4 text-bad" />
                  </Button>
                </div>
              }
            >
              <div className="space-y-3">
                <Input value={survey.title} onChange={(e) => update({ title: e.target.value })} placeholder="Survey title" />
                <Textarea
                  value={survey.description}
                  onChange={(e) => update({ description: e.target.value })}
                  placeholder="Description shown to fans"
                />
                <select
                  value={survey.campaignId}
                  onChange={(e) => update({ campaignId: e.target.value })}
                  className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm"
                >
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </Panel>

            <Panel
              title="Questions"
              hint="Drag-free reordering with the arrows · points awarded per answer"
              actions={
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(KIND_META) as QuestionKind[]).map((k) => {
                    const Icon = KIND_META[k].icon;
                    return (
                      <Button
                        key={k}
                        size="sm"
                        variant="outline"
                        onClick={() => actions.saveQuestion(survey.id, newQuestion(k))}
                      >
                        <Icon className="size-3.5" /> {KIND_META[k].label}
                      </Button>
                    );
                  })}
                </div>
              }
            >
              <div className="space-y-3">
                {survey.questions.map((q, i) => {
                  const Icon = KIND_META[q.kind].icon;
                  const set = (patch: Partial<SurveyQuestion>) =>
                    actions.saveQuestion(survey.id, { ...q, ...patch } as SurveyQuestion);
                  return (
                    <div key={q.id} className="rounded-2xl border border-border bg-white p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="grid size-8 place-items-center rounded-lg bg-brand/10 text-brand">
                          <Icon className="size-4" />
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider text-ink-3">
                          Q{i + 1} · {KIND_META[q.kind].label}
                        </span>
                        <div className="ml-auto flex items-center gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            aria-label="Move up"
                            disabled={i === 0}
                            onClick={() => actions.reorderQuestions(survey.id, i, i - 1)}
                          >
                            <ArrowUp className="size-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            aria-label="Move down"
                            disabled={i === survey.questions.length - 1}
                            onClick={() => actions.reorderQuestions(survey.id, i, i + 1)}
                          >
                            <ArrowDown className="size-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            aria-label="Delete question"
                            onClick={() => actions.deleteQuestion(survey.id, q.id)}
                          >
                            <Trash2 className="size-4 text-bad" />
                          </Button>
                        </div>
                      </div>

                      <Input
                        className="mt-3"
                        value={q.prompt}
                        placeholder="Question shown to fans"
                        onChange={(e) => set({ prompt: e.target.value })}
                      />

                      <div className="mt-3 grid gap-3 sm:grid-cols-3">
                        <label className="text-xs font-semibold text-ink-3">
                          Points
                          <Input type="number" value={q.points} onChange={(e) => set({ points: Number(e.target.value) })} />
                        </label>
                        {q.kind === "number" && (
                          <>
                            <label className="text-xs font-semibold text-ink-3">
                              Min
                              <Input type="number" value={q.min ?? 0} onChange={(e) => set({ min: Number(e.target.value) })} />
                            </label>
                            <label className="text-xs font-semibold text-ink-3">
                              Max
                              <Input type="number" value={q.max ?? 10} onChange={(e) => set({ max: Number(e.target.value) })} />
                            </label>
                            <label className="text-xs font-semibold text-ink-3">
                              Unit
                              <Input value={q.unit ?? ""} onChange={(e) => set({ unit: e.target.value })} />
                            </label>
                          </>
                        )}
                        <label className="flex items-end gap-2 text-xs font-semibold text-ink-2">
                          <input
                            type="checkbox"
                            checked={q.required}
                            onChange={(e) => set({ required: e.target.checked })}
                            className="size-4 accent-[var(--brand)]"
                          />
                          Required
                        </label>
                      </div>

                      {q.kind === "image" && (
                        <div className="mt-3">
                          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-ink-3">Image options</p>
                          <div className="flex flex-wrap gap-3">
                            {(q.options ?? []).map((o) => (
                              <div key={o.id} className="relative w-24">
                                <img src={o.image} alt={o.label} loading="lazy" className="h-24 w-24 rounded-xl object-cover" />
                                <p className="mt-1 truncate text-[11px] text-ink-2">{o.label}</p>
                                <button
                                  type="button"
                                  aria-label={`Remove ${o.label}`}
                                  onClick={() => set({ options: (q.options ?? []).filter((x) => x.id !== o.id) })}
                                  className="absolute right-1 top-1 rounded-full bg-white/90 p-1 text-bad shadow"
                                >
                                  <Trash2 className="size-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {imageOptionBank
                              .filter((o) => !(q.options ?? []).some((x) => x.id === o.id))
                              .map((o) => (
                                <Button
                                  key={o.id}
                                  size="sm"
                                  variant="outline"
                                  onClick={() => set({ options: [...(q.options ?? []), o] })}
                                >
                                  <Plus className="size-3.5" /> {o.label}
                                </Button>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                {survey.questions.length === 0 && (
                  <p className="text-sm text-ink-3">No questions yet — add a text, number or image question above.</p>
                )}
              </div>
            </Panel>

            <Panel title="Fan preview" hint="Exactly what the fan app renders">
              <div className="space-y-4">
                {survey.questions.map((q, i) => (
                  <div key={q.id} className="rounded-2xl border border-border p-4">
                    <p className="text-sm font-bold text-ink">
                      {i + 1}. {q.prompt || "Untitled question"}{" "}
                      {q.required && <span className="text-bad">*</span>}
                      <span className="ml-2 text-xs font-semibold text-brand">+{q.points} pts</span>
                    </p>
                    {q.kind === "text" && (
                      <div className="mt-2 h-16 rounded-xl border border-dashed border-border bg-brand/5" />
                    )}
                    {q.kind === "number" && (
                      <p className="mt-2 text-xs text-ink-3">
                        Slider {q.min ?? 0} – {q.max ?? 10} {q.unit}
                      </p>
                    )}
                    {q.kind === "image" && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(q.options ?? []).map((o) => (
                          <img key={o.id} src={o.image} alt={o.label} loading="lazy" className="size-16 rounded-lg object-cover" />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        ) : (
          <Panel>
            <p className="text-sm text-ink-3">Select or create a survey to start building questions.</p>
          </Panel>
        )}
      </div>

      <Panel title="Survey performance" hint="Responses collected per survey">
        <DataTable head={["Survey", "Campaign", "Questions", "Responses", "Points on offer", "Status"]}>
          {surveys.map((s) => (
            <tr key={s.id}>
              <Td className="font-semibold text-ink">{s.title}</Td>
              <Td>{campaigns.find((c) => c.id === s.campaignId)?.name ?? "—"}</Td>
              <Td>{s.questions.length}</Td>
              <Td>{nf(responses.filter((r) => r.surveyId === s.id).length)}</Td>
              <Td>{nf(s.questions.reduce((a, q) => a + q.points, 0))}</Td>
              <Td>
                <Pill tone={s.status}>{s.status}</Pill>
              </Td>
            </tr>
          ))}
        </DataTable>
      </Panel>
    </>
  );
}
