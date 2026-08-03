import { useState } from "react";
import { CheckCircle2, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useStage } from "@/lib/stage-store";
import type { Campaign } from "@/data/stage";

export function SocialModule({ campaign }: { campaign: Campaign }) {
  const { earn, bump, isDone, state } = useStage();
  const [verifying, setVerifying] = useState<string | null>(null);

  const verify = (id: string, points: number, label: string) => {
    setVerifying(id);
    setTimeout(() => {
      setVerifying(null);
      earn(points, "social", label, `${campaign.id}-social-${id}`);
      bump("social");
      toast.success(`Verified! ✅ +${points} Points`);
    }, 1400);
  };

  const shareCode = `stage.app/c/${state.displayName.toLowerCase()}${campaign.id.slice(0, 3)}`;

  return (
    <div className="space-y-4">
      {campaign.social.map((task) => {
        const done = isDone(`${campaign.id}-social-${task.id}`);
        return (
          <div
            key={task.id}
            className="flex flex-col gap-3 rounded-3xl bg-card p-5 shadow-card sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-highlight">
                {task.platform} · {task.actionType}
              </p>
              <p className="mt-1 text-lg font-semibold">{task.label}</p>
              <p className="text-sm text-muted-foreground">{task.points} points on verification</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button asChild variant="outline" className="rounded-full font-bold">
                <a href={task.targetUrl} target="_blank" rel="noreferrer noopener">
                  Do it <ExternalLink className="ml-1 size-4" />
                </a>
              </Button>
              {done ? (
                <span className="flex items-center gap-1 rounded-full bg-success px-4 py-2 text-sm font-bold text-success-foreground">
                  <CheckCircle2 className="size-4" /> Verified
                </span>
              ) : (
                <Button
                  className="rounded-full font-bold"
                  disabled={verifying === task.id}
                  onClick={() => verify(task.id, task.points, task.label)}
                >
                  {verifying === task.id ? (
                    <>
                      <Loader2 className="mr-1 size-4 animate-spin" /> Verifying…
                    </>
                  ) : (
                    "Verify"
                  )}
                </Button>
              )}
            </div>
          </div>
        );
      })}

      <div className="rounded-3xl bg-cool p-5 text-primary-foreground shadow-card">
        <p className="text-xs font-bold uppercase tracking-widest text-accent">Your unique share link</p>
        <p className="mt-2 font-mono text-lg">{shareCode}</p>
        <p className="mt-1 text-sm text-primary-foreground/85">
          Every click on this link is tracked to you. 5 points per verified click.
        </p>
        <Button
          className="mt-3 rounded-full bg-sun font-bold text-accent-foreground"
          onClick={() => {
            void navigator.clipboard?.writeText(`https://${shareCode}`);
            toast.success("Link copied. Go and blow 🗣️");
          }}
        >
          Copy link
        </Button>
      </div>

      <details className="rounded-3xl bg-muted p-5 text-sm">
        <summary className="cursor-pointer font-bold">Verification failed? Submit a screenshot instead</summary>
        <p className="mt-2 text-muted-foreground">
          Manual review takes up to 48 hours. Upload a clear screenshot showing the completed action.
        </p>
        <input type="file" accept="image/*" className="mt-3 block text-sm" onChange={() => toast.success("Screenshot queued for manual review.")} />
      </details>
    </div>
  );
}
