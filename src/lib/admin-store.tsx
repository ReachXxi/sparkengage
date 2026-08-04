import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  activitySeries,
  seedCampaigns,
  seedEngagers,
  seedGameResults,
  seedQuizResults,
  seedResponses,
  seedRewards,
  seedSurveys,
  seedTenants,
  type AdminCampaign,
  type AdminReward,
  type Engager,
  type GameResult,
  type QuizResult,
  type Survey,
  type SurveyResponse,
  type Tenant,
} from "@/data/admin";

type AdminState = {
  tenants: Tenant[];
  tenantId: string;
  campaigns: AdminCampaign[];
  rewards: AdminReward[];
  surveys: Survey[];
  responses: SurveyResponse[];
  quizResults: QuizResult[];
  gameResults: GameResult[];
  engagers: Engager[];
};

type AdminContextValue = {
  state: AdminState;
  tenant: Tenant;
  /** Everything below is already scoped to the active tenant. */
  campaigns: AdminCampaign[];
  rewards: AdminReward[];
  surveys: Survey[];
  responses: SurveyResponse[];
  quizResults: QuizResult[];
  gameResults: GameResult[];
  engagers: Engager[];
  activity: ReturnType<typeof activitySeries>;
  setTenant: (id: string) => void;
  addTenant: (t: Omit<Tenant, "id" | "members" | "createdAt">) => void;
  addCampaign: (c: Omit<AdminCampaign, "id" | "tenantId" | "participants" | "actions" | "pointsIssued" | "verification">) => string;
  updateCampaign: (id: string, patch: Partial<AdminCampaign>) => void;
  addReward: (r: Omit<AdminReward, "id" | "tenantId" | "claimed" | "status">) => void;
  updateReward: (id: string, patch: Partial<AdminReward>) => void;
  addSurvey: (s: Omit<Survey, "id" | "tenantId" | "status">) => void;
  updateSurvey: (id: string, patch: Partial<Survey>) => void;
};

const AdminContext = createContext<AdminContextValue | null>(null);

let counter = 0;
const uid = (p: string) => `${p}-${Date.now().toString(36)}-${++counter}`;

export function AdminProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AdminState>({
    tenants: seedTenants,
    tenantId: seedTenants[0]!.id,
    campaigns: seedCampaigns,
    rewards: seedRewards,
    surveys: seedSurveys,
    responses: seedResponses,
    quizResults: seedQuizResults,
    gameResults: seedGameResults,
    engagers: seedEngagers,
  });

  const value = useMemo<AdminContextValue>(() => {
    const tenant = state.tenants.find((t) => t.id === state.tenantId) ?? state.tenants[0]!;
    const scope = <T extends { tenantId: string }>(rows: T[]) => rows.filter((r) => r.tenantId === tenant.id);

    return {
      state,
      tenant,
      campaigns: scope(state.campaigns),
      rewards: scope(state.rewards),
      surveys: scope(state.surveys),
      responses: scope(state.responses),
      quizResults: scope(state.quizResults),
      gameResults: scope(state.gameResults),
      engagers: scope(state.engagers),
      activity: activitySeries(tenant.id),
      setTenant: (id) => setState((s) => ({ ...s, tenantId: id })),
      addTenant: (t) =>
        setState((s) => {
          const id = uid("t");
          return {
            ...s,
            tenantId: id,
            tenants: [
              ...s.tenants,
              {
                ...t,
                id,
                members: [{ id: uid("m"), name: "You", email: `owner@${t.slug}.com`, role: "Owner" }],
                createdAt: new Date().toISOString().slice(0, 10),
              },
            ],
          };
        }),
      addCampaign: (c) => {
        const id = uid("c");
        setState((s) => ({
          ...s,
          campaigns: [
            { ...c, id, tenantId: s.tenantId, participants: 0, actions: 0, pointsIssued: 0, verification: 0 },
            ...s.campaigns,
          ],
        }));
        return id;
      },
      updateCampaign: (id, patch) =>
        setState((s) => ({ ...s, campaigns: s.campaigns.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),
      addReward: (r) =>
        setState((s) => ({
          ...s,
          rewards: [{ ...r, id: uid("rw"), tenantId: s.tenantId, claimed: 0, status: "active" }, ...s.rewards],
        })),
      updateReward: (id, patch) =>
        setState((s) => ({ ...s, rewards: s.rewards.map((r) => (r.id === id ? { ...r, ...patch } : r)) })),
      addSurvey: (sv) =>
        setState((s) => ({
          ...s,
          surveys: [{ ...sv, id: uid("sv"), tenantId: s.tenantId, status: "open" }, ...s.surveys],
        })),
      updateSurvey: (id, patch) =>
        setState((s) => ({ ...s, surveys: s.surveys.map((sv) => (sv.id === id ? { ...sv, ...patch } : sv)) })),
    };
  }, [state]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside <AdminProvider>");
  return ctx;
}
