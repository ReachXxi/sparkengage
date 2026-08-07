import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  Activity,
  BarChart3,
  ChevronDown,
  ClipboardList,
  Crown,
  Gamepad2,
  Gift,
  LayoutDashboard,
  ListChecks,
  Mail,
  Megaphone,
  Menu,
  MonitorPlay,
  MessageSquare,
  Radio,
  ScrollText,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { AdminProvider, useAdmin } from "@/lib/admin-store";
import logoAsset from "@/assets/sparkfan-logo.png.asset.json";
import { cn } from "@/lib/utils";
import { Pill } from "@/components/admin/ConsoleUI";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Creator console — campaigns, rewards & fan analytics | SPARKFAN" },
      {
        name: "description",
        content:
          "The SPARKFAN creator console: multi-tenant campaign creation, rewards, survey builder, game and quiz results, real-time leaderboards, top engagers and audit logs.",
      },
      { property: "og:title", content: "SPARKFAN creator console" },
      {
        property: "og:description",
        content: "Launch campaigns, build surveys, manage rewards and read live fan analytics in one console.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/campaigns", label: "Campaigns", icon: Megaphone },
  { to: "/admin/rewards", label: "Rewards", icon: Gift },
  { to: "/admin/surveys", label: "Surveys", icon: ClipboardList },
  { to: "/admin/responses", label: "Survey Responses", icon: BarChart3 },
  { to: "/admin/activities", label: "Activities", icon: ListChecks },
  { to: "/admin/streams", label: "Streams", icon: Radio },
  { to: "/admin/social", label: "Social Tasks", icon: MessageSquare },
  { to: "/admin/games", label: "Games & Quiz", icon: Gamepad2 },
  { to: "/admin/ads", label: "Ads", icon: MonitorPlay },
  { to: "/admin/newsletters", label: "Newsletters", icon: Mail },
  { to: "/admin/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/admin/engagers", label: "Top Engagers", icon: Crown },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/logs", label: "System Logs", icon: ScrollText },
] as const;

function AdminLayout() {
  return (
    <AdminProvider>
      <ConsoleChrome />
    </AdminProvider>
  );
}

function TenantSwitcher() {
  const { tenant, tenants, setTenant } = useAdmin();
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 rounded-2xl border border-white/60 bg-white/70 px-3 py-2.5 text-left shadow-console backdrop-blur transition hover:bg-white"
      >
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-gradient text-base">
          {tenant.emoji}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-bold text-ink">{tenant.name}</span>
          <span className="block text-[11px] text-ink-3">
            {tenant.plan} · {tenant.industry}
          </span>
        </span>
        <ChevronDown className={cn("size-4 shrink-0 text-ink-3 transition", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-border bg-white shadow-console-lg">
          {tenants.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setTenant(t.id);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm hover:bg-brand/5",
                t.id === tenant.id && "bg-brand/8",
              )}
            >
              <span className="grid size-8 place-items-center rounded-lg bg-brand/10">{t.emoji}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold text-ink">{t.name}</span>
                <span className="block text-[11px] text-ink-3">
                  {t.members.length} members · {t.plan}
                </span>
              </span>
              {t.plan === "Enterprise" && <Pill tone="premium">Premium</Pill>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ConsoleChrome() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  const isActive = (to: string, exact?: boolean) => (exact ? path === to : path.startsWith(to));

  return (
    <div className="min-h-screen bg-console text-ink">
      {/* ambient gradient wash */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(60rem 30rem at 12% -10%, rgba(79,111,247,0.14), transparent 60%), radial-gradient(50rem 26rem at 92% 4%, rgba(124,107,234,0.12), transparent 60%)",
        }}
      />
      <div className="relative mx-auto flex max-w-[1500px]">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 flex w-[264px] flex-col gap-4 border-r border-white/60 bg-white/70 p-4 backdrop-blur-xl transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img src={logoAsset.url} alt="SPARKFAN" width={34} height={34} className="size-9 rounded-xl" />
              <span className="font-display text-lg font-bold tracking-tight text-ink">
                SPARK<span className="text-brand-gradient">FAN</span>
              </span>
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="rounded-lg p-1.5 text-ink-3 hover:bg-brand/10 lg:hidden"
            >
              <X className="size-4" />
            </button>
          </div>

          <TenantSwitcher />

          <nav className="-mr-1 flex-1 space-y-1 overflow-y-auto pr-1">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to, "exact" in item ? item.exact : false);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                    active
                      ? "bg-brand-gradient text-white shadow-console"
                      : "text-ink-2 hover:bg-brand/8 hover:text-ink",
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <Link
            to="/"
            className="flex items-center gap-2 rounded-xl border border-border px-3 py-2.5 text-sm font-semibold text-ink-2 hover:bg-white"
          >
            <Activity className="size-4" /> Back to fan app
          </Link>
        </aside>

        {open && (
          <button
            type="button"
            aria-label="Close menu overlay"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-30 bg-ink/30 lg:hidden"
          />
        )}

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-white/60 bg-white/60 px-4 backdrop-blur-xl sm:px-6">
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className="rounded-xl border border-border p-2 text-ink-2 lg:hidden"
            >
              <Menu className="size-4" />
            </button>
            <HeaderMeta />
          </header>
          <main className="space-y-6 px-4 py-6 sm:px-6 sm:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

function HeaderMeta() {
  const { tenant, campaigns, users } = useAdmin();
  const live = campaigns.filter((c) => c.status === "live").length;
  return (
    <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-ink">{tenant.name}</p>
        <p className="text-[11px] text-ink-3">
          {live} live campaign{live === 1 ? "" : "s"} · {users.length} fans · {tenant.members.length} team members
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="hidden items-center gap-2 rounded-full bg-ok/12 px-3 py-1.5 text-xs font-bold text-ok sm:flex">
          <span className="size-2 animate-pulse rounded-full bg-ok" /> Live sync
        </span>
        <div className="flex -space-x-2">
          {tenant.members.slice(0, 3).map((m) => (
            <span
              key={m.id}
              title={`${m.name} · ${m.role}`}
              className="grid size-8 place-items-center rounded-full border-2 border-white bg-brand-gradient text-[11px] font-bold text-white"
            >
              {m.name
                .split(" ")
                .map((p) => p[0])
                .join("")}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
