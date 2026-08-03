import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, Gamepad2, Home, LayoutDashboard, Trophy, User, Wallet } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useStage } from "@/lib/stage-store";
import logoAsset from "@/assets/sparkfan-logo.png.asset.json";
import { cn } from "@/lib/utils";


const links = [
  { to: "/", label: "Home", icon: Home },
  { to: "/games", label: "Games", icon: Gamepad2 },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/wallet", label: "Wallet", icon: Wallet },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function StageNav() {
  const { state } = useStage();
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
          <Link to="/" className="flex items-center gap-2 font-display text-2xl font-bold tracking-tighter">
            <img src={logoAsset.url} alt="SPARKFAN logo" width={36} height={36} className="size-9 rounded-lg" />
            <span className="text-stage">SPARKFAN</span>
          </Link>
          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  path === l.to ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
                )}
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/dashboard"
              className="hidden items-center gap-2 rounded-full border border-border px-3 py-2 text-sm font-semibold hover:bg-muted sm:flex"
            >
              <LayoutDashboard className="size-4" /> Admin
            </Link>
            <Link
              to="/wallet"
              className="flex items-center gap-2 rounded-full bg-sun px-4 py-2 text-sm font-bold text-accent-foreground shadow-card"
            >
              ⚡ {state.points.toLocaleString()}
            </Link>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  aria-label="Notifications"
                  className="relative rounded-full border border-border p-2 hover:bg-muted"
                >
                  <Bell className="size-4" />
                  {state.transactions.length > 0 && (
                    <span className="absolute right-1 top-1 size-2 rounded-full bg-highlight" />
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 rounded-2xl p-0">
                <div className="border-b border-border px-4 py-3">
                  <p className="font-display font-bold">Activity</p>
                  <p className="text-xs text-muted-foreground">Your latest points movement</p>
                </div>
                <ul className="max-h-72 divide-y divide-border overflow-y-auto">
                  {state.transactions.slice(0, 8).map((t) => (
                    <li key={t.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                      <span className="font-semibold">{t.label}</span>
                      <span
                        className={cn(
                          "shrink-0 font-bold",
                          t.amount >= 0 ? "text-success" : "text-destructive",
                        )}
                      >
                        {t.amount >= 0 ? "+" : ""}
                        {t.amount}
                      </span>
                    </li>
                  ))}
                  {!state.transactions.length && (
                    <li className="px-4 py-6 text-center text-sm text-muted-foreground">
                      Nothing yet. Go spin the wheel 🎡
                    </li>
                  )}
                </ul>
              </PopoverContent>
            </Popover>

          </div>
        </nav>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-border bg-background/95 backdrop-blur md:hidden">
        {links.map((l) => {
          const Icon = l.icon;
          const active = path === l.to;
          return (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-semibold",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className="size-5" />
              {l.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export function StageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <StageNav />
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      <footer className="mx-auto max-w-6xl px-4 py-10 text-sm text-muted-foreground">
        <p>
          SPARKFAN — gbedu, games and gifts. No wahala.{" "}
          <Link to="/dashboard" className="font-semibold text-primary">Creator dashboard</Link>

        </p>
      </footer>
    </div>
  );
}
