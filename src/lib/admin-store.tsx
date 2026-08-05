import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  activities as seedActivities,
  adjustments as seedAdjustments,
  campaigns as seedCampaigns,
  celebrities,
  gameResults,
  logs as seedLogs,
  quizQuestions,
  quizResults,
  rewards as seedRewards,
  socialTasks as seedSocialTasks,
  streams as seedStreams,
  submissions as seedSubmissions,
  surveyResponses,
  surveys as seedSurveys,
  tenants,
  users as seedUsers,
  type Activity,
  type Adjustment,
  type Campaign,
  type ConsoleUser,
  type LogEntry,
  type Reward,
  type Stream,
  type Submission,
  type Survey,
  type SurveyQuestion,
  type Tenant,
} from "@/data/console";

const uid = (p: string) => `${p}-${Math.random().toString(36).slice(2, 8)}`;
const nowISO = () => new Date().toISOString();

type State = {
  tenantId: string;
  campaigns: Campaign[];
  rewards: Reward[];
  surveys: Survey[];
  activities: Activity[];
  streams: Stream[];
  submissions: Submission[];
  users: ConsoleUser[];
  adjustments: Adjustment[];
  logs: LogEntry[];
  liveTick: number;
};

type Ctx = {
  tenant: Tenant;
  tenants: Tenant[];
  setTenant: (id: string) => void;
  state: State;
  /** tenant-scoped selectors */
  campaigns: Campaign[];
  rewards: Reward[];
  surveys: Survey[];
  activities: Activity[];
  streams: Stream[];
  submissions: Submission[];
  users: ConsoleUser[];
  adjustments: Adjustment[];
  logs: LogEntry[];
  responses: typeof surveyResponses;
  quizResults: typeof quizResults;
  gameResults: typeof gameResults;
  quizQuestions: typeof quizQuestions;
  celebrities: typeof celebrities;
  leaderboard: (ConsoleUser & { rank: number; badge: string; live: number })[];
  actions: {
    log: (action: string, target: string, severity?: LogEntry["severity"]) => void;
    saveCampaign: (c: Campaign) => void;
    deleteCampaign: (id: string) => void;
    setCampaignStatus: (id: string, status: Campaign["status"]) => void;
    saveReward: (r: Reward) => void;
    deleteReward: (id: string) => void;
    toggleReward: (id: string) => void;
    redeemReward: (id: string) => void;
    saveSurvey: (s: Survey) => void;
    deleteSurvey: (id: string) => void;
    reorderQuestions: (surveyId: string, from: number, to: number) => void;
    saveQuestion: (surveyId: string, q: SurveyQuestion) => void;
    deleteQuestion: (surveyId: string, qid: string) => void;
    toggleActivity: (id: string) => void;
    saveActivity: (a: Activity) => void;
    saveStream: (s: Stream) => void;
    setStreamStatus: (id: string, status: Stream["status"]) => void;
    reviewSubmission: (id: string, status: Submission["status"]) => void;
    bulkReview: (taskId: string, status: Submission["status"]) => void;
    adjustPoints: (userId: string, delta: number, reason: string) => void;
    setUserStatus: (id: string, status: ConsoleUser["status"]) => void;
  };
};

const AdminContext = createContext<Ctx | null>(null);

const initialState: State = {
  tenantId: tenants[0]!.id,
  campaigns: seedCampaigns,
  rewards: seedRewards,
  surveys: seedSurveys,
  activities: seedActivities,
  streams: seedStreams,
  submissions: seedSubmissions,
  users: seedUsers,
  adjustments: seedAdjustments,
  logs: seedLogs,
  liveTick: 0,
};

function badgeFor(rank: number) {
  if (rank === 1) return "👑 Champion";
  if (rank <= 3) return "🥇 Podium";
  if (rank <= 10) return "🔥 Top 10";
  if (rank <= 25) return "⭐ Top 25";
  return "🎧 Fan";
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initialState);
  const [actor] = useState("Asa Bello");

  // real-time leaderboard drift
  useEffect(() => {
    const t = setInterval(() => setState((s) => ({ ...s, liveTick: s.liveTick + 1 })), 4000);
    return () => clearInterval(t);
  }, []);

  const tenant = useMemo(
    () => tenants.find((t) => t.id === state.tenantId) ?? tenants[0]!,
    [state.tenantId],
  );

  const log = useCallback(
    (action: string, target: string, severity: LogEntry["severity"] = "info") => {
      setState((s) => ({
        ...s,
        logs: [
          { id: uid("l"), tenantId: s.tenantId, at: nowISO(), actor, action, target, severity },
          ...s.logs,
        ],
      }));
    },
    [actor],
  );

  const actions = useMemo<Ctx["actions"]>(
    () => ({
      log,
      setCampaignStatus: (id, status) => {
        setState((s) => ({
          ...s,
          campaigns: s.campaigns.map((c) => (c.id === id ? { ...c, status } : c)),
        }));
      },
      saveCampaign: (c) => {
        setState((s) => ({
          ...s,
          campaigns: s.campaigns.some((x) => x.id === c.id)
            ? s.campaigns.map((x) => (x.id === c.id ? c : x))
            : [c, ...s.campaigns],
        }));
      },
      deleteCampaign: (id) =>
        setState((s) => ({ ...s, campaigns: s.campaigns.filter((c) => c.id !== id) })),
      saveReward: (r) =>
        setState((s) => ({
          ...s,
          rewards: s.rewards.some((x) => x.id === r.id)
            ? s.rewards.map((x) => (x.id === r.id ? r : x))
            : [r, ...s.rewards],
        })),
      deleteReward: (id) => setState((s) => ({ ...s, rewards: s.rewards.filter((r) => r.id !== id) })),
      toggleReward: (id) =>
        setState((s) => ({
          ...s,
          rewards: s.rewards.map((r) =>
            r.id === id ? { ...r, status: r.status === "active" ? "inactive" : "active" } : r,
          ),
        })),
      redeemReward: (id) =>
        setState((s) => ({
          ...s,
          rewards: s.rewards.map((r) =>
            r.id === id ? { ...r, redeemed: Math.min(r.quantity, r.redeemed + 1) } : r,
          ),
        })),
      saveSurvey: (sv) =>
        setState((s) => ({
          ...s,
          surveys: s.surveys.some((x) => x.id === sv.id)
            ? s.surveys.map((x) => (x.id === sv.id ? sv : x))
            : [sv, ...s.surveys],
        })),
      deleteSurvey: (id) => setState((s) => ({ ...s, surveys: s.surveys.filter((x) => x.id !== id) })),
      reorderQuestions: (surveyId, from, to) =>
        setState((s) => ({
          ...s,
          surveys: s.surveys.map((sv) => {
            if (sv.id !== surveyId) return sv;
            const qs = [...sv.questions];
            const [moved] = qs.splice(from, 1);
            if (!moved) return sv;
            qs.splice(to, 0, moved);
            return { ...sv, questions: qs };
          }),
        })),
      saveQuestion: (surveyId, q) =>
        setState((s) => ({
          ...s,
          surveys: s.surveys.map((sv) =>
            sv.id === surveyId
              ? {
                  ...sv,
                  questions: sv.questions.some((x) => x.id === q.id)
                    ? sv.questions.map((x) => (x.id === q.id ? q : x))
                    : [...sv.questions, q],
                }
              : sv,
          ),
        })),
      deleteQuestion: (surveyId, qid) =>
        setState((s) => ({
          ...s,
          surveys: s.surveys.map((sv) =>
            sv.id === surveyId ? { ...sv, questions: sv.questions.filter((q) => q.id !== qid) } : sv,
          ),
        })),
      toggleActivity: (id) =>
        setState((s) => ({
          ...s,
          activities: s.activities.map((a) =>
            a.id === id ? { ...a, status: a.status === "active" ? "paused" : "active" } : a,
          ),
        })),
      saveActivity: (a) =>
        setState((s) => ({
          ...s,
          activities: s.activities.some((x) => x.id === a.id)
            ? s.activities.map((x) => (x.id === a.id ? a : x))
            : [a, ...s.activities],
        })),
      saveStream: (st) =>
        setState((s) => ({
          ...s,
          streams: s.streams.some((x) => x.id === st.id)
            ? s.streams.map((x) => (x.id === st.id ? st : x))
            : [st, ...s.streams],
        })),
      setStreamStatus: (id, status) =>
        setState((s) => ({
          ...s,
          streams: s.streams.map((x) => (x.id === id ? { ...x, status } : x)),
        })),
      reviewSubmission: (id, status) =>
        setState((s) => ({
          ...s,
          submissions: s.submissions.map((x) => (x.id === id ? { ...x, status } : x)),
        })),
      bulkReview: (taskId, status) =>
        setState((s) => ({
          ...s,
          submissions: s.submissions.map((x) =>
            x.taskId === taskId && x.status === "pending" ? { ...x, status } : x,
          ),
        })),
      adjustPoints: (userId, delta, reason) =>
        setState((s) => {
          const user = s.users.find((u) => u.id === userId);
          if (!user) return s;
          return {
            ...s,
            users: s.users
              .map((u) => (u.id === userId ? { ...u, points: Math.max(0, u.points + delta) } : u))
              .sort((a, b) => b.points - a.points),
            adjustments: [
              {
                id: uid("adj"),
                tenantId: s.tenantId,
                userId,
                fan: user.name,
                delta,
                reason,
                by: actor,
                at: nowISO(),
              },
              ...s.adjustments,
            ],
            logs: [
              {
                id: uid("l"),
                tenantId: s.tenantId,
                at: nowISO(),
                actor,
                action: "Adjusted points",
                target: `${user.name} ${delta > 0 ? "+" : ""}${delta}`,
                severity: "warning" as const,
              },
              ...s.logs,
            ],
          };
        }),
      setUserStatus: (id, status) =>
        setState((s) => ({ ...s, users: s.users.map((u) => (u.id === id ? { ...u, status } : u)) })),
    }),
    [actor, log],
  );

  const setTenant = useCallback((id: string) => setState((s) => ({ ...s, tenantId: id })), []);

  const t = state.tenantId;
  const scopedUsers = useMemo(() => state.users.filter((u) => u.tenantId === t), [state.users, t]);

  const leaderboard = useMemo(() => {
    // deterministic-but-moving live delta driven by the tick
    return scopedUsers
      .map((u, i) => ({
        ...u,
        live: ((state.liveTick * 7 + i * 13) % 40) - 8,
      }))
      .map((u) => ({ ...u, points: Math.max(0, u.points + Math.max(0, u.live)) }))
      .sort((a, b) => b.points - a.points)
      .map((u, i) => ({ ...u, rank: i + 1, badge: badgeFor(i + 1) }));
  }, [scopedUsers, state.liveTick]);

  const value: Ctx = {
    tenant,
    tenants,
    setTenant,
    state,
    campaigns: state.campaigns.filter((c) => c.tenantId === t),
    rewards: state.rewards.filter((r) => r.tenantId === t),
    surveys: state.surveys.filter((s) => s.tenantId === t),
    activities: state.activities.filter((a) => a.tenantId === t),
    streams: state.streams.filter((s) => s.tenantId === t),
    submissions: state.submissions.filter((s) => s.tenantId === t),
    users: scopedUsers,
    adjustments: state.adjustments.filter((a) => a.tenantId === t),
    logs: state.logs.filter((l) => l.tenantId === t),
    responses: surveyResponses.filter((r) => r.tenantId === t),
    quizResults: quizResults.filter((r) => r.tenantId === t),
    gameResults: gameResults.filter((r) => r.tenantId === t),
    quizQuestions,
    celebrities,
    leaderboard,
    actions,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used inside <AdminProvider>");
  return ctx;
}

/* ------------------------------------------------------------------ */
/* Social tasks are static per tenant                                  */
/* ------------------------------------------------------------------ */

export function tenantSocialTasks(tenantId: string) {
  return seedSocialTasks.filter((s) => s.tenantId === tenantId);
}
