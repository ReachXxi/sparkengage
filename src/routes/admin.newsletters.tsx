import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MousePointerClick, Plus, Send, Trash2, Wand2 } from "lucide-react";
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
import { newsletterAudiences, type Newsletter } from "@/data/console";
import { Bar, DataTable, PageHeader, Panel, Pill, StatCard, Td, nf, shortDate } from "@/components/admin/ConsoleUI";

export const Route = createFileRoute("/admin/newsletters")({
  head: () => ({
    meta: [
      { title: "Newsletters — write, schedule & measure fan emails | SPARKFAN" },
      {
        name: "description",
        content:
          "Compose campaign newsletters, pick the fan audience, schedule the send and read open and click rates for every broadcast.",
      },
      { property: "og:title", content: "Newsletters — SPARKFAN console" },
      { property: "og:description", content: "Compose, schedule and measure fan newsletters per campaign." },
    ],
  }),
  component: Newsletters,
});

function emptyNewsletter(tenantId: string, campaignId: string): Newsletter {
  return {
    id: `nl-${Math.random().toString(36).slice(2, 8)}`,
    tenantId,
    campaignId,
    subject: "",
    preheader: "",
    body: "",
    audience: "All fans",
    scheduledAt: new Date(Date.now() + 86_400_000).toISOString().slice(0, 16),
    status: "draft",
    recipients: 0,
    opens: 0,
    clicks: 0,
  };
}

function Newsletters() {
  const { tenant, newsletters, campaigns, users, actions } = useAdmin();
  const [editing, setEditing] = useState<Newsletter | null>(null);

  const sent = newsletters.filter((n) => n.status === "sent");
  const recipients = sent.reduce((s, n) => s + n.recipients, 0);
  const opens = sent.reduce((s, n) => s + n.opens, 0);
  const clicks = sent.reduce((s, n) => s + n.clicks, 0);

  const save = (n: Newsletter) => {
    if (!n.subject.trim()) {
      toast.error("Add a subject line first.");
      return;
    }
    actions.saveNewsletter(n);
    actions.log(newsletters.some((x) => x.id === n.id) ? "Updated newsletter" : "Created newsletter", n.subject);
    setEditing(null);
    toast.success("Newsletter saved.");
  };

  return (
    <>
      <PageHeader
        title="Newsletters"
        subtitle={`Email broadcasts for ${tenant.name}. Write once, target a fan segment, schedule the send and watch opens roll in.`}
        actions={
          <Button
            className="rounded-full bg-brand-gradient font-bold text-white shadow-console hover:opacity-95"
            onClick={() => setEditing(emptyNewsletter(tenant.id, campaigns[0]?.id ?? ""))}
          >
            <Plus className="mr-1 size-4" /> New newsletter
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Broadcasts" value={nf(newsletters.length)} icon={<Mail className="size-4" />} />
        <StatCard label="Emails delivered" value={nf(recipients)} tone="purple" />
        <StatCard
          label="Open rate"
          value={`${recipients ? Math.round((opens / recipients) * 100) : 0}%`}
          tone="success"
        />
        <StatCard
          label="Click rate"
          value={`${recipients ? Math.round((clicks / recipients) * 100) : 0}%`}
          tone="gold"
          icon={<MousePointerClick className="size-4" />}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {newsletters.map((n) => {
          const openRate = n.recipients ? (n.opens / n.recipients) * 100 : 0;
          const campaign = campaigns.find((c) => c.id === n.campaignId);
          return (
            <article key={n.id} className="console-card space-y-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-ink-3">
                    {n.audience}
                    {campaign ? ` · ${campaign.name}` : ""}
                  </p>
                  <h3 className="truncate text-base font-bold text-ink">{n.subject}</h3>
                  <p className="truncate text-xs text-ink-3">{n.preheader}</p>
                </div>
                <Pill>{n.status}</Pill>
              </div>
              <p className="line-clamp-3 rounded-2xl bg-brand/5 p-3 text-sm text-ink-2">{n.body}</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { l: "Recipients", v: nf(n.recipients) },
                  { l: "Opens", v: nf(n.opens) },
                  { l: "Clicks", v: nf(n.clicks) },
                ].map((s) => (
                  <div key={s.l} className="rounded-xl bg-brand/6 px-2 py-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-ink-3">{s.l}</p>
                    <p className="text-sm font-bold text-ink">{s.v}</p>
                  </div>
                ))}
              </div>
              <Bar value={openRate} tone="success" />
              <p className="text-[11px] text-ink-3">Scheduled {shortDate(n.scheduledAt)}</p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" className="rounded-full font-bold" onClick={() => setEditing(n)}>
                  Edit
                </Button>
                {n.status !== "sent" && (
                  <Button
                    size="sm"
                    className="rounded-full bg-brand-gradient font-bold text-white"
                    onClick={() => {
                      actions.sendNewsletter(n.id);
                      actions.log("Sent newsletter", n.subject);
                      toast.success(`“${n.subject}” sent to ${n.audience}.`);
                    }}
                  >
                    <Send className="mr-1 size-3.5" /> Send now
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="ml-auto rounded-full text-bad hover:bg-bad/10"
                  onClick={() => {
                    actions.deleteNewsletter(n.id);
                    actions.log("Deleted newsletter", n.subject, "critical");
                    toast.success("Newsletter deleted");
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </article>
          );
        })}
      </div>

      <Panel title="Broadcast history" hint={`${nf(users.length)} fans in this tenancy`}>
        <DataTable head={["Subject", "Audience", "Scheduled", "Recipients", "Opens", "Clicks", "Status"]}>
          {newsletters.map((n) => (
            <tr key={n.id}>
              <Td className="font-semibold text-ink">{n.subject}</Td>
              <Td>{n.audience}</Td>
              <Td>{shortDate(n.scheduledAt)}</Td>
              <Td>{nf(n.recipients)}</Td>
              <Td>{nf(n.opens)}</Td>
              <Td>{nf(n.clicks)}</Td>
              <Td>
                <Pill>{n.status}</Pill>
              </Td>
            </tr>
          ))}
        </DataTable>
      </Panel>

      {editing && (
        <NewsletterEditor
          key={editing.id}
          newsletter={editing}
          campaigns={campaigns.map((c) => ({ id: c.id, name: c.name }))}
          onClose={() => setEditing(null)}
          onSave={save}
        />
      )}
    </>
  );
}

function NewsletterEditor({
  newsletter,
  campaigns,
  onClose,
  onSave,
}: {
  newsletter: Newsletter;
  campaigns: { id: string; name: string }[];
  onClose: () => void;
  onSave: (n: Newsletter) => void;
}) {
  const [draft, setDraft] = useState<Newsletter>(newsletter);
  const set = <K extends keyof Newsletter>(k: K, v: Newsletter[K]) => setDraft((d) => ({ ...d, [k]: v }));
  const campaignName = campaigns.find((c) => c.id === draft.campaignId)?.name ?? "the campaign";

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-3xl">
        <DialogHeader>
          <DialogTitle>{newsletter.subject ? "Edit newsletter" : "New newsletter"}</DialogTitle>
          <DialogDescription>Subject, audience, schedule and body copy.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <label className="block text-sm font-semibold text-ink">
            Subject line
            <Input value={draft.subject} onChange={(e) => set("subject", e.target.value)} className="mt-1 rounded-xl" />
          </label>
          <label className="block text-sm font-semibold text-ink">
            Preheader
            <Input value={draft.preheader} onChange={(e) => set("preheader", e.target.value)} className="mt-1 rounded-xl" />
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block text-sm font-semibold text-ink">
              Audience
              <select
                value={draft.audience}
                onChange={(e) => set("audience", e.target.value)}
                className="mt-1 h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
              >
                {newsletterAudiences.map((a) => (
                  <option key={a} value={a}>
                    {a}
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
              Send at
              <Input
                type="datetime-local"
                value={draft.scheduledAt.slice(0, 16)}
                onChange={(e) => set("scheduledAt", e.target.value)}
                className="mt-1 rounded-xl"
              />
            </label>
          </div>

          <label className="block text-sm font-semibold text-ink">
            Body
            <Textarea value={draft.body} onChange={(e) => set("body", e.target.value)} rows={6} className="mt-1 rounded-xl" />
          </label>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="rounded-full text-xs font-bold"
              onClick={() => {
                set(
                  "body",
                  `Big one for you — ${campaignName} is heating up. Stream the drop, take the quiz and clear your social tasks before the timer runs out. Top fans this week walk away with real rewards.`,
                );
                set("preheader", "Your points are waiting — tap in before the timer runs out.");
                toast.success("Newsletter copy drafted");
              }}
            >
              <Wand2 className="mr-1 size-3.5" /> AI: draft newsletter
            </Button>
            <Button
              variant="outline"
              className="rounded-full text-xs font-bold"
              onClick={() => {
                set("status", "scheduled");
                toast.success("Queued for the scheduled time");
              }}
            >
              Schedule
            </Button>
          </div>

          <div className="rounded-2xl border border-border bg-brand/5 p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-ink-3">Inbox preview</p>
            <p className="mt-2 text-sm font-bold text-ink">{draft.subject || "Your subject line"}</p>
            <p className="text-xs text-ink-3">{draft.preheader || "Preheader text shows here"}</p>
            <p className="mt-2 whitespace-pre-line text-sm text-ink-2">{draft.body}</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" className="rounded-full font-bold" onClick={onClose}>
            Cancel
          </Button>
          <Button className="rounded-full bg-brand-gradient font-bold text-white" onClick={() => onSave(draft)}>
            Save newsletter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
