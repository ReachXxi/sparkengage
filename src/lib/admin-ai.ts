import { imageOptionBank, type AdminCampaign, type SurveyQuestion } from "@/data/admin";

export type CampaignDraft = {
  name: string;
  type: AdminCampaign["type"];
  startsAt: string;
  endsAt: string;
  modules: string[];
  points: { label: string; value: number }[];
  prize: string;
  copy: string;
  quizQuestions: string[];
  rewards: { title: string; category: string; emoji: string; cost: number; stock: number }[];
  surveyTitle: string;
  surveyQuestions: SurveyQuestion[];
  rationale: string[];
};

function iso(daysFromNow: number) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + daysFromNow);
  return d.toISOString().slice(0, 10);
}

/**
 * Deterministic prompt-to-campaign drafting. Reads intent keywords out of the
 * brief and picks the modules, economy, prizes and survey that fit it.
 */
export function draftFromPrompt(prompt: string): CampaignDraft {
  const text = prompt.toLowerCase();
  const quoted = prompt.match(/['"“]([^'"”]+)['"”]/)?.[1];

  const isFilm = /movie|film|trailer|premiere|series|show|cinema/.test(text);
  const isEvent = /tour|concert|festival|event|show night|ticket/.test(text);
  const isBrand = /brand|product|collab|sponsor|retail/.test(text);
  const isAlbum = /album|single|ep|track|song|mixtape|drop/.test(text) || (!isFilm && !isEvent && !isBrand);

  const title = quoted ?? (isFilm ? "Premiere Week" : isEvent ? "Live Season" : "New Drop");
  const type: string = isFilm ? "Movie Premiere" : isEvent ? "Event Series" : isBrand ? "Brand Collab" : "Album Launch";

  const modules = new Set<string>(["Quiz", "Social Tasks", "Survey"]);
  if (isFilm) modules.add("Trailer");
  if (isAlbum) modules.add("Stream");
  if (/lyric|lyrics|verse|song|single|album/.test(text)) modules.add("Unscramble the Lyrics");
  if (/game|fun|puzzle|pics|word/.test(text) || isBrand) modules.add("4 Pics 1 Word");
  if (/celeb|cast|star|feature|artist/.test(text) || isFilm) modules.add("Guess the Celeb");
  if (/prize|wheel|giveaway|spin/.test(text)) modules.add("Spin the Wheel");

  const short = /48|weekend|friday|two days|launch day/.test(text);
  const long = /month|season|december|quarter|tour/.test(text);
  const days = short ? 3 : long ? 45 : 14;

  const points = [
    isFilm ? { label: "Watch the trailer", value: 10 } : { label: "Stream a track", value: 10 },
    { label: "Correct quiz answer", value: 15 },
    { label: "Social action verified", value: 25 },
    { label: "Survey completed", value: 40 },
    { label: "Referral joined", value: 50 },
  ];
  if (modules.has("Unscramble the Lyrics")) points.splice(2, 0, { label: "Unscramble solved", value: 25 });

  const prize = isFilm
    ? "20 pairs of premiere tickets · Top 3 join the cast Q&A"
    : isEvent
      ? "Weekly ticket draws · Top 10 get backstage access"
      : `Top 100 win signed ${title} art · Top 3 win a studio session invite`;

  const copy = `${title} is live. ${
    isFilm ? "Watch the trailer" : "Stream the record"
  }, play the games, pull your friends in and climb the leaderboard before the timer runs out. Top fans leave with something real.`;

  const quizQuestions = [
    `Which ${isFilm ? "scene opens" : "track opens"} ${title}?`,
    `What date did ${title} officially arrive?`,
    `How many ${isFilm ? "cast leads" : "tracks"} are on ${title}?`,
    `Who is the biggest feature on ${title}?`,
    `Which city gets the loudest shoutout in ${title}?`,
    `True or false: ${title} was recorded in Lagos.`,
    `Which platform premiered ${title} first?`,
    `What does the title ${title} refer to?`,
  ];

  const rewards = [
    { title: `Signed ${title} artwork`, category: "Exclusive", emoji: "🖼️", cost: 500, stock: 250 },
    { title: `${title} early access`, category: isFilm ? "Events" : "Music", emoji: "🎟️", cost: 300, stock: 9999 },
    { title: "Airtime top-up ₦2,000", category: "Utility", emoji: "📱", cost: 400, stock: 300 },
    { title: isFilm ? "Cast video call" : "Studio session invite", category: "Experience", emoji: "🎚️", cost: 6000, stock: 3 },
  ];

  const surveyQuestions: SurveyQuestion[] = [
    {
      id: "q1",
      kind: "image",
      prompt: isFilm ? "Which poster makes you want to watch?" : "Which collaborator should headline the deluxe?",
      required: true,
      points: 15,
      options: imageOptionBank.slice(0, 4),
    },
    {
      id: "q2",
      kind: "number",
      prompt: isFilm ? "How many friends are you bringing?" : "How many times have you played it front to back?",
      required: true,
      min: 0,
      max: isFilm ? 10 : 50,
      unit: isFilm ? "people" : "plays",
      points: 10,
    },
    { id: "q3", kind: "number", prompt: `Rate ${title} out of 10`, required: true, min: 1, max: 10, unit: "/10", points: 10 },
    { id: "q4", kind: "text", prompt: `One line: what does ${title} mean to you?`, required: false, points: 15 },
  ];

  return {
    name: `${title} — ${isFilm ? "Premiere Week" : isEvent ? "Live Season" : "Launch Campaign"}`,
    type,
    startsAt: iso(1),
    endsAt: iso(1 + days),
    modules: [...modules],
    points,
    prize,
    copy,
    quizQuestions,
    rewards,
    surveyTitle: `${title} audience survey`,
    surveyQuestions,
    rationale: [
      `Detected a ${type.toLowerCase()} brief, so the core loop is ${isFilm ? "trailer → trivia → shares" : "stream → games → shares"}.`,
      `${days}-day window picked from the timing language in your brief.`,
      `${modules.size} modules selected; survey included so you get first-party data out of the drop.`,
      "Point economy weighted toward verified social actions and referrals — the highest-leverage actions.",
    ],
  };
}
