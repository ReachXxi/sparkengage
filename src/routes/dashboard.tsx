import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Download, Wand2 } from "lucide-react";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { StageShell } from "@/components/stage/StageShell";
import { campaigns } from "@/data/stage";
import { AdminPasswordGate } from "@/components/admin/AdminPasswordGate";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Creator dashboard — launch a SPARKFAN campaign in minutes" },
      {
        name: "description",
        content:
          "Describe your drop in one line and the SPARKFAN assistant drafts the campaign: modules, point values, quiz questions, prizes and a live analytics dashboard.",
      },
      { property: "og:title", content: "Creator dashboard — launch a SPARKFAN campaign in minutes" },
      {
        property: "og:description",
        content: "AI campaign assistant, module builder, live analytics and post-campaign reporting for creators.",
      },
    ],
  }),
  component: Dashboard,
});

type Draft = {
  name: string;
  type: string;
  duration: string;
  modules: string[];
  points: { label: string; value: number }[];
  prize: string;
  copy: string;
  questions: string[];
};

function buildDraft(prompt: string): Draft {
  const text = prompt.toLowerCase();
  const quoted = prompt.match(/['"“]([^'"”]+)['"”]/)?.[1];
  const isMovie = /movie|film|trailer|premiere|series|show/.test(text);
  const isBrand = /brand|product|collab|launch of our/.test(text);
  const title = quoted ?? (isMovie ? "Premiere Week" : "New Drop");
  const modules = ["Stream", "Quiz"];
  if (/lyric|unscramble|song|single|album/.test(text)) modules.push("Unscramble the Lyrics");
  if (/game|fun|pics/.test(text) || !isMovie) modules.push("4 Pics 1 Word");
  if (/celeb|cast|star/.test(text) || isMovie) modules.push("Guess the Celebrity");
  modules.push("Social Tasks");

  return {
    name: `${title} ${isMovie ? "Premiere Party" : "Launch Party"}`,
    type: isMovie ? "Movie Premiere" : isBrand ? "Brand Collab" : "Album Launch",
    duration: /friday|weekend|48/.test(text) ? "48 hours (On-Demand)" : "7 days (Live)",
    modules,
    points: [
      { label: "Stream a track", value: 10 },
      { label: "Correct quiz answer", value: 15 },
      { label: "Unscramble solved", value: 25 },
      { label: "Social action verified", value: 25 },
    ],
    prize: "Top 100 win exclusive digital art · Top 3 win signed merch",
    copy: `Omo! ${title} is here. Stream it, play the games, drag your friends in and climb the board before the timer runs out. Top fans go home with something real.`,
    questions: [
      `Which track opens ${title}?`,
      `What year did the creator drop their first project?`,
      `True or false: ${title} was recorded in Lagos.`,
      `Who features on the biggest song from ${title}?`,
      `Which city gets the loudest shoutout on ${title}?`,
    ],
  };
}

const moduleData = [
  { name: "Quiz", completion: 82, points: 4200 },
  { name: "Stream", completion: 71, points: 3100 },
  { name: "Unscramble", completion: 64, points: 2400 },
  { name: "4 Pics", completion: 58, points: 1800 },
  { name: "Social", completion: 49, points: 3600 },
];

const funnelData = [
  { step: "Viewed", users: 12400 },
  { step: "Joined", users: 6210 },
  { step: "1+ action", users: 4980 },
  { step: "Finished quiz", users: 3110 },
  { step: "Redeemed", users: 1180 },
];

const socialSplit = [
  { name: "X", value: 48 },
  { name: "Instagram", value: 31 },
  { name: "TikTok", value: 21 },
];

const pieColors = ["oklch(0.42 0.19 305)", "oklch(0.68 0.23 5)", "oklch(0.75 0.13 205)"];

function Dashboard() {
  return <AdminPasswordGate><DashboardContent /></AdminPasswordGate>;
}

function DashboardContent() {
  const [prompt, setPrompt] = useState(
    "I'm launching my new single 'Shayo' next Friday. I want streams and lyrics games.",
  );
  const [draft, setDraft] = useState<Draft | null>(null);
  const [working, setWorking] = useState(false);

  const generate = () => {
    setWorking(true);
    setTimeout(() => {
      setDraft(buildDraft(prompt));
      setWorking(false);
      toast.success("Draft campaign ready — tweak it and publish.");
    }, 900);
  };

  return (
    <StageShell>
      <div className="space-y-8">
        <header className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-widest text-highlight">Creator dashboard</p>
          <h1 className="text-3xl sm:text-4xl">Launch a campaign in under 5 minutes</h1>
          <p className="text-sm text-muted-foreground">
            Describe the drop. We draft modules, points, quiz content and the prize structure.
          </p>
        </header>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-card sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-highlight">Creator console</p>
              <h2 className="mt-1 text-2xl">Manage everything in the admin console</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Campaigns, games and quiz questions, activities, social task links, rewards, surveys, leaderboards,
                ads and newsletters — fully customisable per campaign.
              </p>
            </div>
            <Button asChild size="lg" className="rounded-full bg-sun font-bold text-accent-foreground">
              <Link to="/admin">Open the admin console</Link>
            </Button>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { to: "/admin/campaigns", label: "Campaigns", hint: "Create, edit, publish" },
              { to: "/admin/games", label: "Games & Quiz", hint: "Questions & images" },
              { to: "/admin/activities", label: "Activities", hint: "Types, points, targets" },
              { to: "/admin/social", label: "Social tasks", hint: "Links & verification" },
              { to: "/admin/rewards", label: "Rewards", hint: "Catalogue & redemptions" },
              { to: "/admin/surveys", label: "Surveys", hint: "Image, text, number" },
              { to: "/admin/ads", label: "Ads", hint: "Banners, duration, targeting" },
              { to: "/admin/newsletters", label: "Newsletters", hint: "Write & schedule" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-2xl border border-border bg-background p-4 transition hover:border-highlight"
              >
                <p className="text-sm font-bold">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.hint}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-stage p-6 text-primary-foreground shadow-pop sm:p-8">
          <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-accent">
            <Sparkles className="size-4" /> Campaign assistant
          </p>
          <h2 className="mt-2 text-2xl">Tell us about your campaign in a few words</h2>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            className="mt-4 rounded-2xl border-white/25 bg-white/10 text-primary-foreground placeholder:text-primary-foreground/60"
            placeholder="e.g. I'm premiering a Nollywood comedy next weekend and want trivia plus TikTok shares."
          />
          <Button
            onClick={generate}
            disabled={working}
            className="mt-4 rounded-full bg-sun font-bold text-accent-foreground"
          >
            <Wand2 className="mr-1 size-4" /> {working ? "Drafting…" : "Generate campaign"}
          </Button>
        </section>

        {draft && (
          <section className="animate-pop grid gap-5 lg:grid-cols-2">
            <div className="space-y-4 rounded-3xl bg-card p-6 shadow-card">
              <h3 className="text-xl">Campaign draft</h3>
              <label className="block text-sm font-semibold">
                Name
                <Input
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  className="mt-1 rounded-full"
                />
              </label>
              <p className="text-sm">
                <span className="font-bold">Type:</span> {draft.type} · <span className="font-bold">Duration:</span>{" "}
                {draft.duration}
              </p>
              <div>
                <p className="text-sm font-bold">Modules</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {draft.modules.map((m) => (
                    <span key={m} className="rounded-full bg-muted px-3 py-1 text-xs font-semibold">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-bold">Point values</p>
                <ul className="mt-2 space-y-1 text-sm">
                  {draft.points.map((p) => (
                    <li key={p.label} className="flex justify-between rounded-lg bg-muted px-3 py-1.5">
                      <span>{p.label}</span>
                      <span className="font-bold">{p.value} pts</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-sm">
                <span className="font-bold">Prize:</span> {draft.prize}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button className="rounded-full font-bold" onClick={() => toast.success("Campaign published 🎉 Share your link!")}>
                  Publish
                </Button>
                <Button asChild variant="outline" className="rounded-full font-bold">
                  <Link to="/campaign/$id" params={{ id: campaigns[0]!.id }}>
                    Preview as fan
                  </Link>
                </Button>
                <Button variant="ghost" className="rounded-full font-bold" onClick={() => toast.success("Saved as draft")}>
                  Save as draft
                </Button>
              </div>
            </div>

            <div className="space-y-4 rounded-3xl bg-card p-6 shadow-card">
              <h3 className="text-xl">Generated content</h3>
              <div className="rounded-2xl bg-sun p-4 text-sm font-semibold text-accent-foreground">{draft.copy}</div>
              <div>
                <p className="text-sm font-bold">Quiz questions</p>
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
                  {draft.questions.map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ol>
              </div>
              <Button
                variant="secondary"
                className="rounded-full font-bold"
                onClick={() => toast.success("15 more questions added to the question bank")}
              >
                Generate 15 more questions
              </Button>
            </div>
          </section>
        )}

        <section className="space-y-4">
          <h2 className="text-2xl">Live campaign analytics</h2>
          <div className="grid gap-3 sm:grid-cols-4">
            {[
              { label: "Participants", value: "4,237" },
              { label: "Actions", value: "18,902" },
              { label: "Points issued", value: "312,480" },
              { label: "Verification rate", value: "96.4%" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-card p-4 shadow-card">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{s.label}</p>
                <p className="font-display text-2xl font-bold">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-3xl bg-card p-5 shadow-card">
              <h3 className="text-lg">Module performance</h3>
              <div className="mt-3 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={moduleData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="completion" name="Completion %" fill="oklch(0.42 0.19 305)" radius={6} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-3xl bg-card p-5 shadow-card">
              <h3 className="text-lg">Social actions by platform</h3>
              <div className="mt-3 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={socialSplit} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90}>
                      {socialSplit.map((s, i) => (
                        <Cell key={s.name} fill={pieColors[i % pieColors.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-3xl bg-card p-5 shadow-card lg:col-span-2">
              <h3 className="text-lg">Funnel</h3>
              <div className="mt-3 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={funnelData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="step" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Line type="monotone" dataKey="users" stroke="oklch(0.68 0.23 5)" strokeWidth={3} dot />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-cool p-6 text-primary-foreground shadow-pop sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-accent">Post-campaign report</p>
          <h2 className="mt-2 text-2xl">Executive summary</h2>
          <p className="mt-3 max-w-3xl text-primary-foreground/90">
            Shayo Launch Party pulled 4,237 participants and 18,902 actions in 52 hours. Quizzes drove the highest
            completion (82%) while social tasks generated the most points per user. 41% of participants came from Lagos,
            with Accra second. Cost per engagement landed at $0.021 — roughly 38% below the entertainment benchmark.
          </p>
          <ul className="mt-4 space-y-2 text-sm font-semibold">
            <li>• Target Lagos and Accra with the next drop — they converted 2.1x better.</li>
            <li>• Add a dance challenge module; TikTok shares had the highest completion per impression.</li>
            <li>• Raise the quiz to 15 questions — drop-off only started after question 12.</li>
          </ul>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button
              className="rounded-full bg-sun font-bold text-accent-foreground"
              onClick={() => toast.success("Branded PDF report generated")}
            >
              <Download className="mr-1 size-4" /> Download PDF
            </Button>
            <Button
              variant="secondary"
              className="rounded-full font-bold"
              onClick={() => toast.success("CSV export ready")}
            >
              Export CSV
            </Button>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          {[
            { name: "Basic", price: "$99", perks: ["1 campaign", "3 modules", "Standard analytics"] },
            { name: "Pro", price: "$199", perks: ["5 campaigns", "All modules", "AI reports + exports"] },
            { name: "Enterprise", price: "Custom", perks: ["Unlimited campaigns", "API keys", "Dedicated support"] },
          ].map((t) => (
            <div key={t.name} className="rounded-3xl bg-card p-6 shadow-card">
              <h3 className="text-xl">{t.name}</h3>
              <p className="font-display text-3xl font-bold text-primary">{t.price}</p>
              <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                {t.perks.map((p) => (
                  <li key={p}>✓ {p}</li>
                ))}
              </ul>
              <Button
                className="mt-4 w-full rounded-full font-bold"
                onClick={() => toast.success(`${t.name} plan selected — billing setup opens next.`)}
              >
                Choose {t.name}
              </Button>
            </div>
          ))}
        </section>
      </div>
    </StageShell>
  );
}
