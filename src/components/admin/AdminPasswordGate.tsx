import { useServerFn } from "@tanstack/react-start";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAdminAccess, unlockAdmin } from "@/lib/admin-access.functions";

export function AdminPasswordGate({ children }: { children: React.ReactNode }) {
  const checkAccess = useServerFn(getAdminAccess);
  const unlock = useServerFn(unlockAdmin);
  const [unlocked, setUnlocked] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  useEffect(() => { void checkAccess().then((result) => setUnlocked(result.unlocked)).catch(() => setUnlocked(false)); }, [checkAccess]);
  if (unlocked === null) return <div className="grid min-h-screen place-items-center bg-stage text-sm text-primary-foreground">Checking creator access…</div>;
  if (!unlocked) {
    const submit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const result = await unlock({ data: { password } });
      if (result.ok) { setUnlocked(true); setPassword(""); setError(false); } else setError(true);
    };
    return <div className="grid min-h-screen place-items-center bg-stage px-4"><form onSubmit={submit} className="w-full max-w-md space-y-5 rounded-3xl border border-border bg-card p-8 shadow-pop"><div><p className="text-xs font-bold uppercase tracking-widest text-highlight">SPARKFAN creator access</p><h1 className="mt-2 text-3xl">Private workspace</h1><p className="mt-2 text-sm text-muted-foreground">Unlock the creator dashboard to draft campaigns and manage live fan experiences.</p></div><Input autoFocus type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Admin password" autoComplete="current-password" />{error && <p role="alert" className="text-sm font-semibold text-destructive">That password is not correct.</p>}<Button type="submit" className="w-full rounded-full font-bold">Unlock creator dashboard</Button></form></div>;
  }
  return <>{children}</>;
}