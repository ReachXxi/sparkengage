import celebDavido from "@/assets/celeb-davido.jpg.asset.json";
import celebMayorkun from "@/assets/celeb-mayorkun.jpg.asset.json";
import celebBurna from "@/assets/celeb-burnaboy.jpg.asset.json";
import celebAsake from "@/assets/celeb-asake.jpg.asset.json";
import celebAyra from "@/assets/celeb-ayrastarr.jpg.asset.json";
import celebTiwa from "@/assets/celeb-tiwasavage.jpg.asset.json";

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

export type Plan = "Basic" | "Pro" | "Enterprise";
export type MemberRole = "Owner" | "Admin" | "Editor" | "Analyst";

export type Member = {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
};

export type Tenant = {
  id: string;
  name: string;
  slug: string;
  industry: string;
  plan: Plan;
  emoji: string;
  members: Member[];
  createdAt: string;
};

export type CampaignStatus = "live" | "draft" | "scheduled" | "ended";

export type AdminCampaign = {
  id: string;
  tenantId: string;
  name: string;
  type: string;
  status: CampaignStatus;
  startsAt: string;
  endsAt: string;
  modules: string[];
  points: { label: string; value: number }[];
  prize: string;
  copy: string;
  participants: number;
  actions: number;
  pointsIssued: number;
  verification: number;
  /** Public fan-facing campaign id, when it maps to a live experience. */
  publicId?: string;
};

export type RewardStatus = "active" | "paused" | "sold-out";

export type AdminReward = {
  id: string;
  tenantId: string;
  campaignId: string | null;
  title: string;
  category: string;
  emoji: string;
  cost: number;
  stock: number;
  claimed: number;
  status: RewardStatus;
};

export type SurveyQuestionKind = "text" | "number" | "image";

export type SurveyQuestion = {
  id: string;
  kind: SurveyQuestionKind;
  prompt: string;
  required: boolean;
  /** number questions */
  min?: number;
  max?: number;
  unit?: string;
  /** image questions */
  options?: { id: string; label: string; image: string }[];
  points: number;
};

export type Survey = {
  id: string;
  tenantId: string;
  campaignId: string;
  title: string;
  description: string;
  status: "open" | "closed";
  questions: SurveyQuestion[];
};

export type SurveyAnswer = { questionId: string; value: string | number };

export type SurveyResponse = {
  id: string;
  surveyId: string;
  tenantId: string;
  fan: string;
  city: string;
  at: string;
  answers: SurveyAnswer[];
};

export type QuizResult = {
  id: string;
  tenantId: string;
  campaignId: string;
  fan: string;
  score: number;
  total: number;
  seconds: number;
  at: string;
};

export type GameResult = {
  id: string;
  tenantId: string;
  campaignId: string;
  fan: string;
  game: "Unscramble the Lyrics" | "4 Pics 1 Word" | "Guess the Celeb";
  rounds: number;
  won: number;
  points: number;
  at: string;
};

export type Engager = {
  id: string;
  tenantId: string;
  fan: string;
  city: string;
  points: number;
  actions: number;
  streak: number;
  referrals: number;
};

/* ------------------------------------------------------------------ */
/* Deterministic pseudo-random helpers (stable across SSR + client)   */
/* ------------------------------------------------------------------ */

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const FAN_NAMES = [
  "Ada Obi", "Tunde Bello", "Zainab Musa", "Chidi Eze", "Fola Adeyemi", "Nneka Okafor",
  "Kwame Mensah", "Amaka Nwosu", "Seyi Alabi", "Hauwa Bello", "Emeka Udo", "Bisi Ogun",
  "Kelechi Ani", "Yemi Sanni", "Oma Briggs", "Dami Ojo", "Sade Balogun", "Ifeanyi Nnaji",
  "Rukky Peters", "Tobi Salami", "Chisom Ike", "Lami Yusuf", "Gozie Umeh", "Peace Etim",
  "Jide Coker", "Nkem Anya", "Segun Fadeyi", "Halima Sule", "Uche Kalu", "Bola Adigun",
];

const CITIES = ["Lagos", "Abuja", "Accra", "Port Harcourt", "Ibadan", "Nairobi", "London", "Atlanta"];

const IMAGE_BANK = [
  { id: "img-davido", label: "Davido", image: celebDavido.url },
  { id: "img-mayorkun", label: "Mayorkun", image: celebMayorkun.url },
  { id: "img-burna", label: "Burna Boy", image: celebBurna.url },
  { id: "img-asake", label: "Asake", image: celebAsake.url },
  { id: "img-ayra", label: "Ayra Starr", image: celebAyra.url },
  { id: "img-tiwa", label: "Tiwa Savage", image: celebTiwa.url },
];

export const imageOptionBank = IMAGE_BANK;

/* ------------------------------------------------------------------ */
/* Seed data                                                          */
/* ------------------------------------------------------------------ */

export const seedTenants: Tenant[] = [
  {
    id: "t-dmw",
    name: "DMW / ORIADÉ",
    slug: "dmw",
    industry: "Music",
    plan: "Enterprise",
    emoji: "🎤",
    createdAt: "2026-05-02",
    members: [
      { id: "m1", name: "Asa Bello", email: "asa@dmw.africa", role: "Owner" },
      { id: "m2", name: "Kunle Ade", email: "kunle@dmw.africa", role: "Admin" },
      { id: "m3", name: "Zara Okoh", email: "zara@dmw.africa", role: "Analyst" },
    ],
  },
  {
    id: "t-sunbeam",
    name: "Sunbeam Studios",
    slug: "sunbeam",
    industry: "Film & TV",
    plan: "Pro",
    emoji: "🎬",
    createdAt: "2026-06-11",
    members: [
      { id: "m4", name: "Ify Nduka", email: "ify@sunbeam.tv", role: "Owner" },
      { id: "m5", name: "Dapo Ige", email: "dapo@sunbeam.tv", role: "Editor" },
    ],
  },
  {
    id: "t-gbedu",
    name: "Gbedu Live Events",
    slug: "gbedu-live",
    industry: "Live Events",
    plan: "Basic",
    emoji: "🎟️",
    createdAt: "2026-07-01",
    members: [{ id: "m6", name: "Tola Ray", email: "tola@gbedu.live", role: "Owner" }],
  },
];

export const seedCampaigns: AdminCampaign[] = [
  {
    id: "c-oriade",
    tenantId: "t-dmw",
    name: "ORIADÉ — 15 Years of OBO",
    type: "Album Launch",
    status: "live",
    startsAt: "2026-07-31",
    endsAt: "2026-08-14",
    modules: ["Stream", "Quiz", "Unscramble the Lyrics", "4 Pics 1 Word", "Guess the Celeb", "Social Tasks", "Survey"],
    points: [
      { label: "Stream a track", value: 10 },
      { label: "Correct quiz answer", value: 15 },
      { label: "Unscramble solved", value: 25 },
      { label: "Social action verified", value: 25 },
      { label: "Survey completed", value: 40 },
    ],
    prize: "Top 100 win signed ORIADÉ art · Top 3 win studio session invites",
    copy: "ORIADÉ is here. Stream it, play the games, drag your friends in and climb the board before the timer runs out.",
    participants: 18420,
    actions: 96310,
    pointsIssued: 1428900,
    verification: 96.4,
    publicId: "oriade-album",
  },
  {
    id: "c-deluxe",
    tenantId: "t-dmw",
    name: "ORIADÉ Deluxe Countdown",
    type: "Album Launch",
    status: "scheduled",
    startsAt: "2026-09-05",
    endsAt: "2026-09-12",
    modules: ["Stream", "Quiz", "Social Tasks"],
    points: [
      { label: "Stream a deluxe track", value: 12 },
      { label: "Correct quiz answer", value: 15 },
    ],
    prize: "Deluxe early access for the top 500",
    copy: "Four new records. Seven days. Points double on day one.",
    participants: 0,
    actions: 0,
    pointsIssued: 0,
    verification: 0,
  },
  {
    id: "c-owambe",
    tenantId: "t-sunbeam",
    name: "Owambe Nights — Premiere Week",
    type: "Movie Premiere",
    status: "live",
    startsAt: "2026-07-20",
    endsAt: "2026-08-06",
    modules: ["Trailer", "Quiz", "4 Pics 1 Word", "Guess the Celeb", "Social Tasks", "Survey"],
    points: [
      { label: "Watch the trailer", value: 10 },
      { label: "Correct quiz answer", value: 15 },
      { label: "Social action verified", value: 20 },
    ],
    prize: "20 pairs of Lagos premiere tickets",
    copy: "Watch the trailer, survive the Nollywood trivia, win premiere tickets in Lagos.",
    participants: 6240,
    actions: 22180,
    pointsIssued: 341200,
    verification: 94.1,
    publicId: "nollywood-premiere",
  },
  {
    id: "c-detty",
    tenantId: "t-gbedu",
    name: "Detty December Countdown",
    type: "Event Series",
    status: "live",
    startsAt: "2026-07-01",
    endsAt: "2026-12-20",
    modules: ["Quiz", "Unscramble the Lyrics", "Social Tasks", "Survey"],
    points: [
      { label: "Correct quiz answer", value: 15 },
      { label: "Unscramble solved", value: 20 },
      { label: "Referral joined", value: 50 },
    ],
    prize: "Concert entries all December",
    copy: "Every week a new game. Every month a new ticket giveaway.",
    participants: 9110,
    actions: 30440,
    pointsIssued: 512300,
    verification: 92.8,
    publicId: "detty-december",
  },
  {
    id: "c-archive",
    tenantId: "t-dmw",
    name: "Timeless Anniversary Replay",
    type: "Album Launch",
    status: "ended",
    startsAt: "2026-03-01",
    endsAt: "2026-03-15",
    modules: ["Stream", "Quiz", "Social Tasks"],
    points: [{ label: "Stream a track", value: 10 }],
    prize: "Merch drops for the top 50",
    copy: "Two weeks of Timeless nostalgia.",
    participants: 12080,
    actions: 41220,
    pointsIssued: 604100,
    verification: 95.2,
  },
];

export const seedRewards: AdminReward[] = [
  { id: "rw1", tenantId: "t-dmw", campaignId: "c-oriade", title: "Signed ORIADÉ Cover Art", category: "Exclusive", emoji: "🖼️", cost: 500, stock: 500, claimed: 318, status: "active" },
  { id: "rw2", tenantId: "t-dmw", campaignId: "c-oriade", title: "ORIADÉ Deluxe Early Access", category: "Music", emoji: "🎵", cost: 300, stock: 9999, claimed: 2140, status: "active" },
  { id: "rw3", tenantId: "t-dmw", campaignId: "c-oriade", title: "Studio Session Invite", category: "Experience", emoji: "🎚️", cost: 6000, stock: 3, claimed: 3, status: "sold-out" },
  { id: "rw4", tenantId: "t-dmw", campaignId: null, title: "SPARKFAN Snapback", category: "Merch", emoji: "🧢", cost: 1200, stock: 40, claimed: 12, status: "active" },
  { id: "rw5", tenantId: "t-sunbeam", campaignId: "c-owambe", title: "Premiere Ticket (x2)", category: "Events", emoji: "🎟️", cost: 2500, stock: 20, claimed: 14, status: "active" },
  { id: "rw6", tenantId: "t-sunbeam", campaignId: "c-owambe", title: "Cast Video Call", category: "Experience", emoji: "📞", cost: 4000, stock: 5, claimed: 1, status: "paused" },
  { id: "rw7", tenantId: "t-gbedu", campaignId: "c-detty", title: "Detty December Entry", category: "Events", emoji: "🍾", cost: 900, stock: 120, claimed: 61, status: "active" },
  { id: "rw8", tenantId: "t-gbedu", campaignId: "c-detty", title: "Airtime Top-up ₦2,000", category: "Utility", emoji: "📱", cost: 400, stock: 300, claimed: 187, status: "active" },
];

export const seedSurveys: Survey[] = [
  {
    id: "sv-oriade",
    tenantId: "t-dmw",
    campaignId: "c-oriade",
    title: "ORIADÉ listening survey",
    description: "Which records are landing, and how hard? Feeds the deluxe tracklist decision.",
    status: "open",
    questions: [
      { id: "q1", kind: "image", prompt: "Which collaborator should headline the deluxe?", required: true, points: 15, options: IMAGE_BANK.slice(0, 4) },
      { id: "q2", kind: "number", prompt: "How many times have you played the album front to back?", required: true, min: 0, max: 50, unit: "plays", points: 10 },
      { id: "q3", kind: "text", prompt: "One line: what does ORIADÉ mean to you?", required: false, points: 15 },
      { id: "q4", kind: "number", prompt: "Rate the album out of 10", required: true, min: 1, max: 10, unit: "/10", points: 10 },
    ],
  },
  {
    id: "sv-owambe",
    tenantId: "t-sunbeam",
    campaignId: "c-owambe",
    title: "Premiere week intent survey",
    description: "Sizing the Lagos turnout and the second-city rollout.",
    status: "open",
    questions: [
      { id: "q1", kind: "image", prompt: "Which poster makes you want to watch?", required: true, points: 15, options: IMAGE_BANK.slice(2, 5) },
      { id: "q2", kind: "number", prompt: "How many friends are you bringing?", required: true, min: 0, max: 10, unit: "people", points: 10 },
      { id: "q3", kind: "text", prompt: "Which city should we premiere in next?", required: true, points: 10 },
    ],
  },
];

const TEXT_ANSWERS_ORIADE = [
  "Fifteen years and he still sounds hungry. Album of the year.",
  "Ori + Adé — my crown is coming too. This one is personal.",
  "The 3-Step records are the whole reason I stream at night.",
  "My Light with Llona made me call my mum.",
  "Too many features but I forgive him, Amazing Grace is a monster.",
  "Gimme Dat Ting is the owambe song of the year, no debate.",
];
const TEXT_ANSWERS_OWAMBE = ["Abuja", "Accra", "Port Harcourt", "Ibadan", "Nairobi", "Lagos again"];

function makeResponses(survey: Survey, count: number, seed: number): SurveyResponse[] {
  const rnd = seeded(seed);
  const texts = survey.id === "sv-oriade" ? TEXT_ANSWERS_ORIADE : TEXT_ANSWERS_OWAMBE;
  return Array.from({ length: count }, (_, i) => {
    const fan = FAN_NAMES[Math.floor(rnd() * FAN_NAMES.length)]!;
    const city = CITIES[Math.floor(rnd() * CITIES.length)]!;
    const answers: SurveyAnswer[] = survey.questions.map((q) => {
      if (q.kind === "image") {
        const opts = q.options ?? [];
        return { questionId: q.id, value: opts[Math.floor(rnd() * opts.length)]?.id ?? "" };
      }
      if (q.kind === "number") {
        const min = q.min ?? 0;
        const max = q.max ?? 10;
        return { questionId: q.id, value: min + Math.floor(rnd() * (max - min + 1)) };
      }
      return { questionId: q.id, value: texts[Math.floor(rnd() * texts.length)]! };
    });
    const day = 1 + Math.floor(rnd() * 3);
    return {
      id: `${survey.id}-r${i + 1}`,
      surveyId: survey.id,
      tenantId: survey.tenantId,
      fan,
      city,
      at: `2026-08-0${day}T${String(8 + Math.floor(rnd() * 12)).padStart(2, "0")}:${String(Math.floor(rnd() * 60)).padStart(2, "0")}:00Z`,
      answers,
    };
  });
}

export const seedResponses: SurveyResponse[] = [
  ...makeResponses(seedSurveys[0]!, 42, 7),
  ...makeResponses(seedSurveys[1]!, 24, 19),
];

function makeQuizResults(): QuizResult[] {
  const rnd = seeded(31);
  const pairs: { tenantId: string; campaignId: string; total: number }[] = [
    { tenantId: "t-dmw", campaignId: "c-oriade", total: 12 },
    { tenantId: "t-sunbeam", campaignId: "c-owambe", total: 10 },
    { tenantId: "t-gbedu", campaignId: "c-detty", total: 8 },
  ];
  const out: QuizResult[] = [];
  pairs.forEach((p, pi) => {
    for (let i = 0; i < 22; i++) {
      const score = Math.max(2, Math.round(p.total * (0.45 + rnd() * 0.55)));
      out.push({
        id: `qr-${pi}-${i}`,
        tenantId: p.tenantId,
        campaignId: p.campaignId,
        fan: FAN_NAMES[Math.floor(rnd() * FAN_NAMES.length)]!,
        score,
        total: p.total,
        seconds: 45 + Math.floor(rnd() * 180),
        at: `2026-08-0${1 + Math.floor(rnd() * 3)}T1${Math.floor(rnd() * 9)}:0${Math.floor(rnd() * 9)}:00Z`,
      });
    }
  });
  return out;
}

export const seedQuizResults: QuizResult[] = makeQuizResults();

function makeGameResults(): GameResult[] {
  const rnd = seeded(53);
  const games: GameResult["game"][] = ["Unscramble the Lyrics", "4 Pics 1 Word", "Guess the Celeb"];
  const pairs = [
    { tenantId: "t-dmw", campaignId: "c-oriade" },
    { tenantId: "t-sunbeam", campaignId: "c-owambe" },
    { tenantId: "t-gbedu", campaignId: "c-detty" },
  ];
  const out: GameResult[] = [];
  pairs.forEach((p, pi) => {
    for (let i = 0; i < 24; i++) {
      const rounds = 3 + Math.floor(rnd() * 3);
      const won = Math.max(1, Math.round(rounds * (0.4 + rnd() * 0.6)));
      out.push({
        id: `gr-${pi}-${i}`,
        tenantId: p.tenantId,
        campaignId: p.campaignId,
        fan: FAN_NAMES[Math.floor(rnd() * FAN_NAMES.length)]!,
        game: games[Math.floor(rnd() * games.length)]!,
        rounds,
        won,
        points: won * 25,
        at: `2026-08-0${1 + Math.floor(rnd() * 3)}T0${Math.floor(rnd() * 9)}:1${Math.floor(rnd() * 9)}:00Z`,
      });
    }
  });
  return out;
}

export const seedGameResults: GameResult[] = makeGameResults();

function makeEngagers(): Engager[] {
  const rnd = seeded(97);
  const tenants = ["t-dmw", "t-sunbeam", "t-gbedu"];
  const out: Engager[] = [];
  tenants.forEach((tenantId, ti) => {
    const used = new Set<string>();
    for (let i = 0; i < 24; i++) {
      let fan = FAN_NAMES[Math.floor(rnd() * FAN_NAMES.length)]!;
      while (used.has(fan)) fan = FAN_NAMES[(FAN_NAMES.indexOf(fan) + 1) % FAN_NAMES.length]!;
      used.add(fan);
      out.push({
        id: `e-${ti}-${i}`,
        tenantId,
        fan,
        city: CITIES[Math.floor(rnd() * CITIES.length)]!,
        points: 900 + Math.floor(rnd() * 14000),
        actions: 20 + Math.floor(rnd() * 320),
        streak: 1 + Math.floor(rnd() * 21),
        referrals: Math.floor(rnd() * 18),
      });
    }
  });
  return out.sort((a, b) => b.points - a.points);
}

export const seedEngagers: Engager[] = makeEngagers();

/** 14-day activity series per tenant, deterministic. */
export function activitySeries(tenantId: string) {
  const rnd = seeded(tenantId.length * 811 + 13);
  return Array.from({ length: 14 }, (_, i) => {
    const base = 400 + Math.floor(rnd() * 900);
    return {
      day: `Jul ${21 + i > 31 ? 21 + i - 31 : 21 + i}`,
      joins: base,
      actions: Math.round(base * (2.4 + rnd())),
      points: Math.round(base * (18 + rnd() * 12)),
    };
  });
}

export const moduleLabels = [
  "Stream",
  "Trailer",
  "Quiz",
  "Unscramble the Lyrics",
  "4 Pics 1 Word",
  "Guess the Celeb",
  "Social Tasks",
  "Survey",
  "Spin the Wheel",
] as const;

export const rewardCategories = ["Exclusive", "Merch", "Music", "Events", "Experience", "Utility", "Airtime"] as const;
