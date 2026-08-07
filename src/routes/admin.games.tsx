import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Bar as RBar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Gamepad2, Pencil, Plus, Target, Timer, Trash2, Trophy, Upload } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Celebrity, QuizQuestion } from "@/data/console";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/lib/admin-store";
import {
  Bar,
  CHART,
  CHART_SERIES,
  DataTable,
  PageHeader,
  Panel,
  StatCard,
  Td,
  exportCsv,
  nf,
  shortDate,
} from "@/components/admin/ConsoleUI";

export const Route = createFileRoute("/admin/games")({
  head: () => ({
    meta: [
      { title: "Games & quiz results — accuracy and solve rates | SPARKFAN" },
      {
        name: "description",
        content:
          "Read quiz scores, per-question accuracy, Guess the Celebrity solve rates and results from memory and word games across every fan campaign.",
      },
      { property: "og:title", content: "Games & quiz results — SPARKFAN console" },
      { property: "og:description", content: "Quiz accuracy, celebrity solve rates and game leaderboards." },
    ],
  }),
  component: Games,
});

function Games() {
  const { quizResults, gameResults, quizQuestions, celebrities, campaigns, actions } = useAdmin();
  const campaignIds = campaigns.map((c) => c.id);
  const [editQ, setEditQ] = useState<QuizQuestion | null>(null);
  const [editCeleb, setEditCeleb] = useState<Celebrity | null>(null);
  const [qCampaign, setQCampaign] = useState(campaigns[0]?.id ?? "");

  const questions = quizQuestions.filter((q) => campaignIds.includes(q.campaignId));
  const celebs = celebrities.filter((c) => campaignIds.includes(c.campaignId));

  const avgScore = quizResults.length
    ? Math.round(
        (quizResults.reduce((s, r) => s + r.score / (r.total || 1), 0) / quizResults.length) * 100,
      )
    : 0;
  const avgSeconds = quizResults.length
    ? Math.round(quizResults.reduce((s, r) => s + r.seconds, 0) / quizResults.length)
    : 0;

  const byGame = useMemo(() => {
    const map = new Map<string, { name: string; plays: number; won: number; points: number }>();
    gameResults.forEach((g) => {
      const cur = map.get(g.game) ?? { name: g.game, plays: 0, won: 0, points: 0 };
      cur.plays += g.rounds;
      cur.won += g.won;
      cur.points += g.points;
      map.set(g.game, cur);
    });
    return [...map.values()];
  }, [gameResults]);

  const hardest = [...questions].sort((a, b) => a.accuracy - b.accuracy).slice(0, 10);

  return (
    <>
      <PageHeader
        title="Games & quiz results"
        subtitle="How fans are actually performing — question by question, round by round."
        actions={
          <Button
            variant="outline"
            onClick={() =>
              exportCsv("game-results.csv", [
                ["Fan", "Game", "Rounds", "Won", "Points", "At"],
                ...gameResults.map((g) => [g.fan, g.game, g.rounds, g.won, g.points, g.at]),
              ])
            }
          >
            Export CSV
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Quiz attempts" value={nf(quizResults.length)} icon={<Target className="size-4" />} />
        <StatCard label="Average score" value={`${avgScore}%`} tone="success" />
        <StatCard label="Average time" value={`${avgSeconds}s`} tone="purple" icon={<Timer className="size-4" />} />
        <StatCard label="Game rounds played" value={nf(gameResults.reduce((s, g) => s + g.rounds, 0))} tone="gold" icon={<Gamepad2 className="size-4" />} />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Panel title="Win rate by game" hint="Rounds won vs played">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byGame}>
                <CartesianGrid stroke={CHART.grid} vertical={false} />
                <XAxis dataKey="name" stroke={CHART.axis} fontSize={11} />
                <YAxis stroke={CHART.axis} fontSize={11} />
                <Tooltip />
                <Legend />
                <RBar dataKey="plays" name="Rounds" fill={CHART.blueLight} radius={[6, 6, 0, 0]} />
                <RBar dataKey="won" name="Won" fill={CHART.blue} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Points issued by game" hint="Share of game points">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={byGame} dataKey="points" nameKey="name" innerRadius={50} outerRadius={90}>
                  {byGame.map((_, i) => (
                    <Cell key={i} fill={CHART_SERIES[i % CHART_SERIES.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel
        title="Guess the Celebrity — rounds & images"
        hint="Edit names, hints and swap the photo used in the fan app"
        actions={
          <Button
            variant="outline"
            className="rounded-full font-bold"
            onClick={() =>
              setEditCeleb({
                id: `cel-${Math.random().toString(36).slice(2, 8)}`,
                name: "",
                hint: "",
                image: "https://picsum.photos/seed/new-celeb/480/480",
                campaignId: qCampaign || campaigns[0]?.id || "",
                guesses: 0,
                solved: 0,
              })
            }
          >
            <Plus className="size-4" /> Add round
          </Button>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {celebs.map((c) => {
            const rate = c.guesses ? (c.solved / c.guesses) * 100 : 0;
            return (
              <div key={c.id} className="flex items-center gap-3 rounded-2xl border border-border bg-white p-3">
                <img src={c.image} alt={c.name} loading="lazy" className="size-16 rounded-xl object-cover object-top" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-ink">{c.name}</p>
                  <p className="truncate text-[11px] text-ink-3">{c.hint}</p>
                  <div className="mt-2">
                    <Bar value={rate} tone={rate > 70 ? "success" : "gold"} />
                  </div>
                  <p className="mt-1 text-[11px] font-semibold text-ink-2">
                    {Math.round(rate)}% solved · {nf(c.guesses)} guesses
                  </p>
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" variant="outline" className="rounded-full" onClick={() => setEditCeleb(c)}>
                      <Pencil className="size-3.5" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="rounded-full text-bad hover:bg-bad/10"
                      onClick={() => {
                        actions.deleteCelebrity(c.id);
                        actions.log("Removed celebrity round", c.name, "critical");
                        toast.success("Round removed");
                      }}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      <Panel
        title="Quiz questions"
        hint="Add, rewrite or delete any question — changes hit the fan app instantly"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={qCampaign}
              onChange={(e) => setQCampaign(e.target.value)}
              className="h-10 rounded-xl border border-input bg-background px-3 text-sm"
            >
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <Button
              className="rounded-full bg-brand-gradient font-bold text-white"
              onClick={() =>
                setEditQ({
                  id: `q-${Math.random().toString(36).slice(2, 8)}`,
                  campaignId: qCampaign || campaigns[0]?.id || "",
                  q: "",
                  a: "",
                  accuracy: 0,
                })
              }
            >
              <Plus className="size-4" /> Add question
            </Button>
          </div>
        }
      >
        <DataTable head={["Question", "Answer", "Accuracy", ""]}>
          {questions
            .filter((q) => (qCampaign ? q.campaignId === qCampaign : true))
            .map((q) => (
              <tr key={q.id}>
                <Td className="font-semibold text-ink">{q.q}</Td>
                <Td>{q.a}</Td>
                <Td className="w-28">
                  <Bar value={q.accuracy} tone={q.accuracy < 40 ? "gold" : "brand"} />
                  <span className="text-[11px] text-ink-3">{q.accuracy}%</span>
                </Td>
                <Td>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setEditQ(q)}>
                      <Pencil className="size-3.5" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-bad hover:bg-bad/10"
                      onClick={() => {
                        actions.deleteQuizQuestion(q.id);
                        actions.log("Deleted quiz question", q.q, "critical");
                        toast.success("Question deleted");
                      }}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </Td>
              </tr>
            ))}
        </DataTable>
      </Panel>

      <div className="grid gap-5 xl:grid-cols-2">
        <Panel title="Hardest quiz questions" hint="Lowest accuracy first">
          <DataTable head={["Question", "Answer", "Accuracy"]}>
            {hardest.map((q) => (
              <tr key={q.id}>
                <Td className="font-semibold text-ink">{q.q}</Td>
                <Td>{q.a}</Td>
                <Td className="w-32">
                  <Bar value={q.accuracy} tone={q.accuracy < 40 ? "gold" : "brand"} />
                  <span className="text-[11px] text-ink-3">{q.accuracy}%</span>
                </Td>
              </tr>
            ))}
          </DataTable>
        </Panel>

        <Panel title="Top quiz scores" hint="Fastest perfect runs first">
          <DataTable head={["Fan", "Score", "Time", "When"]}>
            {[...quizResults]
              .sort((a, b) => b.score / b.total - a.score / a.total || a.seconds - b.seconds)
              .slice(0, 12)
              .map((r) => (
                <tr key={r.id}>
                  <Td className="font-semibold text-ink">{r.fan}</Td>
                  <Td>
                    {r.score}/{r.total}
                  </Td>
                  <Td>{r.seconds}s</Td>
                  <Td>{shortDate(r.at)}</Td>
                </tr>
              ))}
          </DataTable>
        </Panel>
      </div>

      <Panel title="Recent game results" hint={`${nf(gameResults.length)} results`}>
        <DataTable head={["Fan", "Game", "Rounds", "Won", "Points", "When"]}>
          {gameResults.slice(0, 15).map((g) => (
            <tr key={g.id}>
              <Td className="font-semibold text-ink">{g.fan}</Td>
              <Td>{g.game}</Td>
              <Td>{g.rounds}</Td>
              <Td>
                <span className="inline-flex items-center gap-1 font-semibold text-ok">
                  <Trophy className="size-3.5" /> {g.won}
                </span>
              </Td>
              <Td>{nf(g.points)}</Td>
              <Td>{shortDate(g.at)}</Td>
            </tr>
          ))}
        </DataTable>
      </Panel>

      {editQ && (
        <QuestionEditor
          key={editQ.id}
          question={editQ}
          campaigns={campaigns.map((c) => ({ id: c.id, name: c.name }))}
          onClose={() => setEditQ(null)}
          onSave={(q) => {
            if (!q.q.trim() || !q.a.trim()) {
              toast.error("A question needs both a prompt and an answer.");
              return;
            }
            actions.saveQuizQuestion(q);
            actions.log("Saved quiz question", q.q);
            setEditQ(null);
            toast.success("Question saved");
          }}
        />
      )}

      {editCeleb && (
        <CelebEditor
          key={editCeleb.id}
          celeb={editCeleb}
          campaigns={campaigns.map((c) => ({ id: c.id, name: c.name }))}
          onClose={() => setEditCeleb(null)}
          onSave={(c) => {
            if (!c.name.trim()) {
              toast.error("Name the celebrity first.");
              return;
            }
            actions.saveCelebrity(c);
            actions.log("Saved celebrity round", c.name);
            setEditCeleb(null);
            toast.success("Round saved");
          }}
        />
      )}
    </>
  );
}

function QuestionEditor({
  question,
  campaigns,
  onClose,
  onSave,
}: {
  question: QuizQuestion;
  campaigns: { id: string; name: string }[];
  onClose: () => void;
  onSave: (q: QuizQuestion) => void;
}) {
  const [draft, setDraft] = useState<QuizQuestion>(question);
  const set = <K extends keyof QuizQuestion>(k: K, v: QuizQuestion[K]) => setDraft((d) => ({ ...d, [k]: v }));
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xl rounded-3xl">
        <DialogHeader>
          <DialogTitle>{question.q ? "Edit question" : "New question"}</DialogTitle>
          <DialogDescription>Question text, correct answer and which campaign quiz it belongs to.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-ink">
            Question
            <Input value={draft.q} onChange={(e) => set("q", e.target.value)} className="mt-1 rounded-xl" />
          </label>
          <label className="block text-sm font-semibold text-ink">
            Correct answer
            <Input value={draft.a} onChange={(e) => set("a", e.target.value)} className="mt-1 rounded-xl" />
          </label>
          <label className="block text-sm font-semibold text-ink">
            Campaign
            <select
              value={draft.campaignId}
              onChange={(e) => set("campaignId", e.target.value)}
              className="mt-1 h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
            >
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSave(draft)}>Save question</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CelebEditor({
  celeb,
  campaigns,
  onClose,
  onSave,
}: {
  celeb: Celebrity;
  campaigns: { id: string; name: string }[];
  onClose: () => void;
  onSave: (c: Celebrity) => void;
}) {
  const [draft, setDraft] = useState<Celebrity>(celeb);
  const set = <K extends keyof Celebrity>(k: K, v: Celebrity[K]) => setDraft((d) => ({ ...d, [k]: v }));

  const onFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      set("image", String(reader.result));
      toast.success("Photo uploaded");
    };
    reader.readAsDataURL(file);
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xl rounded-3xl">
        <DialogHeader>
          <DialogTitle>{celeb.name ? "Edit round" : "New round"}</DialogTitle>
          <DialogDescription>Swap the photo, rewrite the hint and pick the campaign it plays in.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img src={draft.image} alt="Round preview" className="size-20 rounded-xl object-cover object-top" />
            <div className="space-y-2">
              <label className="inline-flex cursor-pointer items-center rounded-full border border-border px-4 py-2 text-xs font-bold text-ink-2 hover:bg-brand/5">
                <Upload className="mr-1 inline size-3.5" /> Upload photo
                <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
              </label>
              <Input
                value={draft.image.startsWith("data:") ? "" : draft.image}
                onChange={(e) => set("image", e.target.value)}
                placeholder="…or paste an image URL"
                className="h-9 w-64 rounded-xl text-xs"
              />
            </div>
          </div>
          <label className="block text-sm font-semibold text-ink">
            Name
            <Input value={draft.name} onChange={(e) => set("name", e.target.value)} className="mt-1 rounded-xl" />
          </label>
          <label className="block text-sm font-semibold text-ink">
            Hint
            <Input value={draft.hint} onChange={(e) => set("hint", e.target.value)} className="mt-1 rounded-xl" />
          </label>
          <label className="block text-sm font-semibold text-ink">
            Campaign
            <select
              value={draft.campaignId}
              onChange={(e) => set("campaignId", e.target.value)}
              className="mt-1 h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
            >
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSave(draft)}>Save round</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
