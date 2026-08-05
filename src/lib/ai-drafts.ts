import type { Campaign, Reward, SurveyQuestion } from "@/data/console";
import { imageOptionBank, moduleOptions, rewardCategories, targetingOptions } from "@/data/console";

const uid = (p: string) => `${p}-${Math.random().toString(36).slice(2, 8)}`;

const has = (text: string, ...words: string[]) => words.some((w) => text.includes(w));

function titleFrom(prompt: string, fallback: string) {
  const quoted = prompt.match(/["'“”']([^"'“”']{3,60})["'“”']/)?.[1];
  return quoted ?? fallback;
}

export function detectKind(prompt: string): Campaign["kind"] {
  const t = prompt.toLowerCase();
  if (has(t, "book", "novel", "read", "author", "chapter")) return "book";
  if (has(t, "movie", "film", "trailer", "premiere", "series", "cinema")) return "movie";
  return "album";
}

/** Drafts a full campaign from a one-line brief. */
export function draftCampaign(prompt: string, tenantId: string): Campaign {
  const t = prompt.toLowerCase();
  const kind = detectKind(prompt);
  const label = kind === "album" ? "Album Launch" : kind === "movie" ? "Movie Launch" : "Book Launch";
  const name = titleFrom(prompt, kind === "album" ? "New Drop" : kind === "movie" ? "Premiere Week" : "New Release");
  const fast = has(t, "weekend", "48", "friday", "three day", "3 day");
  const start = new Date();
  const end = new Date(Date.now() + (fast ? 2 : 21) * 86400000);

  const modules = new Set<string>([
    kind === "album" ? "Stream" : kind === "movie" ? "Trailer" : "Reading",
    "Quiz",
    "Social Tasks",
    "Survey",
  ]);
  if (has(t, "celeb", "cast", "star", "guess")) modules.add("Guess the Celebrity");
  if (has(t, "game", "fun", "memory", "puzzle")) modules.add("Memory Game");
  if (has(t, "word", "search", "lyric", "trivia")) modules.add("Word Search");
  if (modules.size < 6) modules.add("Guess the Celebrity");

  const primary =
    kind === "album" ? "Stream a track" : kind === "movie" ? "Watch the trailer" : "Chapter check-in";

  return {
    id: uid("c"),
    tenantId,
    name: `${label} — ${name}`,
    kind,
    status: "draft",
    description: `${name} lands with a full engagement loop: ${
      kind === "album" ? "streams" : kind === "movie" ? "trailer views" : "reading check-ins"
    }, a 30-question quiz, games and verified social tasks. Points convert into rewards, and the leaderboard decides the prize tier.`,
    cover: `https://picsum.photos/seed/${encodeURIComponent(name.toLowerCase().replace(/\s+/g, "-"))}/960/540`,
    startsAt: start.toISOString().slice(0, 10),
    endsAt: end.toISOString().slice(0, 10),
    creator: "Draft — set the creator name",
    genre: kind === "album" ? "Afro-fusion" : kind === "movie" ? "Drama · Thriller" : "Fantasy · Young Adult",
    rating: 0,
    headline: fast ? "48-hour sprint campaign" : "3-week engagement campaign",
    facts: [
      { label: "Format", value: label },
      { label: "Window", value: fast ? "48 hours" : "21 days" },
    ],
    themes: kind === "book" ? ["Identity", "Resistance"] : ["Authenticity", "Community"],
    modules: [...modules].filter((m) => moduleOptions.includes(m)),
    rules: [
      { id: uid("r"), label: primary, value: 10, cap: 20 },
      { id: uid("r"), label: "Correct quiz answer", value: 15, cap: 30 },
      { id: uid("r"), label: "Social action verified", value: 30, cap: 10 },
      { id: uid("r"), label: "Survey completed", value: 50, cap: 2 },
    ],
    targeting: targetingOptions.filter((o) =>
      has(t, o.toLowerCase()) ? true : ["Nigeria", "Superfans"].includes(o),
    ),
    prize: "Top 100 win exclusive digital content · Top 3 win a live experience",
    participants: 0,
    actions: 0,
    pointsIssued: 0,
    verification: 0,
  };
}

/** Drafts 5 rewards suited to the campaign kind. */
export function draftRewards(campaign: Campaign): Reward[] {
  const base: [string, string, (typeof rewardCategories)[number], number, number][] =
    campaign.kind === "album"
      ? [
          ["Exclusive digital album art", "Numbered cover art, delivered as a high-res download.", "Exclusive content", 500, 1000],
          ["Virtual meet & greet token", "Group video call with the artist after the listening party.", "Experience", 6000, 25],
          ["Limited edition merch code", "30% off the capsule merch drop.", "Discount code", 1200, 500],
          ["Early access to next release", "48-hour head start on the deluxe edition.", "Exclusive content", 900, 9999],
          ["Signed digital poster", "Signed tour poster as a print-ready file.", "Digital merch", 1500, 300],
        ]
      : campaign.kind === "movie"
        ? [
            ["Behind-the-scenes footage", "Unreleased set footage and interviews.", "Exclusive content", 700, 9999],
            ["Virtual Q&A ticket", "Live Q&A with the director and cast.", "Experience", 2500, 200],
            ["Movie merchandise discount", "25% off the official film store.", "Discount code", 800, 1000],
            ["Streaming access code", "Seven-day early streaming window.", "Digital merch", 1800, 400],
            ["Director's commentary", "Full-length commentary track.", "Exclusive content", 1000, 9999],
          ]
        : [
            ["Signed digital edition", "Anniversary edition with a signed digital plate.", "Digital merch", 2200, 500],
            ["Author Q&A access", "Live session with the author for book clubs.", "Experience", 3000, 150],
            ["Exclusive chapter preview", "First chapters of the next book in the series.", "Exclusive content", 600, 9999],
            ["Book club kit", "Discussion guide, playlist and printable map.", "Digital merch", 450, 2000],
            ["Bookmark design pack", "Six printable bookmarks by the cover artist.", "Digital merch", 250, 5000],
          ];

  return base.map(([title, description, category, cost, quantity], i) => ({
    id: uid("rw"),
    tenantId: campaign.tenantId,
    campaignId: campaign.id,
    title,
    description,
    category,
    image: `https://picsum.photos/seed/${campaign.id}-rw${i}/480/320`,
    cost,
    quantity,
    redeemed: 0,
    status: "active" as const,
  }));
}

/** Drafts a mixed-type survey (image / number / text) for the campaign. */
export function draftSurveyQuestions(campaign: Campaign): SurveyQuestion[] {
  const subject = campaign.kind === "album" ? "album" : campaign.kind === "movie" ? "film" : "book";
  return [
    {
      id: uid("q"),
      kind: "image",
      prompt:
        campaign.kind === "album"
          ? "Which collaborator should headline the deluxe?"
          : campaign.kind === "movie"
            ? "Which key art makes you want to watch?"
            : "Which cover should we print for the next edition?",
      required: true,
      points: 15,
      options: imageOptionBank.slice(0, 4),
    },
    {
      id: uid("q"),
      kind: "number",
      prompt: `Rate the ${subject} out of 10`,
      required: true,
      min: 1,
      max: 10,
      unit: "/10",
      points: 10,
    },
    {
      id: uid("q"),
      kind: "number",
      prompt:
        campaign.kind === "album"
          ? "How many full plays have you done?"
          : campaign.kind === "movie"
            ? "How many friends are you bringing?"
            : "How many chapters have you finished?",
      required: true,
      min: 0,
      max: campaign.kind === "book" ? 92 : 20,
      unit: campaign.kind === "book" ? "chapters" : campaign.kind === "movie" ? "people" : "plays",
      points: 10,
    },
    {
      id: uid("q"),
      kind: "text",
      prompt: `One line: what does this ${subject} mean to you?`,
      required: false,
      points: 15,
    },
  ];
}

export function draftCampaignCopy(campaign: Campaign) {
  return `${campaign.name.replace(/^.*— /, "")} is here. Play the games, run the streams, drag your friends in and climb the leaderboard before the timer runs out. ${campaign.prize}`;
}
