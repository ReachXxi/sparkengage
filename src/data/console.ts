/**
 * SPARKFAN creator console — full multi-tenant seed dataset.
 * Everything here is deterministic so SSR and the client agree.
 */

import celebDavido from "@/assets/celeb-davido.jpg.asset.json";
import celebMayorkun from "@/assets/celeb-mayorkun.jpg.asset.json";
import celebBurna from "@/assets/celeb-burnaboy.jpg.asset.json";
import celebAsake from "@/assets/celeb-asake.jpg.asset.json";
import celebAyra from "@/assets/celeb-ayrastarr.jpg.asset.json";
import celebTiwa from "@/assets/celeb-tiwasavage.jpg.asset.json";
import celebRema from "@/assets/celeb-rema.jpg.asset.json";
import celebSherif from "@/assets/celeb-blacksherif.jpg.asset.json";
import celebAya from "@/assets/celeb-ayanakamura.jpg.asset.json";

/* ------------------------------------------------------------------ */
/* Deterministic RNG                                                   */
/* ------------------------------------------------------------------ */

export function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const pick = <T,>(arr: readonly T[], r: number) => arr[Math.floor(r * arr.length)]!;

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type Plan = "Starter" | "Pro" | "Enterprise";
export type MemberRole = "Owner" | "Admin" | "Editor" | "Analyst";

export type Tenant = {
  id: string;
  name: string;
  slug: string;
  industry: string;
  plan: Plan;
  emoji: string;
  createdAt: string;
  members: { id: string; name: string; email: string; role: MemberRole }[];
};

export type CampaignKind = "album" | "movie" | "book";
export type CampaignStatus = "live" | "draft" | "scheduled" | "ended";

export type PointRule = { id: string; label: string; value: number; cap: number };

export type Campaign = {
  id: string;
  tenantId: string;
  name: string;
  kind: CampaignKind;
  status: CampaignStatus;
  description: string;
  cover: string;
  startsAt: string;
  endsAt: string;
  creator: string;
  genre: string;
  rating: number;
  headline: string;
  facts: { label: string; value: string }[];
  themes: string[];
  modules: string[];
  rules: PointRule[];
  targeting: string[];
  prize: string;
  participants: number;
  actions: number;
  pointsIssued: number;
  verification: number;
};

export type QuizQuestion = { id: string; campaignId: string; q: string; a: string; accuracy: number };

export type Celebrity = {
  id: string;
  name: string;
  hint: string;
  image: string;
  campaignId: string;
  guesses: number;
  solved: number;
};

export type Reward = {
  id: string;
  tenantId: string;
  campaignId: string;
  title: string;
  description: string;
  category: string;
  image: string;
  cost: number;
  quantity: number;
  redeemed: number;
  status: "active" | "inactive";
};

export type QuestionKind = "text" | "number" | "image";

export type SurveyQuestion = {
  id: string;
  kind: QuestionKind;
  prompt: string;
  required: boolean;
  points: number;
  min?: number;
  max?: number;
  unit?: string;
  options?: { id: string; label: string; image: string }[];
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

export type SurveyResponse = {
  id: string;
  surveyId: string;
  tenantId: string;
  fan: string;
  city: string;
  at: string;
  answers: { questionId: string; value: string | number }[];
};

export type Activity = {
  id: string;
  tenantId: string;
  campaignId: string;
  title: string;
  type: "Stream" | "Quiz" | "Game" | "Social" | "Survey" | "Review";
  points: number;
  completions: number;
  target: number;
  status: "active" | "paused";
};

export type Stream = {
  id: string;
  tenantId: string;
  campaignId: string;
  title: string;
  kind: "Listening party" | "Premiere" | "Reading" | "Interview" | "Behind the scenes";
  host: string;
  scheduledAt: string;
  minutes: number;
  viewers: number;
  peak: number;
  status: "live" | "scheduled" | "ended";
};

export type SocialTask = {
  id: string;
  tenantId: string;
  campaignId: string;
  platform: "Instagram" | "X" | "TikTok" | "Spotify" | "Apple Music" | "Goodreads";
  label: string;
  hashtag: string;
  points: number;
  submissions: number;
  approved: number;
  rejected: number;
};

export type Submission = {
  id: string;
  taskId: string;
  tenantId: string;
  fan: string;
  handle: string;
  link: string;
  at: string;
  status: "pending" | "approved" | "rejected";
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
  game: "Guess the Celebrity" | "Memory Game" | "Word Search" | "Quiz";
  rounds: number;
  won: number;
  points: number;
  at: string;
};

export type ConsoleUser = {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  city: string;
  joinedAt: string;
  points: number;
  actions: number;
  streak: number;
  referrals: number;
  segment: "Superfan" | "Regular" | "New" | "Dormant";
  status: "active" | "suspended";
};

export type LogEntry = {
  id: string;
  tenantId: string;
  at: string;
  actor: string;
  action: string;
  target: string;
  severity: "info" | "warning" | "critical";
};

export type Adjustment = {
  id: string;
  tenantId: string;
  userId: string;
  fan: string;
  delta: number;
  reason: string;
  by: string;
  at: string;
};

/* ------------------------------------------------------------------ */
/* Tenants                                                             */
/* ------------------------------------------------------------------ */

export const tenants: Tenant[] = [
  {
    id: "t-empire",
    name: "EMPIRE — BNXN",
    slug: "empire-bnxn",
    industry: "Music",
    plan: "Enterprise",
    emoji: "🎤",
    createdAt: "2026-01-14",
    members: [
      { id: "m1", name: "Asa Bello", email: "asa@empire.africa", role: "Owner" },
      { id: "m2", name: "Kunle Ade", email: "kunle@empire.africa", role: "Admin" },
      { id: "m3", name: "Zara Okoh", email: "zara@empire.africa", role: "Analyst" },
    ],
  },
  {
    id: "t-filmone",
    name: "FilmOne Entertainment",
    slug: "filmone",
    industry: "Film & TV",
    plan: "Pro",
    emoji: "🎬",
    createdAt: "2026-02-02",
    members: [
      { id: "m4", name: "Ify Nduka", email: "ify@filmone.ng", role: "Owner" },
      { id: "m5", name: "Dapo Ige", email: "dapo@filmone.ng", role: "Editor" },
    ],
  },
  {
    id: "t-henryholt",
    name: "Henry Holt & Co.",
    slug: "henry-holt",
    industry: "Publishing",
    plan: "Pro",
    emoji: "📚",
    createdAt: "2026-03-09",
    members: [
      { id: "m6", name: "Tola Ray", email: "tola@henryholt.com", role: "Owner" },
      { id: "m7", name: "Nkem Anya", email: "nkem@henryholt.com", role: "Analyst" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Campaigns                                                           */
/* ------------------------------------------------------------------ */

export const campaigns: Campaign[] = [
  {
    id: "c-bnxn",
    tenantId: "t-empire",
    name: 'Album Launch — "The Game Needs Us" by BNXN',
    kind: "album",
    status: "live",
    description:
      "A revolutionary album that redefines the Afrobeat landscape. BNXN delivers his most personal work yet, addressing industry politics, self-worth and cultural identity, with features from Wizkid, Burna Boy and Asake. Standout tracks: “Game Changer”, “Legacy”, “No Competition”.",
    cover: "https://picsum.photos/seed/bnxn-album/960/540",
    startsAt: "2026-07-20",
    endsAt: "2026-08-31",
    creator: "BNXN (Daniel Benson)",
    genre: "Afro-fusion · R&B · Afrobeat",
    rating: 4.8,
    headline: "200M+ streams in the first month",
    facts: [
      { label: "Artist", value: "BNXN (formerly Buju)" },
      { label: "Release date", value: "March 2024" },
      { label: "Label", value: "EMPIRE" },
      { label: "Tracks", value: "16 (20 deluxe)" },
      { label: "Streams", value: "200M+ first month" },
      { label: "Chart run", value: "4 weeks at #1" },
    ],
    themes: ["Resilience", "Authenticity", "Industry revolution"],
    modules: ["Stream", "Quiz", "Guess the Celebrity", "Memory Game", "Word Search", "Social Tasks", "Survey"],
    rules: [
      { id: "r1", label: "Stream a track", value: 10, cap: 20 },
      { id: "r2", label: "Correct quiz answer", value: 15, cap: 30 },
      { id: "r3", label: "Celebrity guessed", value: 25, cap: 20 },
      { id: "r4", label: "Social action verified", value: 30, cap: 10 },
      { id: "r5", label: "Survey completed", value: 50, cap: 3 },
    ],
    targeting: ["Nigeria", "Ghana", "UK diaspora", "Superfans", "Spotify listeners"],
    prize: "Top 100 win exclusive digital art · Top 3 win a virtual meet & greet",
    participants: 24310,
    actions: 128740,
    pointsIssued: 1984200,
    verification: 96.4,
  },
  {
    id: "c-call",
    tenantId: "t-filmone",
    name: 'Movie Launch — "The Call of My Life"',
    kind: "movie",
    status: "live",
    description:
      "A gripping tale of a young woman's journey to find purpose amidst family pressure and personal demons. Ada, a brilliant but conflicted architect, receives a mysterious phone call that changes everything. Directed by Kemi Adetiba with an original score by Banky W.",
    cover: "https://picsum.photos/seed/call-of-my-life/960/540",
    startsAt: "2026-06-15",
    endsAt: "2026-08-20",
    creator: "Kemi Adetiba",
    genre: "Drama · Thriller · Coming-of-Age",
    rating: 4.6,
    headline: "₦250M+ opening weekend",
    facts: [
      { label: "Director", value: "Kemi Adetiba" },
      { label: "Release date", value: "June 2024" },
      { label: "Studio", value: "FilmOne Entertainment" },
      { label: "Runtime", value: "2h 15m" },
      { label: "Trailer", value: "2:30 · “Your destiny is one call away”" },
      { label: "Premiere", value: "AFRIFF" },
    ],
    themes: ["Purpose", "Identity", "Family", "Courage"],
    modules: ["Trailer", "Quiz", "Guess the Celebrity", "Memory Game", "Social Tasks", "Survey"],
    rules: [
      { id: "r1", label: "Watch the trailer", value: 15, cap: 3 },
      { id: "r2", label: "Correct quiz answer", value: 15, cap: 30 },
      { id: "r3", label: "Scene reaction posted", value: 35, cap: 5 },
      { id: "r4", label: "Survey completed", value: 50, cap: 2 },
    ],
    targeting: ["Nollywood fans", "Lagos", "Abuja", "Cinema-goers", "18–34"],
    prize: "Virtual Q&A tickets · Behind-the-scenes vault access",
    participants: 15870,
    actions: 61240,
    pointsIssued: 903400,
    verification: 94.1,
  },
  {
    id: "c-cbb",
    tenantId: "t-henryholt",
    name: 'Book Launch — "Children of Blood and Bone" 10th Anniversary',
    kind: "book",
    status: "live",
    description:
      "A groundbreaking YA fantasy inspired by West African mythology. Zélie Adebola fights to restore magic to the kingdom of Orïsha after a ruthless king purged all magic-users. A #1 New York Times bestseller with 3M+ copies sold worldwide.",
    cover: "https://picsum.photos/seed/children-blood-bone/960/540",
    startsAt: "2026-07-01",
    endsAt: "2026-09-30",
    creator: "Tomi Adeyemi",
    genre: "Fantasy · Young Adult · African Mythology",
    rating: 4.9,
    headline: "3M+ copies sold worldwide",
    facts: [
      { label: "Author", value: "Tomi Adeyemi" },
      { label: "Publisher", value: "Henry Holt and Co." },
      { label: "First published", value: "March 2018" },
      { label: "Anniversary edition", value: "July 2024" },
      { label: "Awards", value: "Locus winner · Hugo finalist" },
      { label: "Goodreads", value: "4.5/5 · 200,000+ reviews" },
    ],
    themes: ["Magic", "Resistance", "Identity", "Justice"],
    modules: ["Reading", "Quiz", "Guess the Celebrity", "Word Search", "Social Tasks", "Survey"],
    rules: [
      { id: "r1", label: "Chapter check-in", value: 12, cap: 92 },
      { id: "r2", label: "Correct quiz answer", value: 15, cap: 30 },
      { id: "r3", label: "Goodreads review verified", value: 60, cap: 1 },
      { id: "r4", label: "Survey completed", value: 50, cap: 2 },
    ],
    targeting: ["YA readers", "Book clubs", "US", "UK", "Nigeria"],
    prize: "Signed digital edition · Author Q&A access",
    participants: 11290,
    actions: 43980,
    pointsIssued: 664500,
    verification: 97.2,
  },
  {
    id: "c-bnxn-deluxe",
    tenantId: "t-empire",
    name: "BNXN Deluxe Countdown",
    kind: "album",
    status: "scheduled",
    description: "Four new records, seven days, double points on day one. Warm-up campaign for the deluxe edition.",
    cover: "https://picsum.photos/seed/bnxn-deluxe/960/540",
    startsAt: "2026-09-05",
    endsAt: "2026-09-12",
    creator: "BNXN (Daniel Benson)",
    genre: "Afro-fusion",
    rating: 0,
    headline: "Deluxe edition — 20 tracks",
    facts: [
      { label: "Tracks", value: "20" },
      { label: "Window", value: "7 days" },
    ],
    themes: ["Anticipation"],
    modules: ["Stream", "Quiz", "Social Tasks"],
    rules: [
      { id: "r1", label: "Stream a deluxe track", value: 12, cap: 20 },
      { id: "r2", label: "Correct quiz answer", value: 15, cap: 20 },
    ],
    targeting: ["Existing participants", "Nigeria", "Ghana"],
    prize: "Early access for the top 500",
    participants: 0,
    actions: 0,
    pointsIssued: 0,
    verification: 0,
  },
  {
    id: "c-afriff",
    tenantId: "t-filmone",
    name: "AFRIFF Premiere Replay",
    kind: "movie",
    status: "ended",
    description: "Two-week replay campaign around the festival premiere run.",
    cover: "https://picsum.photos/seed/afriff-replay/960/540",
    startsAt: "2026-04-01",
    endsAt: "2026-04-15",
    creator: "FilmOne Entertainment",
    genre: "Drama",
    rating: 4.3,
    headline: "12,080 participants across 2 weeks",
    facts: [{ label: "Window", value: "2 weeks" }],
    themes: ["Nostalgia"],
    modules: ["Trailer", "Quiz", "Social Tasks"],
    rules: [{ id: "r1", label: "Watch the trailer", value: 10, cap: 3 }],
    targeting: ["Lagos", "Festival attendees"],
    prize: "Merch drops for the top 50",
    participants: 12080,
    actions: 41220,
    pointsIssued: 604100,
    verification: 95.2,
  },
];

/* ------------------------------------------------------------------ */
/* Quizzes — 30 questions per flagship campaign                        */
/* ------------------------------------------------------------------ */

const ALBUM_QA: [string, string][] = [
  ["What is BNXN's real name?", "Daniel Benson"],
  ['What year was "The Game Needs Us" released?', "2024"],
  ["Which track features Wizkid?", "Legacy"],
  ["What's the album's lead single?", "Game Changer"],
  ["How many tracks are on the album?", "16"],
  ['Which artist collaborated on "No Competition"?', "Burna Boy"],
  ["What is the album's main message?", "Industry revolution"],
  ["Which track addresses mental health?", "Pressure"],
  ["Who produced the title track?", "Pheelz"],
  ["What genre best describes the album?", "Afro-fusion"],
  ["How many weeks did it top the charts?", "4 weeks"],
  ["Which song is about self-worth?", "Legacy"],
  ["What award did the album win?", "Album of the Year"],
  ["Which track features Asake?", "Rise Up"],
  ["What inspired the album title?", "Game-changing mindset"],
  ["How many Spotify streams in the first week?", "50M+"],
  ["Which song has a gospel influence?", "Blessings"],
  ["What's the album's BPM range?", "90–120 BPM"],
  ["Which city inspired the album?", "Lagos"],
  ["What's the deluxe edition track count?", "20"],
  ["Which track is about gratitude?", "Thankful"],
  ["Who designed the album artwork?", "Lado"],
  ['What\'s the meaning behind "The Game Needs Us"?', "Collective impact"],
  ["Which song samples Fela Kuti?", "Revolution"],
  ["How many features on the album?", "5"],
  ["What's the album's cultural impact?", "Afrobeats global takeover"],
  ["Which track is a duet with a female artist?", "Balance (with Tems)"],
  ["What's the album's signature sound?", "Soulful Afrobeats"],
  ["Which track addresses social issues?", "Change"],
  ["What's the closing track?", "Outro - The Future"],
];

const MOVIE_QA: [string, string][] = [
  ['Who directed "The Call of My Life"?', "Kemi Adetiba"],
  ["What genre is the movie?", "Drama/Thriller"],
  ["What year was it released?", "2024"],
  ["Who is the lead character?", "Ada"],
  ["What is Ada's profession?", "Architect"],
  ["What's the film's tagline?", "Your destiny is one call away"],
  ["Which studio produced it?", "FilmOne Entertainment"],
  ["What's the movie's budget?", "₦100M"],
  ["How long is the runtime?", "2 hours 15 minutes"],
  ["Who composed the soundtrack?", "Banky W"],
  ["What city is the movie set in?", "Lagos"],
  ["What's the central theme?", "Purpose"],
  ["Who plays Ada?", "Nengi Adoki"],
  ["What's the climax of the movie?", "Discovery scene"],
  ["How many awards did it win?", "5"],
  ["What's the opening scene?", "Ada at work"],
  ["Which Nigerian festival premiered it?", "AFRIFF"],
  ["What's the secondary character's name?", "Chidi"],
  ["What is the mysterious call about?", "Hidden truth"],
  ["How many weeks at #1?", "3 weeks"],
  ["What's the family conflict?", "Career choice"],
  ["Who's the cinematographer?", "D.O.P. John Demps"],
  ["What's the movie's emotional tone?", "Inspirational"],
  ["How many locations used?", "12"],
  ["What's the post-credit scene?", "Sequel hint"],
  ["Which song is in the trailer?", "Call by Simi"],
  ["What's the film's rating on IMDb?", "8.2/10"],
  ["Who's the supporting actor?", "Femi Jacobs"],
  ["What's the movie's core message?", "Live your truth"],
  ["How many countries released it?", "10"],
];

const BOOK_QA: [string, string][] = [
  ['Who wrote "Children of Blood and Bone"?', "Tomi Adeyemi"],
  ["What is the main character's name?", "Zélie Adebola"],
  ["What kingdom is the story set in?", "Orïsha"],
  ["What inspired the magic system?", "West African mythology"],
  ["What year was the book first published?", "2018"],
  ["What genre is the book?", "Fantasy/Young Adult"],
  ["Who is the ruthless king?", "King Saran"],
  ["What is Zélie's brother's name?", "Tzain"],
  ["What is the name of the prince?", "Prince Inan"],
  ["What is the princess's name?", "Princess Amari"],
  ["What is the magic system called?", "Magic of Orïsha"],
  ["Who is Zélie's mentor?", "Mama Agba"],
  ["What is the book's theme?", "Resistance"],
  ["How many books in the series?", "3"],
  ["What award did it win?", "Locus Award"],
  ["What is the sequel called?", "Children of Virtue and Vengeance"],
  ["How many copies sold worldwide?", "3M+"],
  ["What cultural pantheon inspired it?", "Yoruba mythology"],
  ["Who is the villain?", "King Saran"],
  ["What is Zélie's goal?", "Restore magic"],
  ["What's the magical artifact?", "Scroll of the gods"],
  ["How many chapters in the book?", "92"],
  ["What's the opening line?", "I was born with the magic"],
  ["Which character is a traitor?", "Prince Inan"],
  ["What's the book's emotional core?", "Family and justice"],
  ["How long did it take to write?", "2 years"],
  ["What was the initial inspiration?", "Police brutality protests"],
  ["Which character represents hope?", "Zélie"],
  ["What's the ending about?", "Hope for the future"],
  ["When was the 10th Anniversary Edition released?", "2024"],
];

function buildQuiz(campaignId: string, qa: [string, string][], seed: number): QuizQuestion[] {
  const rnd = seeded(seed);
  return qa.map(([q, a], i) => ({
    id: `${campaignId}-q${i + 1}`,
    campaignId,
    q,
    a,
    accuracy: Math.round(38 + rnd() * 58),
  }));
}

export const quizQuestions: QuizQuestion[] = [
  ...buildQuiz("c-bnxn", ALBUM_QA, 11),
  ...buildQuiz("c-call", MOVIE_QA, 23),
  ...buildQuiz("c-cbb", BOOK_QA, 37),
];

/* ------------------------------------------------------------------ */
/* Guess the Celebrity — 21 rounds                                     */
/* ------------------------------------------------------------------ */

export const celebrities: Celebrity[] = [
  { id: "cel-1", name: "Davido", hint: "OBO — 15 years in the game", image: celebDavido.url, campaignId: "c-bnxn", guesses: 4820, solved: 3910 },
  { id: "cel-2", name: "Burna Boy", hint: 'Featured on "No Competition"', image: celebBurna.url, campaignId: "c-bnxn", guesses: 4610, solved: 4102 },
  { id: "cel-3", name: "Asake", hint: 'Featured on "Rise Up"', image: celebAsake.url, campaignId: "c-bnxn", guesses: 4402, solved: 3388 },
  { id: "cel-4", name: "Mayorkun", hint: "The Mayor of Lagos", image: celebMayorkun.url, campaignId: "c-bnxn", guesses: 3980, solved: 2611 },
  { id: "cel-5", name: "Ayra Starr", hint: "Sabi girl, no dey stress", image: celebAyra.url, campaignId: "c-bnxn", guesses: 3877, solved: 3221 },
  { id: "cel-6", name: "Tiwa Savage", hint: "The Queen of Afrobeats", image: celebTiwa.url, campaignId: "c-call", guesses: 3540, solved: 2900 },
  { id: "cel-7", name: "Rema", hint: "Calm Down. Worldwide.", image: celebRema.url, campaignId: "c-call", guesses: 3421, solved: 3010 },
  { id: "cel-8", name: "Black Sherif", hint: "Ghana's Blacko", image: celebSherif.url, campaignId: "c-cbb", guesses: 2988, solved: 1980 },
  { id: "cel-9", name: "Aya Nakamura", hint: "Paris meets Bamako", image: celebAya.url, campaignId: "c-cbb", guesses: 2704, solved: 1602 },
  { id: "cel-10", name: "BNXN", hint: "Formerly Buju", image: "https://picsum.photos/seed/celeb-bnxn/480/480", campaignId: "c-bnxn", guesses: 5210, solved: 4780 },
  { id: "cel-11", name: "Wizkid", hint: 'Feature on "Legacy"', image: "https://picsum.photos/seed/celeb-wizkid/480/480", campaignId: "c-bnxn", guesses: 5102, solved: 4712 },
  { id: "cel-12", name: "Tems", hint: 'Duet on "Balance"', image: "https://picsum.photos/seed/celeb-tems/480/480", campaignId: "c-bnxn", guesses: 4300, solved: 3702 },
  { id: "cel-13", name: "Pheelz", hint: "Producer of the title track", image: "https://picsum.photos/seed/celeb-pheelz/480/480", campaignId: "c-bnxn", guesses: 2880, solved: 1450 },
  { id: "cel-14", name: "Kemi Adetiba", hint: "Director of the movie", image: "https://picsum.photos/seed/celeb-kemi/480/480", campaignId: "c-call", guesses: 3120, solved: 2210 },
  { id: "cel-15", name: "Banky W", hint: "Composed the original score", image: "https://picsum.photos/seed/celeb-bankyw/480/480", campaignId: "c-call", guesses: 3040, solved: 2401 },
  { id: "cel-16", name: "Nengi Adoki", hint: "Plays Ada", image: "https://picsum.photos/seed/celeb-nengi/480/480", campaignId: "c-call", guesses: 2760, solved: 1502 },
  { id: "cel-17", name: "Femi Jacobs", hint: "Supporting actor", image: "https://picsum.photos/seed/celeb-femi/480/480", campaignId: "c-call", guesses: 2510, solved: 1290 },
  { id: "cel-18", name: "Simi", hint: 'Sings "Call" in the trailer', image: "https://picsum.photos/seed/celeb-simi/480/480", campaignId: "c-call", guesses: 3310, solved: 2810 },
  { id: "cel-19", name: "Tomi Adeyemi", hint: "Author of the Orïsha trilogy", image: "https://picsum.photos/seed/celeb-tomi/480/480", campaignId: "c-cbb", guesses: 3410, solved: 2740 },
  { id: "cel-20", name: "Chimamanda Ngozi Adichie", hint: "Half of a Yellow Sun", image: "https://picsum.photos/seed/celeb-chimamanda/480/480", campaignId: "c-cbb", guesses: 3210, solved: 2880 },
  { id: "cel-21", name: "Nnedi Okorafor", hint: "Binti and Akata Witch", image: "https://picsum.photos/seed/celeb-nnedi/480/480", campaignId: "c-cbb", guesses: 2410, solved: 1310 },
];

/* ------------------------------------------------------------------ */
/* Rewards                                                             */
/* ------------------------------------------------------------------ */

const rw = (
  id: string,
  tenantId: string,
  campaignId: string,
  title: string,
  description: string,
  category: string,
  seed: string,
  cost: number,
  quantity: number,
  redeemed: number,
  status: Reward["status"] = "active",
): Reward => ({
  id,
  tenantId,
  campaignId,
  title,
  description,
  category,
  image: `https://picsum.photos/seed/${seed}/480/320`,
  cost,
  quantity,
  redeemed,
  status,
});

export const rewards: Reward[] = [
  rw("rw1", "t-empire", "c-bnxn", "Exclusive Digital Album Art", "1-of-1000 numbered ORIADÉ-style cover art by Lado.", "Exclusive content", "reward-albumart", 500, 1000, 618),
  rw("rw2", "t-empire", "c-bnxn", "Virtual Meet & Greet Token", "15-minute group video call with BNXN after the listening party.", "Experience", "reward-meetgreet", 6000, 25, 21),
  rw("rw3", "t-empire", "c-bnxn", "Limited Edition Merch Code", "30% off the EMPIRE x BNXN capsule drop.", "Discount code", "reward-merchcode", 1200, 500, 287),
  rw("rw4", "t-empire", "c-bnxn", "Early Access to Next Album", "48-hour head start on the deluxe edition.", "Exclusive content", "reward-earlyaccess", 900, 9999, 3140),
  rw("rw5", "t-empire", "c-bnxn", "Signed Digital Poster", "Hand-signed tour poster, delivered as a signed PDF + print code.", "Digital merch", "reward-poster", 1500, 300, 300, "inactive"),
  rw("rw6", "t-filmone", "c-call", "Behind-the-Scenes Footage", "42 minutes of unreleased set footage from the Lagos shoot.", "Exclusive content", "reward-bts", 700, 9999, 2210),
  rw("rw7", "t-filmone", "c-call", "Virtual Q&A Ticket", "Live Q&A with Kemi Adetiba and the cast.", "Experience", "reward-qa", 2500, 200, 148),
  rw("rw8", "t-filmone", "c-call", "Movie Merchandise Discount", "25% off the official film store.", "Discount code", "reward-moviemerch", 800, 1000, 412),
  rw("rw9", "t-filmone", "c-call", "Streaming Access Code", "Seven-day early streaming window.", "Digital merch", "reward-streamcode", 1800, 400, 366),
  rw("rw10", "t-filmone", "c-call", "Director's Commentary", "Full-length commentary track by Kemi Adetiba.", "Exclusive content", "reward-commentary", 1000, 9999, 980),
  rw("rw11", "t-henryholt", "c-cbb", "Signed Digital Edition", "Anniversary edition with a signed digital plate.", "Digital merch", "reward-signedbook", 2200, 500, 431),
  rw("rw12", "t-henryholt", "c-cbb", "Author Q&A Access", "Live session with Tomi Adeyemi for book clubs.", "Experience", "reward-authorqa", 3000, 150, 96),
  rw("rw13", "t-henryholt", "c-cbb", "Exclusive Chapter Preview", "First three chapters of the next Orïsha book.", "Exclusive content", "reward-chapter", 600, 9999, 1720),
  rw("rw14", "t-henryholt", "c-cbb", "Book Club Kit", "Discussion guide, playlist and printable map of Orïsha.", "Digital merch", "reward-bookclub", 450, 2000, 884),
  rw("rw15", "t-henryholt", "c-cbb", "Bookmark Design Pack", "Six printable bookmarks illustrated by the cover artist.", "Digital merch", "reward-bookmark", 250, 5000, 2310),
];

/* ------------------------------------------------------------------ */
/* Surveys                                                             */
/* ------------------------------------------------------------------ */

const IMAGE_BANK = [
  { id: "img-bnxn", label: "BNXN", image: "https://picsum.photos/seed/celeb-bnxn/480/480" },
  { id: "img-wizkid", label: "Wizkid", image: "https://picsum.photos/seed/celeb-wizkid/480/480" },
  { id: "img-burna", label: "Burna Boy", image: celebBurna.url },
  { id: "img-asake", label: "Asake", image: celebAsake.url },
  { id: "img-tems", label: "Tems", image: "https://picsum.photos/seed/celeb-tems/480/480" },
  { id: "img-ayra", label: "Ayra Starr", image: celebAyra.url },
];

export const imageOptionBank = IMAGE_BANK;

const POSTER_BANK = [
  { id: "img-poster-a", label: "Poster A — The Call", image: "https://picsum.photos/seed/poster-a/480/480" },
  { id: "img-poster-b", label: "Poster B — Lagos Skyline", image: "https://picsum.photos/seed/poster-b/480/480" },
  { id: "img-poster-c", label: "Poster C — The Phone", image: "https://picsum.photos/seed/poster-c/480/480" },
];

const COVER_BANK = [
  { id: "img-cover-a", label: "Anniversary cover", image: "https://picsum.photos/seed/cover-a/480/480" },
  { id: "img-cover-b", label: "Original 2018 cover", image: "https://picsum.photos/seed/cover-b/480/480" },
  { id: "img-cover-c", label: "Illustrated Orïsha map", image: "https://picsum.photos/seed/cover-c/480/480" },
];

export const surveys: Survey[] = [
  {
    id: "sv-album",
    tenantId: "t-empire",
    campaignId: "c-bnxn",
    title: "Album listening survey",
    description: "Which records are landing, and how hard? Feeds the deluxe tracklist decision.",
    status: "open",
    questions: [
      { id: "q1", kind: "image", prompt: "Which collaborator should headline the deluxe?", required: true, points: 15, options: IMAGE_BANK },
      { id: "q2", kind: "number", prompt: "How many times have you played the album front to back?", required: true, min: 0, max: 50, unit: "plays", points: 10 },
      { id: "q3", kind: "number", prompt: "Rate the album out of 10", required: true, min: 1, max: 10, unit: "/10", points: 10 },
      { id: "q4", kind: "text", prompt: "One line: what does “The Game Needs Us” mean to you?", required: false, points: 15 },
    ],
  },
  {
    id: "sv-movie",
    tenantId: "t-filmone",
    campaignId: "c-call",
    title: "Movie review survey",
    description: "Post-screening sentiment, poster testing and second-city rollout sizing.",
    status: "open",
    questions: [
      { id: "q1", kind: "image", prompt: "Which poster makes you want to watch?", required: true, points: 15, options: POSTER_BANK },
      { id: "q2", kind: "number", prompt: "Rate the movie out of 10", required: true, min: 1, max: 10, unit: "/10", points: 10 },
      { id: "q3", kind: "number", prompt: "How many friends are you bringing?", required: true, min: 0, max: 10, unit: "people", points: 10 },
      { id: "q4", kind: "text", prompt: "Which city should we premiere in next?", required: true, points: 10 },
    ],
  },
  {
    id: "sv-book",
    tenantId: "t-henryholt",
    campaignId: "c-cbb",
    title: "Book reading survey",
    description: "Reading pace, cover preference and what the anniversary edition should add.",
    status: "open",
    questions: [
      { id: "q1", kind: "image", prompt: "Which anniversary cover should we print?", required: true, points: 15, options: COVER_BANK },
      { id: "q2", kind: "number", prompt: "How many chapters have you finished?", required: true, min: 0, max: 92, unit: "chapters", points: 10 },
      { id: "q3", kind: "number", prompt: "Rate the book out of 10", required: true, min: 1, max: 10, unit: "/10", points: 10 },
      { id: "q4", kind: "text", prompt: "Which character deserves their own spin-off?", required: false, points: 15 },
    ],
  },
  {
    id: "sv-demo",
    tenantId: "t-empire",
    campaignId: "c-bnxn",
    title: "Fan demographic snapshot",
    description: "Age, city and platform mix across the active fanbase.",
    status: "closed",
    questions: [
      { id: "q1", kind: "number", prompt: "How old are you?", required: true, min: 13, max: 65, unit: "years", points: 5 },
      { id: "q2", kind: "text", prompt: "Which city do you stream from?", required: true, points: 5 },
      { id: "q3", kind: "number", prompt: "How many hours a week do you stream music?", required: true, min: 0, max: 40, unit: "hrs", points: 5 },
    ],
  },
];

const FAN_NAMES = [
  "Ada Obi", "Tunde Bello", "Zainab Musa", "Chidi Eze", "Fola Adeyemi", "Nneka Okafor",
  "Kwame Mensah", "Amaka Nwosu", "Seyi Alabi", "Hauwa Bello", "Emeka Udo", "Bisi Ogun",
  "Kelechi Ani", "Yemi Sanni", "Oma Briggs", "Dami Ojo", "Sade Balogun", "Ifeanyi Nnaji",
  "Rukky Peters", "Tobi Salami", "Chisom Ike", "Lami Yusuf", "Gozie Umeh", "Peace Etim",
  "Jide Coker", "Nkem Anya", "Segun Fadeyi", "Halima Sule", "Uche Kalu", "Bola Adigun",
];

const CITIES = ["Lagos", "Abuja", "Accra", "Port Harcourt", "Ibadan", "Nairobi", "London", "Atlanta"];

const TEXT_POOL: Record<string, string[]> = {
  "sv-album": [
    "Game Changer is the anthem of my year, no debate.",
    "It means we eat together or nobody eats. Collective impact.",
    "Pressure got me through my final year. Thank you BNXN.",
    "Legacy with Wizkid is the best duet since 2016.",
    "Revolution sampling Fela was a masterstroke.",
    "Soulful Afrobeats done right. 16 tracks, zero skips.",
  ],
  "sv-movie": ["Abuja", "Accra", "Port Harcourt", "Ibadan", "Nairobi", "Lagos again"],
  "sv-book": ["Amari", "Tzain", "Mama Agba", "Inan", "Zélie's mother", "Roën"],
  "sv-demo": ["Lagos", "Abuja", "London", "Atlanta", "Accra", "Nairobi"],
};

function makeResponses(survey: Survey, count: number, seed: number): SurveyResponse[] {
  const rnd = seeded(seed);
  const texts = TEXT_POOL[survey.id] ?? ["Great"];
  return Array.from({ length: count }, (_, i) => {
    const answers = survey.questions.map((q) => {
      if (q.kind === "image") {
        const opts = q.options ?? [];
        // bias towards the first two options so charts look realistic
        const idx = rnd() < 0.55 ? Math.floor(rnd() * 2) : Math.floor(rnd() * opts.length);
        return { questionId: q.id, value: opts[Math.min(idx, opts.length - 1)]?.id ?? "" };
      }
      if (q.kind === "number") {
        const min = q.min ?? 0;
        const max = q.max ?? 10;
        const skew = (rnd() + rnd()) / 2;
        return { questionId: q.id, value: min + Math.round(skew * (max - min)) };
      }
      return { questionId: q.id, value: pick(texts, rnd()) };
    });
    const day = 1 + Math.floor(rnd() * 5);
    return {
      id: `${survey.id}-r${i + 1}`,
      surveyId: survey.id,
      tenantId: survey.tenantId,
      fan: pick(FAN_NAMES, rnd()),
      city: pick(CITIES, rnd()),
      at: `2026-08-0${day}T${String(8 + Math.floor(rnd() * 12)).padStart(2, "0")}:${String(Math.floor(rnd() * 60)).padStart(2, "0")}:00Z`,
      answers,
    };
  });
}

export const surveyResponses: SurveyResponse[] = [
  ...makeResponses(surveys[0]!, 64, 7),
  ...makeResponses(surveys[1]!, 48, 19),
  ...makeResponses(surveys[2]!, 41, 29),
  ...makeResponses(surveys[3]!, 33, 41),
];

/* ------------------------------------------------------------------ */
/* Activities                                                          */
/* ------------------------------------------------------------------ */

export const activities: Activity[] = [
  { id: "a1", tenantId: "t-empire", campaignId: "c-bnxn", title: "Stream “Game Changer” end to end", type: "Stream", points: 10, completions: 18420, target: 25000, status: "active" },
  { id: "a2", tenantId: "t-empire", campaignId: "c-bnxn", title: "Finish the 30-question album quiz", type: "Quiz", points: 450, completions: 9120, target: 15000, status: "active" },
  { id: "a3", tenantId: "t-empire", campaignId: "c-bnxn", title: "Guess 10 celebrities in a row", type: "Game", points: 250, completions: 6410, target: 10000, status: "active" },
  { id: "a4", tenantId: "t-empire", campaignId: "c-bnxn", title: "Write an Apple Music review", type: "Review", points: 60, completions: 2140, target: 5000, status: "active" },
  { id: "a5", tenantId: "t-empire", campaignId: "c-bnxn", title: "Share the album art on Instagram", type: "Social", points: 30, completions: 7310, target: 12000, status: "active" },
  { id: "a6", tenantId: "t-empire", campaignId: "c-bnxn", title: "Complete the listening survey", type: "Survey", points: 50, completions: 4820, target: 8000, status: "paused" },
  { id: "a7", tenantId: "t-filmone", campaignId: "c-call", title: "Watch the 2:30 trailer", type: "Stream", points: 15, completions: 14200, target: 20000, status: "active" },
  { id: "a8", tenantId: "t-filmone", campaignId: "c-call", title: "Finish the 30-question movie quiz", type: "Quiz", points: 450, completions: 6120, target: 12000, status: "active" },
  { id: "a9", tenantId: "t-filmone", campaignId: "c-call", title: "Post an Instagram Reel of your favourite scene", type: "Social", points: 35, completions: 3110, target: 8000, status: "active" },
  { id: "a10", tenantId: "t-filmone", campaignId: "c-call", title: "Submit a movie review survey", type: "Survey", points: 50, completions: 2740, target: 6000, status: "active" },
  { id: "a11", tenantId: "t-henryholt", campaignId: "c-cbb", title: "Check in per chapter read", type: "Review", points: 12, completions: 21400, target: 30000, status: "active" },
  { id: "a12", tenantId: "t-henryholt", campaignId: "c-cbb", title: "Finish the 30-question book quiz", type: "Quiz", points: 450, completions: 4980, target: 9000, status: "active" },
  { id: "a13", tenantId: "t-henryholt", campaignId: "c-cbb", title: "Publish a Goodreads review", type: "Social", points: 60, completions: 1880, target: 4000, status: "active" },
  { id: "a14", tenantId: "t-henryholt", campaignId: "c-cbb", title: "Complete the Orïsha word search", type: "Game", points: 120, completions: 3320, target: 7000, status: "active" },
];

/* ------------------------------------------------------------------ */
/* Streams                                                             */
/* ------------------------------------------------------------------ */

export const streams: Stream[] = [
  { id: "st1", tenantId: "t-empire", campaignId: "c-bnxn", title: "The Game Needs Us — listening party", kind: "Listening party", host: "BNXN", scheduledAt: "2026-08-05T19:00:00Z", minutes: 78, viewers: 41200, peak: 12800, status: "live" },
  { id: "st2", tenantId: "t-empire", campaignId: "c-bnxn", title: "Studio breakdown with Pheelz", kind: "Behind the scenes", host: "Pheelz", scheduledAt: "2026-08-07T18:00:00Z", minutes: 45, viewers: 0, peak: 0, status: "scheduled" },
  { id: "st3", tenantId: "t-empire", campaignId: "c-bnxn", title: "BNXN x Tems — Balance interview", kind: "Interview", host: "Zara Okoh", scheduledAt: "2026-07-29T17:00:00Z", minutes: 52, viewers: 28400, peak: 9100, status: "ended" },
  { id: "st4", tenantId: "t-filmone", campaignId: "c-call", title: "The Call of My Life — premiere livestream", kind: "Premiere", host: "Kemi Adetiba", scheduledAt: "2026-08-02T18:30:00Z", minutes: 135, viewers: 52100, peak: 19400, status: "ended" },
  { id: "st5", tenantId: "t-filmone", campaignId: "c-call", title: "On set in Lagos — BTS reel", kind: "Behind the scenes", host: "Dapo Ige", scheduledAt: "2026-08-06T16:00:00Z", minutes: 30, viewers: 9800, peak: 3100, status: "live" },
  { id: "st6", tenantId: "t-filmone", campaignId: "c-call", title: "Cast Q&A with Nengi Adoki", kind: "Interview", host: "Ify Nduka", scheduledAt: "2026-08-11T17:00:00Z", minutes: 60, viewers: 0, peak: 0, status: "scheduled" },
  { id: "st7", tenantId: "t-henryholt", campaignId: "c-cbb", title: "Orïsha reading session — chapters 1–6", kind: "Reading", host: "Tomi Adeyemi", scheduledAt: "2026-08-03T15:00:00Z", minutes: 64, viewers: 18700, peak: 6400, status: "ended" },
  { id: "st8", tenantId: "t-henryholt", campaignId: "c-cbb", title: "Ten years of Blood and Bone — author interview", kind: "Interview", host: "Nkem Anya", scheduledAt: "2026-08-09T15:00:00Z", minutes: 50, viewers: 0, peak: 0, status: "scheduled" },
  { id: "st9", tenantId: "t-henryholt", campaignId: "c-cbb", title: "Book club live — the magic system", kind: "Reading", host: "Tola Ray", scheduledAt: "2026-08-05T14:00:00Z", minutes: 41, viewers: 7200, peak: 2400, status: "live" },
];

/* ------------------------------------------------------------------ */
/* Social tasks + submissions                                          */
/* ------------------------------------------------------------------ */

export const socialTasks: SocialTask[] = [
  { id: "so1", tenantId: "t-empire", campaignId: "c-bnxn", platform: "Instagram", label: "Share the album art", hashtag: "#TheGameNeedsUs", points: 30, submissions: 7310, approved: 6802, rejected: 508 },
  { id: "so2", tenantId: "t-empire", campaignId: "c-bnxn", platform: "X", label: "Tweet your favourite lyric", hashtag: "#TheGameNeedsUs", points: 25, submissions: 5240, approved: 4901, rejected: 339 },
  { id: "so3", tenantId: "t-empire", campaignId: "c-bnxn", platform: "TikTok", label: "Game Changer dance challenge", hashtag: "#GameChangerChallenge", points: 45, submissions: 3120, approved: 2740, rejected: 380 },
  { id: "so4", tenantId: "t-empire", campaignId: "c-bnxn", platform: "Spotify", label: "Share your album playlist", hashtag: "#BNXNPlaylist", points: 20, submissions: 4410, approved: 4290, rejected: 120 },
  { id: "so5", tenantId: "t-empire", campaignId: "c-bnxn", platform: "Apple Music", label: "Leave an Apple Music review", hashtag: "#BNXNReview", points: 35, submissions: 2140, approved: 1980, rejected: 160 },
  { id: "so6", tenantId: "t-filmone", campaignId: "c-call", platform: "Instagram", label: "Share the movie poster", hashtag: "#TheCallOfMyLife", points: 25, submissions: 4820, approved: 4402, rejected: 418 },
  { id: "so7", tenantId: "t-filmone", campaignId: "c-call", platform: "X", label: "Post your trailer reaction", hashtag: "#TheCallOfMyLife", points: 30, submissions: 3910, approved: 3510, rejected: 400 },
  { id: "so8", tenantId: "t-filmone", campaignId: "c-call", platform: "Instagram", label: "Reel of your favourite scene", hashtag: "#OneCallAway", points: 35, submissions: 3110, approved: 2680, rejected: 430 },
  { id: "so9", tenantId: "t-filmone", campaignId: "c-call", platform: "TikTok", label: "Movie moments edit", hashtag: "#CallOfMyLifeEdit", points: 40, submissions: 2280, approved: 1940, rejected: 340 },
  { id: "so10", tenantId: "t-henryholt", campaignId: "c-cbb", platform: "Goodreads", label: "Publish a Goodreads review", hashtag: "#ChildrenOfBloodAndBone", points: 60, submissions: 1880, approved: 1790, rejected: 90 },
  { id: "so11", tenantId: "t-henryholt", campaignId: "c-cbb", platform: "Instagram", label: "Book quote graphic", hashtag: "#Orisha10", points: 25, submissions: 2610, approved: 2410, rejected: 200 },
  { id: "so12", tenantId: "t-henryholt", campaignId: "c-cbb", platform: "TikTok", label: "60-second book review", hashtag: "#BookTokOrisha", points: 45, submissions: 1740, approved: 1490, rejected: 250 },
  { id: "so13", tenantId: "t-henryholt", campaignId: "c-cbb", platform: "X", label: "Thread on the book's themes", hashtag: "#BloodAndBoneThread", points: 50, submissions: 980, approved: 870, rejected: 110 },
];

function makeSubmissions(): Submission[] {
  const rnd = seeded(83);
  const out: Submission[] = [];
  socialTasks.forEach((t, ti) => {
    for (let i = 0; i < 6; i++) {
      const roll = rnd();
      const status: Submission["status"] = i < 2 ? "pending" : roll > 0.22 ? "approved" : "rejected";
      const fan = pick(FAN_NAMES, rnd());
      out.push({
        id: `sub-${ti}-${i}`,
        taskId: t.id,
        tenantId: t.tenantId,
        fan,
        handle: `@${fan.split(" ")[0]!.toLowerCase()}${Math.floor(rnd() * 900 + 100)}`,
        link: `https://${t.platform.toLowerCase().replace(/\s/g, "")}.com/p/${t.id}-${i}`,
        at: `2026-08-0${1 + Math.floor(rnd() * 5)}T1${Math.floor(rnd() * 9)}:${String(Math.floor(rnd() * 60)).padStart(2, "0")}:00Z`,
        status,
      });
    }
  });
  return out;
}

export const submissions: Submission[] = makeSubmissions();

/* ------------------------------------------------------------------ */
/* Quiz + game results                                                 */
/* ------------------------------------------------------------------ */

function makeQuizResults(): QuizResult[] {
  const rnd = seeded(131);
  const out: QuizResult[] = [];
  campaigns
    .filter((c) => ["c-bnxn", "c-call", "c-cbb"].includes(c.id))
    .forEach((c, ci) => {
      for (let i = 0; i < 30; i++) {
        const score = Math.max(6, Math.round(30 * (0.4 + rnd() * 0.6)));
        out.push({
          id: `qr-${ci}-${i}`,
          tenantId: c.tenantId,
          campaignId: c.id,
          fan: pick(FAN_NAMES, rnd()),
          score,
          total: 30,
          seconds: 120 + Math.floor(rnd() * 400),
          at: `2026-08-0${1 + Math.floor(rnd() * 5)}T1${Math.floor(rnd() * 9)}:0${Math.floor(rnd() * 9)}:00Z`,
        });
      }
    });
  return out.sort((a, b) => b.score - a.score);
}

export const quizResults: QuizResult[] = makeQuizResults();

function makeGameResults(): GameResult[] {
  const rnd = seeded(179);
  const games: GameResult["game"][] = ["Guess the Celebrity", "Memory Game", "Word Search", "Quiz"];
  const out: GameResult[] = [];
  campaigns
    .filter((c) => ["c-bnxn", "c-call", "c-cbb"].includes(c.id))
    .forEach((c, ci) => {
      for (let i = 0; i < 32; i++) {
        const rounds = 5 + Math.floor(rnd() * 6);
        const won = Math.max(1, Math.round(rounds * (0.35 + rnd() * 0.65)));
        out.push({
          id: `gr-${ci}-${i}`,
          tenantId: c.tenantId,
          campaignId: c.id,
          fan: pick(FAN_NAMES, rnd()),
          game: pick(games, rnd()),
          rounds,
          won,
          points: won * 25,
          at: `2026-08-0${1 + Math.floor(rnd() * 5)}T0${Math.floor(rnd() * 9)}:1${Math.floor(rnd() * 9)}:00Z`,
        });
      }
    });
  return out;
}

export const gameResults: GameResult[] = makeGameResults();

/* ------------------------------------------------------------------ */
/* Users                                                               */
/* ------------------------------------------------------------------ */

function makeUsers(): ConsoleUser[] {
  const rnd = seeded(211);
  const segments: ConsoleUser["segment"][] = ["Superfan", "Regular", "New", "Dormant"];
  const out: ConsoleUser[] = [];
  tenants.forEach((t, ti) => {
    FAN_NAMES.forEach((fan, i) => {
      const points = 400 + Math.floor(rnd() * 18000);
      out.push({
        id: `u-${ti}-${i}`,
        tenantId: t.id,
        name: fan,
        email: `${fan.toLowerCase().replace(/\s/g, ".")}@sparkfan.app`,
        city: pick(CITIES, rnd()),
        joinedAt: `2026-0${1 + Math.floor(rnd() * 7)}-${String(1 + Math.floor(rnd() * 27)).padStart(2, "0")}`,
        points,
        actions: 12 + Math.floor(rnd() * 420),
        streak: Math.floor(rnd() * 28),
        referrals: Math.floor(rnd() * 22),
        segment: points > 12000 ? "Superfan" : pick(segments, rnd()),
        status: rnd() > 0.96 ? "suspended" : "active",
      });
    });
  });
  return out.sort((a, b) => b.points - a.points);
}

export const users: ConsoleUser[] = makeUsers();

/* ------------------------------------------------------------------ */
/* Logs + adjustments                                                  */
/* ------------------------------------------------------------------ */

export const logs: LogEntry[] = [
  { id: "l1", tenantId: "t-empire", at: "2026-08-05T09:41:00Z", actor: "Asa Bello", action: "Published campaign", target: "The Game Needs Us", severity: "info" },
  { id: "l2", tenantId: "t-empire", at: "2026-08-05T09:12:00Z", actor: "Kunle Ade", action: "Adjusted points", target: "Ada Obi +250", severity: "warning" },
  { id: "l3", tenantId: "t-empire", at: "2026-08-04T21:03:00Z", actor: "System", action: "Fraud check flagged", target: "12 TikTok submissions", severity: "critical" },
  { id: "l4", tenantId: "t-empire", at: "2026-08-04T18:22:00Z", actor: "Zara Okoh", action: "Exported CSV", target: "Album listening survey", severity: "info" },
  { id: "l5", tenantId: "t-empire", at: "2026-08-04T11:15:00Z", actor: "Kunle Ade", action: "Created reward", target: "Virtual Meet & Greet Token", severity: "info" },
  { id: "l6", tenantId: "t-filmone", at: "2026-08-05T08:55:00Z", actor: "Ify Nduka", action: "Approved submissions", target: "42 Instagram reels", severity: "info" },
  { id: "l7", tenantId: "t-filmone", at: "2026-08-04T16:30:00Z", actor: "Dapo Ige", action: "Scheduled stream", target: "Cast Q&A with Nengi Adoki", severity: "info" },
  { id: "l8", tenantId: "t-filmone", at: "2026-08-03T19:02:00Z", actor: "System", action: "Rate limit applied", target: "IP 102.89.x.x", severity: "warning" },
  { id: "l9", tenantId: "t-henryholt", at: "2026-08-05T07:44:00Z", actor: "Tola Ray", action: "Created survey", target: "Book reading survey", severity: "info" },
  { id: "l10", tenantId: "t-henryholt", at: "2026-08-04T13:20:00Z", actor: "Nkem Anya", action: "Suspended user", target: "duplicate account", severity: "critical" },
  { id: "l11", tenantId: "t-henryholt", at: "2026-08-03T10:05:00Z", actor: "Tola Ray", action: "Updated reward stock", target: "Book Club Kit → 2,000", severity: "info" },
];

export const adjustments: Adjustment[] = [
  { id: "adj1", tenantId: "t-empire", userId: "u-0-0", fan: "Ada Obi", delta: 250, reason: "Compensation — stream not credited", by: "Kunle Ade", at: "2026-08-05T09:12:00Z" },
  { id: "adj2", tenantId: "t-empire", userId: "u-0-4", fan: "Fola Adeyemi", delta: -400, reason: "Reversed duplicate TikTok submission", by: "Asa Bello", at: "2026-08-04T20:41:00Z" },
  { id: "adj3", tenantId: "t-filmone", userId: "u-1-2", fan: "Zainab Musa", delta: 150, reason: "Trailer bonus manual grant", by: "Ify Nduka", at: "2026-08-04T12:02:00Z" },
  { id: "adj4", tenantId: "t-henryholt", userId: "u-2-7", fan: "Amaka Nwosu", delta: 300, reason: "Goodreads review verified late", by: "Tola Ray", at: "2026-08-03T15:38:00Z" },
];

/* ------------------------------------------------------------------ */
/* Time series                                                         */
/* ------------------------------------------------------------------ */

export function activitySeries(tenantId: string) {
  const rnd = seeded(tenantId.length * 811 + tenantId.charCodeAt(2) * 17);
  return Array.from({ length: 14 }, (_, i) => {
    const base = 400 + Math.floor(rnd() * 900);
    const day = 23 + i;
    return {
      day: day > 31 ? `Aug ${day - 31}` : `Jul ${day}`,
      joins: base,
      actions: Math.round(base * (2.4 + rnd())),
      points: Math.round(base * (18 + rnd() * 12)),
    };
  });
}

export const rewardCategories = [
  "Digital merch",
  "Exclusive content",
  "Discount code",
  "Experience",
  "Utility",
] as const;

export const targetingOptions = [
  "Nigeria",
  "Ghana",
  "Kenya",
  "UK diaspora",
  "US diaspora",
  "Superfans",
  "New fans",
  "Book clubs",
  "Cinema-goers",
  "Spotify listeners",
  "18–34",
];

export const moduleOptions = [
  "Stream",
  "Trailer",
  "Reading",
  "Quiz",
  "Guess the Celebrity",
  "Memory Game",
  "Word Search",
  "Social Tasks",
  "Survey",
];
