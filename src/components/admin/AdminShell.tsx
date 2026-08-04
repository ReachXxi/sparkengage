import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  BarChart3,
  Building2,
  ClipboardList,
  Gamepad2,
  Gift,
  LayoutGrid,
  ListChecks,
  Menu,
  Plus,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdmin } from "@/lib/admin-store";
import { cn } from "@/lib/utils";
import logoAsset from "@/assets/sparkfan-logo.png.asset.json";

const nav = [
  { to: "/admin", label: "Overview", icon: BarChart3 },
  { to: "/admin/campaigns", label: "Campaigns", icon: LayoutGrid },
  { to: "/admin/rewards", label: "Rewards", icon: Gift },
  { to: "/admin/surveys", label: "Surveys", icon: ClipboardList },
  { to: "/admin/responses", label: "Responses", icon: ListChecks },
  { to: "/admin/results", label: "Quiz & games", icon: Gamepad2 },
  { to: "/admin/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/admin/settings", label: "Workspace", icon: Building2 },
] as const;

function TenantSwitcher() {
  const { state, tenant, setTenant } = useAdmin();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5 text-left transition-colors hover:bg-muted"
        >
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-sm">{tenant.emoji}</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold">{tenant.name}</span>
            <span className="block text-[11px] uppercase tracking-widest text-muted-foreground">
              {tenant.plan} · {tenant.members.length} seats
            </span>
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel className="text-xs uppercase tracking-widest text-muted-foreground">
          Workspaces
        </DropdownMenuLabel>
        {state.tenants.map((t) => (
          <DropdownMenuItem key={t.id} onClick={() => setTenant(t.id)} className="gap-2">
            <span>{t.emoji}</span>
            <span className="flex-1 truncate">{t.name}</span>
            {t.id === tenant.id && <span className="text-xs text-muted-foreground">current</span>}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/admin/settings">
            <Plus className="mr-2 size-4" /> New workspace
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="space-y-1">
      {nav.map((item) => {
        const Icon = item.icon;
        const active = item.to === "/admin" ? path === "/admin" : path.startsWith(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminShell({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { tenant } = useAdmin();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-[1500px]">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border p-4 lg:flex">
          <Link to="/" className="mb-6 flex items-center gap-2 px-1">
            <img src={logoAsset.url} alt="SPARKFAN" width={30} height={30} className="size-[30px] rounded-md" />
            <span className="font-display text-lg font-bold tracking-tight">SPARKFAN</span>
            <span className="ml-auto rounded-md border border-border px-1.5 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
              Admin
            </span>
          </Link>
          <TenantSwitcher />
          <div className="mt-6 flex-1 overflow-y-auto">
            <NavList />
          </div>
          <Link
            to="/"
            className="mt-4 rounded-xl border border-border px-3 py-2.5 text-center text-xs font-semibold text-muted-foreground hover:bg-muted"
          >
            View fan experience →
          </Link>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-border bg-background/85 px-4 py-4 backdrop-blur sm:px-8">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className="lg:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
                <Menu className="size-4" />
              </Button>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {tenant.name}
                </p>
                <h1 className="truncate text-xl font-bold tracking-tight sm:text-2xl">{title}</h1>
              </div>
              <div className="flex shrink-0 items-center gap-2">{actions}</div>
            </div>
            {description && <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{description}</p>}
            {open && (
              <div className="mt-4 space-y-4 lg:hidden">
                <TenantSwitcher />
                <NavList onNavigate={() => setOpen(false)} />
              </div>
            )}
          </header>
          <main className="px-4 py-6 sm:px-8 sm:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

export function Panel({
  title,
  description,
  actions,
  className,
  children,
}: {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("rounded-2xl border border-border bg-card p-5 shadow-card", className)}>
      {(title || actions) && (
        <div className="mb-4 flex items-start gap-3">
          <div className="min-w-0 flex-1">
            {title && <h2 className="text-base font-semibold tracking-tight">{title}</h2>}
            {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
          </div>
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}

export function Metric({
  label,
  value,
  delta,
  hint,
}: {
  label: string;
  value: string;
  delta?: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-2xl font-bold tracking-tight">{value}</p>
      {(delta || hint) && (
        <p className="mt-1 text-xs text-muted-foreground">
          {delta && <span className="font-semibold text-foreground">{delta}</span>} {hint}
        </p>
      )}
    </div>
  );
}

export function Pill({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "solid" | "muted" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
        tone === "solid" && "bg-primary text-primary-foreground",
        tone === "muted" && "bg-muted text-muted-foreground",
        tone === "default" && "border border-border text-muted-foreground",
      )}
    >
      {children}
    </span>
  );
}
