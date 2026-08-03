import { useEffect, useRef, useState } from "react";
import { Headphones, Play } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useStage } from "@/lib/stage-store";
import type { Campaign } from "@/data/stage";

export function StreamModule({ campaign }: { campaign: Campaign }) {
  const { earn, bump, isDone } = useStage();
  const [active, setActive] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => (timer.current ? clearInterval(timer.current) : undefined), []);

  const start = (platform: string, track: string, url: string, points: number) => {
    window.open(url, "_blank", "noopener,noreferrer");
    setActive(platform);
    setProgress(0);
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => {
      setProgress((p) => {
        const next = p + 100 / 30;
        if (next >= 100) {
          if (timer.current) clearInterval(timer.current);
          earn(points, "stream", `Streamed ${track} on ${platform}`, `${campaign.id}-stream-${platform}`);
          bump("stream");
          toast.success(`Stream verified on ${platform}! +${points} Points`);
          setActive(null);
          return 100;
        }
        return next;
      });
    }, 1000);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-stage p-6 text-primary-foreground shadow-pop">
        <p className="text-xs font-bold uppercase tracking-widest text-accent">Stream & earn</p>
        <h3 className="mt-1 text-2xl">Play it for 30 seconds, we do the rest</h3>
        <p className="mt-2 text-primary-foreground/85">
          We check playback with the platform after 30 seconds and drop your points automatically.
        </p>
      </div>

      {campaign.streams.map((s) => {
        const done = isDone(`${campaign.id}-stream-${s.platform}`);
        return (
          <div key={s.platform} className="rounded-3xl bg-card p-5 shadow-card">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-2xl bg-sun text-accent-foreground">
                  <Headphones className="size-5" />
                </span>
                <div>
                  <p className="font-semibold">{s.track}</p>
                  <p className="text-sm text-muted-foreground">
                    {s.platform} · {s.points} points
                  </p>
                </div>
              </div>
              {done ? (
                <span className="rounded-full bg-success px-4 py-2 text-sm font-bold text-success-foreground">
                  Verified ✅
                </span>
              ) : (
                <Button
                  className="rounded-full font-bold"
                  disabled={active === s.platform}
                  onClick={() => start(s.platform, s.track, s.url, s.points)}
                >
                  <Play className="mr-1 size-4" /> Listen on {s.platform}
                </Button>
              )}
            </div>
            {active === s.platform && (
              <div className="mt-4 space-y-1">
                <Progress value={progress} />
                <p className="text-xs font-semibold text-muted-foreground">
                  Verifying playback… {Math.round((progress / 100) * 30)}s / 30s
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
