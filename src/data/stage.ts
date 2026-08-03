import oriadeAsset from "@/assets/oriade-tracklist.png.asset.json";
import movieImg from "@/assets/campaign-movie.jpg";
import partyImg from "@/assets/campaign-party.jpg";

const oriadeImg = oriadeAsset.url;


import owambe1 from "@/assets/pics-owambe-1.jpg";
import owambe2 from "@/assets/pics-owambe-2.jpg";
import owambe3 from "@/assets/pics-owambe-3.jpg";
import owambe4 from "@/assets/pics-owambe-4.jpg";
import danfo1 from "@/assets/pics-danfo-1.jpg";
import danfo2 from "@/assets/pics-danfo-2.jpg";
import danfo3 from "@/assets/pics-danfo-3.jpg";
import danfo4 from "@/assets/pics-danfo-4.jpg";
import suya1 from "@/assets/pics-suya-1.jpg";
import suya2 from "@/assets/pics-suya-2.jpg";
import suya3 from "@/assets/pics-suya-3.jpg";
import suya4 from "@/assets/pics-suya-4.jpg";

export const BRAND = "SPARKFAN";

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
  /** Zikoko-style sassy explanation shown after answering. */
  explainer: string;
};

export type PersonalityQuestion = {
  id: string;
  question: string;
  options: { label: string; tag: string }[];
};

export type SocialTask = {
  id: string;
  platform: "X" | "Instagram" | "TikTok";
  actionType: string;
  label: string;
  targetUrl: string;
  points: number;
};

export type LyricRound = {
  id: string;
  line: string;
  song: string;
  artist: string;
  points: number;
};

export type PicsPuzzle = {
  id: string;
  images: string[];
  answer: string;
  hint: string;
  points: number;
};

export type CelebRound = {
  id: string;
  name: string;
  aka: string;
  clues: string[];
  points: number;
};

export type AlbumTrack = {
  no: number;
  title: string;
  features?: string;
  note?: string;
};

export type AlbumInfo = {
  title: string;
  meaning: string;
  releaseDate: string;
  trackCount: number;
  featureCount: number;
  themes: string[];
  facts: { label: string; body: string }[];
  tracklist: AlbumTrack[];
  reception: { praise: string; criticism: string };
  cover: string;
};

export type Campaign = {
  id: string;
  title: string;
  creator: string;
  type: string;
  description: string;
  hero: string;
  live: boolean;
  endsAt: string;
  participants: number;
  actions: number;
  prize: string;
  album?: AlbumInfo;
  streams: { platform: string; track: string; url: string; points: number }[];
  quiz: { title: string; subtitle: string; questions: QuizQuestion[] };
  personality?: {
    title: string;
    subtitle: string;
    questions: PersonalityQuestion[];
    results: Record<string, { title: string; body: string }>;
  };
  games: {
    unscramble: LyricRound[];
    fourPics: PicsPuzzle[];
    celebrity: CelebRound[];
  };
  social: SocialTask[];
  leaderboard: { name: string; points: number }[];
};


const names = [
  "AdaOnFire",
  "TundeTheGoat",
  "ZaraVibes",
  "OgaBoss",
  "KemiKash",
  "DejiDrip",
  "NanaFlow",
  "SegunSpins",
  "AmakaAce",
  "BolaBanger",
  "ChiChiQueen",
  "MusaMagic",
];

const board = (seed: number) =>
  names
    .map((name, i) => ({ name, points: 4200 - i * 137 - seed * 11 }))
    .sort((a, b) => b.points - a.points);

/** Real, working links to the Oriade album across every major platform. */
const oriadeLinks = {
  spotify: "https://open.spotify.com/search/Davido%20ORIADE",
  apple: "https://music.apple.com/us/search?term=Davido%20ORIADE",
  youtube: "https://www.youtube.com/results?search_query=Davido+ORIADE+album",
  audiomack: "https://audiomack.com/search?q=Davido%20ORIADE",
  boomplay: "https://www.boomplay.com/search/default/Davido%20ORIADE",
};

/** ORIADÉ — Davido's sixth studio album, released 31 July 2026. 13 tracks, 9 features. */
const oriadeAlbum: AlbumInfo = {
  title: "ORIADÉ",
  meaning: "From the Yoruba 'Ori' (destiny) and 'Adé' (crown) — the crowned head.",
  releaseDate: "31 July 2026",
  trackCount: 13,
  featureCount: 9,
  themes: ["Afrobeats", "3-Step", "Amapiano / Afro-house", "Yoruba introspection", "15 years of OBO"],
  facts: [
    {
      label: "The vision",
      body: "Davido's sixth studio album and a definitive celebration of 15 years in the business — less English-driven internationalism, more homage to his Yoruba roots and his own journey.",
    },
    {
      label: "Shortest project yet",
      body: "Breaking his habit of 17-plus track albums, ORIADÉ runs a concise 13 tracks with 9 features.",
    },
    {
      label: "The 3-Step turn",
      body: "Classic upbeat Afrobeats and romantic rhythms sit beside electronic experiments — Davido leaned heavily into 3-Step, the rising South African Afro-house subgenre, after extended stays in SA.",
    },
    {
      label: "Global + local cast",
      body: "Mayorkun, Fola, Llona and NO11 from Nigeria; Aya Nakamura (France/Mali), Leon Thomas (US R&B) and Black Sherif (Ghana); JAZZWRLD and GL_Ceejay repping South Africa.",
    },
    {
      label: "Behind the pen",
      body: "Peruzzi is credited as a key songwriter on standouts including 'Guide', 'I Know Who I Be' and 'Already Falling'.",
    },
  ],
  tracklist: [
    { no: 1, title: "On The Road" },
    { no: 2, title: "Amazing Grace", features: "ft. Black Sherif" },
    { no: 3, title: "Julie", note: "Smooth Afrobeats romance" },
    { no: 4, title: "Constantly" },
    {
      no: 5,
      title: "I Know Who I Be",
      features: "with JAZZWRLD & GL_Ceejay",
      note: "Lead single — 15-year reflection; video revisits his childhood home",
    },
    {
      no: 6,
      title: "Gimme Dat Ting",
      features: "with NO11",
      note: "Afrobeats fused with Amapiano and Afro-house cadences",
    },
    { no: 7, title: "B4 B4", features: "with Mayorkun & Fola", note: "Nostalgic reunion, early fan favourite" },
    { no: 8, title: "Already Falling", note: "Co-written by Peruzzi" },
    { no: 9, title: "Tell Everybody", features: "ft. Leon Thomas" },
    { no: 10, title: "Yaya", features: "ft. Aya Nakamura", note: "Yoruba and French lyricism side by side" },
    { no: 11, title: "Zanzibar" },
    { no: 12, title: "Guide", note: "Co-written by Peruzzi" },
    { no: 13, title: "My Light", features: "with Llona" },
  ],
  reception: {
    praise:
      "Fans and media have called it mature, cohesive and heartfelt — a more grounded, elevated vocal performance that chooses artistic evolution over chasing streaming trends.",
    criticism:
      "Mixed reviews argue the 13-track run plays it too safe and lacks the explosive street anthems of blockbusters like A Good Time or Timeless.",
  },
  cover: oriadeImg,
};


const owambePuzzle: PicsPuzzle = {
  id: "owambe",
  images: [owambe1, owambe2, owambe3, owambe4],
  answer: "owambe",
  hint: "Aso-ebi, party jollof, live band, and money flying. Six letters.",
  points: 25,
};

const danfoPuzzle: PicsPuzzle = {
  id: "danfo",
  images: [danfo1, danfo2, danfo3, danfo4],
  answer: "danfo",
  hint: "Yellow. Loud. Conductor never has change. Five letters.",
  points: 25,
};

const suyaPuzzle: PicsPuzzle = {
  id: "suya",
  images: [suya1, suya2, suya3, suya4],
  answer: "suya",
  hint: "Yaji, onions, newspaper, 9pm cravings. Four letters.",
  points: 25,
};

export const campaigns: Campaign[] = [
  {
    id: "oriade-album",
    title: "Davido — ORIADÉ Album Takeover",
    creator: "Davido Music Worldwide",
    type: "Album Launch",
    description:
      "ORIADÉ don land — 13 tracks, 9 features, 15 years of OBO. Stream it on every platform, unscramble the hooks, guess the legends and drag your whole group chat in.",
    hero: oriadeImg,
    live: true,
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 52).toISOString(),
    participants: 41237,
    actions: 189025,
    prize: "Top 50 get ORIADÉ digital collectibles · Top 3 get signed vinyl + 30 Billion Gang merch",
    album: oriadeAlbum,
    streams: [
      { platform: "Spotify", track: "ORIADÉ — Full Album (13 tracks)", url: oriadeLinks.spotify, points: 12 },
      { platform: "Apple Music", track: "ORIADÉ — Full Album", url: oriadeLinks.apple, points: 12 },
      {
        platform: "YouTube",
        track: "I Know Who I Be (with JAZZWRLD & GL_Ceejay) — Official Video",
        url: oriadeLinks.youtube,
        points: 10,
      },
      { platform: "Audiomack", track: "Gimme Dat Ting (with NO11)", url: oriadeLinks.audiomack, points: 10 },
      { platform: "Boomplay", track: "B4 B4 (with Mayorkun & Fola)", url: oriadeLinks.boomplay, points: 10 },

    ],
    quiz: {
      title: "How well do you know ORIADÉ?",
      subtitle: "Twelve questions on the album, the features and 15 years of OBO. No Googling.",
      questions: [
        {
          id: "q1",
          question: "ORIADÉ is Davido's… studio album",
          options: ["Third", "Fourth", "Fifth", "Sixth"],
          correctAnswer: 3,
          points: 15,
          explainer: "Number six, and the one he built as a celebration of 15 years in the business.",
        },
        {
          id: "q2",
          question: "ORIADÉ officially dropped on…",
          options: ["31 July 2026", "1 January 2026", "14 February 2026", "31 December 2025"],
          correctAnswer: 0,
          points: 15,
          explainer: "31 July 2026. The group chat has not recovered.",
        },
        {
          id: "q3",
          question: "The title ORIADÉ comes from two Yoruba words meaning…",
          options: ["Market and money", "Destiny and crown", "Rain and journey", "Voice and fire"],
          correctAnswer: 1,
          points: 15,
          explainer: "'Ori' (destiny) + 'Adé' (crown) — the crowned head. Album title with shoulders.",
        },
        {
          id: "q4",
          question: "How many tracks are on ORIADÉ?",
          options: ["13", "17", "20", "9"],
          correctAnswer: 0,
          points: 15,
          explainer: "13 — his shortest project yet, after years of 17-plus track albums.",
        },
        {
          id: "q5",
          question: "'I Know Who I Be' features which two South African acts?",
          options: [
            "Kabza De Small & DJ Maphorisa",
            "JAZZWRLD & GL_Ceejay",
            "Focalistic & Musa Keys",
            "Uncle Waffles & Tyla",
          ],
          correctAnswer: 1,
          points: 15,
          explainer: "JAZZWRLD & GL_Ceejay. Lead single, and the video revisits his childhood home.",
        },
        {
          id: "q6",
          question: "Which subgenre did Davido lean into after his long stays in South Africa?",
          options: ["Drill", "3-Step", "Highlife", "Dancehall"],
          correctAnswer: 1,
          points: 15,
          explainer: "3-Step — the rising South African Afro-house / electronic strain all over this album.",
        },
        {
          id: "q7",
          question: "'Yaya' features the French-Malian superstar…",
          options: ["Aya Nakamura", "Tiwa Savage", "Amaarae", "Angélique Kidjo"],
          correctAnswer: 0,
          points: 15,
          explainer: "Aya Nakamura. Yoruba and French lyricism trading bars on the same record.",
        },
        {
          id: "q8",
          question: "'B4 B4' is a reunion with which two artists?",
          options: ["Mayorkun & Fola", "Peruzzi & Dremo", "Zlatan & Naira Marley", "Olamide & Fireboy"],
          correctAnswer: 0,
          points: 15,
          explainer: "Mayorkun & Fola — instant fan favourite, pure nostalgia.",
        },
        {
          id: "q9",
          question: "'Amazing Grace' features which Ghanaian rapper?",
          options: ["Sarkodie", "Black Sherif", "Stonebwoy", "King Promise"],
          correctAnswer: 1,
          points: 15,
          explainer: "Blacko himself. Track 2, and it hits.",
        },
        {
          id: "q10",
          question: "Which hitmaker is credited as a key writer on 'Guide' and 'Already Falling'?",
          options: ["Peruzzi", "LollyBhoy", "Kel-P", "Sarz"],
          correctAnswer: 0,
          points: 15,
          explainer: "Peruzzi. The pen behind half your favourite OBO hooks.",
        },
        {
          id: "q11",
          question: "'Tell Everybody' features which American R&B singer-producer?",
          options: ["Leon Thomas", "Bryson Tiller", "Chris Brown", "Giveon"],
          correctAnswer: 0,
          points: 10,
          explainer: "Leon Thomas — one of nine features on the album.",
        },
        {
          id: "q12",
          question: "Which track closes ORIADÉ?",
          options: ["Zanzibar", "Guide", "My Light (with Llona)", "On The Road"],
          correctAnswer: 2,
          points: 10,
          explainer: "Track 13: 'My Light' with Llona. 'On The Road' opens it.",
        },
      ],
    },
    personality: {
      title: "Which ORIADÉ track are you?",
      subtitle: "Answer honestly. We will know if you're forming.",

      questions: [
        {
          id: "p1",
          question: "It's 2am at the owambe after-party. Where are you?",
          options: [
            { label: "On the table, shirt gone, spraying money", tag: "gbedu" },
            { label: "In the corner texting your situationship", tag: "soft" },
            { label: "Counting how much the DJ collected", tag: "hustle" },
          ],
        },
        {
          id: "p2",
          question: "Your salary alert just landed. First move?",
          options: [
            { label: "Book a table in Lekki immediately", tag: "gbedu" },
            { label: "Send something to your person", tag: "soft" },
            { label: "Straight to the savings app", tag: "hustle" },
          ],
        },
        {
          id: "p3",
          question: "Pick a Lagos fit",
          options: [
            { label: "Full agbada, chain outside", tag: "gbedu" },
            { label: "White linen and slides", tag: "soft" },
            { label: "Black tee, laptop bag, one AirPod", tag: "hustle" },
          ],
        },
        {
          id: "p4",
          question: "Someone says 'Wizkid is better than Davido' in your group chat.",
          options: [
            { label: "Voice note. Eleven minutes. No breathing.", tag: "gbedu" },
            { label: "Laughing emoji, keep scrolling", tag: "soft" },
            { label: "Send streaming numbers like a data analyst", tag: "hustle" },
          ],
        },
        {
          id: "p5",
          question: "Your December plan?",
          options: [
            { label: "Detty December, every single show", tag: "gbedu" },
            { label: "Beach, small crowd, good speakers", tag: "soft" },
            { label: "Working. Money doesn't sleep.", tag: "hustle" },
          ],
        },
      ],
      results: {
        gbedu: {
          title: "You are 'Gbedu Nation' 🔊",
          body: "Loud, unbothered, built for stadium speakers. Your neighbours know all your songs against their will.",
        },
        soft: {
          title: "You are 'Soft Life (Interlude)' 🕊️",
          body: "Smooth, low-stress, allergic to drama. You'd rather cruise with the windows down than argue online.",
        },
        hustle: {
          title: "You are 'Lagos Money' 💼",
          body: "Every song is a business plan to you. You'll be at the party — but you're leaving by 1am, you have alerts to chase.",
        },
      },
    },
    games: {
      unscramble: [
        { id: "u1", line: "if you no get money hide your face", song: "If", artist: "Davido", points: 25 },
        { id: "u2", line: "thirty billion for the account", song: "If (Remix era)", artist: "Davido", points: 25 },
        { id: "u3", line: "my people dey pray for me", song: "Ojuelegba", artist: "Wizkid", points: 25 },
        { id: "u4", line: "baby calm down calm down", song: "Calm Down", artist: "Rema", points: 20 },
        { id: "u5", line: "lonely at the top", song: "Lonely At The Top", artist: "Asake", points: 20 },
      ],
      fourPics: [owambePuzzle, danfoPuzzle, suyaPuzzle],
      celebrity: [
        {
          id: "c1",
          name: "davido",
          aka: "OBO",
          clues: ["30 Billion Gang.", "E choke.", "Omo Baba Olowo from Atlanta to Lagos."],
          points: 30,
        },
        {
          id: "c2",
          name: "wizkid",
          aka: "Star Boy",
          clues: ["Ojuelegba to the world.", "Made In Lagos.", "Grammy for Essence."],
          points: 30,
        },
        {
          id: "c3",
          name: "tems",
          aka: "Temilade",
          clues: ["Husky voice, no stress.", "Essence.", "Wrote for Beyoncé's Lion King album."],
          points: 30,
        },
      ],
    },
    social: [
      {
        id: "s1",
        platform: "X",
        actionType: "follow",
        label: "Follow @davido on X",
        targetUrl: "https://x.com/intent/follow?screen_name=davido",
        points: 25,
      },
      {
        id: "s2",
        platform: "X",
        actionType: "retweet",
        label: "Tweet that Oriade is out",
        targetUrl:
          "https://x.com/intent/post?text=ORIADE%20is%20out%20now.%20Streaming%20it%20on%20SPARKFAN%20and%20collecting%20my%20points%20%F0%9F%94%A5",
        points: 20,
      },
      {
        id: "s3",
        platform: "Instagram",
        actionType: "like",
        label: "Like the Oriade cover art post",
        targetUrl: "https://www.instagram.com/davido/",
        points: 10,
      },
      {
        id: "s4",
        platform: "TikTok",
        actionType: "share",
        label: "Post your #OriadeChallenge dance",
        targetUrl: "https://www.tiktok.com/tag/oriade",
        points: 40,
      },
    ],
    leaderboard: board(0),
  },
  {
    id: "detty-december",
    title: "Detty December — Lagos Concert Series",
    creator: "SPARKFAN Originals",
    type: "Concert Series",
    description: "Thirty-one days of gbedu. Stream the playlist, play the games, win tickets to the last show.",
    hero: partyImg,
    live: true,
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 20).toISOString(),
    participants: 26120,
    actions: 94310,
    prize: "Top 20 win two tickets to the closing night + backstage access",
    streams: [
      {
        platform: "Spotify",
        track: "Detty December 2026 Playlist",
        url: "https://open.spotify.com/search/detty%20december",
        points: 10,
      },
      {
        platform: "Apple Music",
        track: "Afrobeats Hits — December",
        url: "https://music.apple.com/us/search?term=afrobeats%20hits",
        points: 10,
      },
      {
        platform: "Audiomack",
        track: "Naija Party Starters",
        url: "https://audiomack.com/search?q=naija%20party",
        points: 8,
      },
    ],
    quiz: {
      title: "Are you a real Detty December veteran?",
      subtitle: "If you've never queued for two hours at a Lekki show, sit this one out.",
      questions: [
        {
          id: "q1",
          question: "A Lagos concert billed for 8pm actually starts at…",
          options: ["8pm sharp", "9pm", "11:30pm", "Whenever the headliner lands"],
          correctAnswer: 3,
          points: 15,
          explainer: "African time is undefeated. Bring a power bank and patience.",
        },
        {
          id: "q2",
          question: "Amapiano's signature sound is the…",
          options: ["Talking drum", "Log drum", "Steel pan", "Shekere"],
          correctAnswer: 1,
          points: 15,
          explainer: "The log drum. That fat bouncy bass that hijacks your waist.",
        },
        {
          id: "q3",
          question: "Which dance took over TikTok first?",
          options: ["Zanku", "Legwork", "Shaku Shaku", "Gwara Gwara"],
          correctAnswer: 2,
          points: 15,
          explainer: "Shaku Shaku came first, then Zanku (Legwork) took the belt in 2019.",
        },
        {
          id: "q4",
          question: "'Soro Soke' became a national phrase during…",
          options: ["The 2020 EndSARS protests", "A Big Brother season", "A Burna Boy tour", "AFCON 2021"],
          correctAnswer: 0,
          points: 15,
          explainer: "Soro soke werey — speak up. October 2020 changed the whole vocabulary.",
        },
        {
          id: "q5",
          question: "Best time to leave the venue if you don't want traffic?",
          options: ["Before the headliner", "During the encore", "5am with everyone else", "You never leave"],
          correctAnswer: 0,
          points: 10,
          explainer: "Painful but true. Leave early or greet the Third Mainland at sunrise.",
        },
      ],
    },
    personality: {
      title: "What kind of Detty December person are you?",
      subtitle: "Everyone knows one of these four. You are one of them.",
      questions: [
        {
          id: "p1",
          question: "Concert starts 8pm. You arrive…",
          options: [
            { label: "7:30pm, front row", tag: "frontrow" },
            { label: "11pm, when it's peak", tag: "latecomer" },
            { label: "You watch on Instagram Live", tag: "onlinefan" },
          ],
        },
        {
          id: "p2",
          question: "Your December budget?",
          options: [
            { label: "Whatever it takes", tag: "frontrow" },
            { label: "One big show, that's all", tag: "latecomer" },
            { label: "Data subscription only", tag: "onlinefan" },
          ],
        },
        {
          id: "p3",
          question: "IJGB (I Just Got Back) friends land. You…",
          options: [
            { label: "Plan the full itinerary", tag: "frontrow" },
            { label: "Join for the last two nights", tag: "latecomer" },
            { label: "Send them a list and stay home", tag: "onlinefan" },
          ],
        },
      ],
      results: {
        frontrow: {
          title: "You are Front Row Energy 🎤",
          body: "You've queued, you've screamed, you've lost a slipper. Legend behaviour.",
        },
        latecomer: {
          title: "You are the Strategic Latecomer ⏰",
          body: "You arrive when the crowd is warm and the headliner is 20 minutes out. Efficient.",
        },
        onlinefan: {
          title: "You are the Livestream General 📱",
          body: "Best seat in Lagos: your bed. You'll still know every setlist by morning.",
        },
      },
    },
    games: {
      unscramble: [
        { id: "u1", line: "e don cast last last", song: "Last Last", artist: "Burna Boy", points: 25 },
        { id: "u2", line: "put your hands in the air", song: "Detty December Anthem", artist: "SPARKFAN", points: 20 },
        { id: "u3", line: "you don't need no other body", song: "Essence", artist: "Wizkid & Tems", points: 25 },
      ],
      fourPics: [suyaPuzzle, danfoPuzzle],
      celebrity: [
        {
          id: "c1",
          name: "burna",
          aka: "African Giant",
          clues: ["Twice As Tall.", "Port Harcourt boy.", "Grandfather managed Fela."],
          points: 30,
        },
        {
          id: "c2",
          name: "asake",
          aka: "Mr Money",
          clues: ["Choir-style hooks.", "Amapiano meets fuji.", "Lonely at the top."],
          points: 30,
        },
      ],
    },
    social: [
      {
        id: "s1",
        platform: "X",
        actionType: "follow",
        label: "Follow the concert series on X",
        targetUrl: "https://x.com/search?q=detty%20december",
        points: 25,
      },
      {
        id: "s2",
        platform: "TikTok",
        actionType: "share",
        label: "Share your Detty December clip",
        targetUrl: "https://www.tiktok.com/tag/dettydecember",
        points: 30,
      },
    ],
    leaderboard: board(6),
  },
  {
    id: "nollywood-premiere",
    title: "Owambe Nights — Nollywood Premiere Week",
    creator: "Sunbeam Studios",
    type: "Movie Premiere",
    description: "Watch the trailer, survive the Nollywood trivia, win premiere tickets in Lagos.",
    hero: movieImg,
    live: false,
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 96).toISOString(),
    participants: 12891,
    actions: 39450,
    prize: "Top 100 win double premiere tickets",
    streams: [
      {
        platform: "YouTube",
        track: "Owambe Nights — Official Trailer",
        url: "https://www.youtube.com/results?search_query=nollywood+trailer",
        points: 12,
      },
    ],
    quiz: {
      title: "Nollywood, how far?",
      subtitle: "You've watched 400 of these films. Prove it.",
      questions: [
        {
          id: "q1",
          question: "In Nollywood, a slow zoom on someone's face means…",
          options: ["Wickedness is loading", "Someone is hungry", "It's a dream", "Interval"],
          correctAnswer: 0,
          points: 15,
          explainer: "Add the 'dun dun dun' sound and you know the village people have arrived.",
        },
        {
          id: "q2",
          question: "Which one-name actress is Nollywood royalty?",
          options: ["Genevieve", "Adunni", "Bimpe", "Ngozi"],
          correctAnswer: 0,
          points: 15,
          explainer: "Genevieve Nnaji. Lionheart went to Netflix and she never looked back.",
        },
        {
          id: "q3",
          question: "'Owambe' is best described as…",
          options: ["A big Yoruba party", "A market", "A movie studio", "A dance step"],
          correctAnswer: 0,
          points: 10,
          explainer: "Aso-ebi, small chops, live band, and at least one uncle causing trouble.",
        },
        {
          id: "q4",
          question: "Nollywood is famous for releasing…",
          options: [
            "Fewer films than Hollywood",
            "More films per year than Hollywood",
            "Only three films a year",
            "Only cinema films",
          ],
          correctAnswer: 1,
          points: 15,
          explainer: "Volume is the vibe. Nollywood out-produces Hollywood on film count every year.",
        },
        {
          id: "q5",
          question: "Part 1 of a Nollywood classic usually ends with…",
          options: ["A wedding", "'To God Be The Glory'", "A cliffhanger and 'Part 2'", "Credits rolling silently"],
          correctAnswer: 2,
          points: 10,
          explainer: "And Part 2 was never in the shop. Trauma.",
        },
      ],
    },
    games: {
      unscramble: [
        { id: "u1", line: "no wahala for owambe night", song: "Owambe Nights Theme", artist: "Sunbeam", points: 20 },
        { id: "u2", line: "money fall on you", song: "Fall", artist: "Davido", points: 25 },
      ],
      fourPics: [owambePuzzle],
      celebrity: [
        {
          id: "c1",
          name: "genevieve",
          aka: "Nollywood royalty",
          clues: ["Lionheart.", "One name is enough.", "Directed and starred in her own Netflix film."],
          points: 30,
        },
      ],
    },
    social: [
      {
        id: "s1",
        platform: "Instagram",
        actionType: "follow",
        label: "Follow @SunbeamStudios",
        targetUrl: "https://www.instagram.com/explore/tags/nollywood/",
        points: 25,
      },
      {
        id: "s2",
        platform: "X",
        actionType: "mention",
        label: "Tweet your favourite Nollywood scene",
        targetUrl: "https://x.com/intent/post?text=Owambe%20Nights%20premiere%20loading%20on%20SPARKFAN",
        points: 20,
      },
    ],
    leaderboard: board(3),
  },
];

export const funFacts = [
  "Davido's 'Fall' spent over three years on the US Billboard R&B chart. Three. Years.",
  "'Essence' was the first Nigerian song to crack the Billboard Hot 100 top 10.",
  "Nollywood releases more films per year than Hollywood. Volume is the vibe.",
  "Wizkid's 'Ojuelegba' remix with Drake and Skepta dropped in 2015 and changed everything.",
  "Amapiano's log drum sound started in South African townships around 2012.",
  "Fela Kuti once released an album whose cover mocked the Nigerian army. Legend.",
  "Burna Boy's grandfather, Benson Idonije, was Fela Kuti's first manager.",
  "Tems wrote and produced her earliest songs alone in her bedroom. Excuses, who?",
  "Rema's 'Calm Down' remix with Selena Gomez passed a billion streams. Benin boy did that.",
  "Party jollof tastes better because of the firewood smoke. It's science, leave us alone.",
];

export const rewards = [
  {
    id: "r1",
    title: "Oriade Digital Collectible",
    category: "Exclusive Content",
    cost: 500,
    stock: 120,
    emoji: "🖼️",
    description: "Limited 1-of-500 Oriade cover art, digitally signed.",
  },
  {
    id: "r2",
    title: "SPARKFAN Snapback",
    category: "Merch",
    cost: 1200,
    stock: 40,
    emoji: "🧢",
    description: "Gold-on-purple embroidered cap. Ships nationwide.",
  },
  {
    id: "r3",
    title: "Oriade Deluxe Early Access",
    category: "Music",
    cost: 300,
    stock: 999,
    emoji: "🎵",
    description: "Hear the deluxe tracks 24 hours before everyone else.",
  },
  {
    id: "r4",
    title: "Premiere Ticket (x2)",
    category: "Movies",
    cost: 2500,
    stock: 15,
    emoji: "🎟️",
    description: "Two seats at the Owambe Nights premiere in Lagos.",
  },
  {
    id: "r5",
    title: "Backstage Video Call",
    category: "Exclusive Content",
    cost: 4000,
    stock: 5,
    emoji: "📞",
    description: "15 minutes with the artist after the closing show.",
  },
  {
    id: "r6",
    title: "Detty December Ticket",
    category: "Events",
    cost: 900,
    stock: 60,
    emoji: "🍿",
    description: "One entry to a Lagos concert series night of your choice.",
  },
];

export const pointPacks = [
  { id: "p1", points: 100, price: "₦500" },
  { id: "p2", points: 500, price: "₦2,000" },
  { id: "p3", points: 1000, price: "₦3,500" },
];

export const badgeCatalog = [
  { id: "b1", name: "First Spin", emoji: "🎡", description: "Spun the wheel once.", need: 1, kind: "spins" },
  { id: "b2", name: "Quiz Master", emoji: "🧠", description: "Answered 10 quiz questions.", need: 10, kind: "quiz" },
  { id: "b3", name: "Social Butterfly", emoji: "🦋", description: "Verified 5 social actions.", need: 5, kind: "social" },
  { id: "b4", name: "Gamer", emoji: "🎮", description: "Won 3 games.", need: 3, kind: "games" },
  { id: "b5", name: "Streamer", emoji: "🎧", description: "Streamed 3 tracks.", need: 3, kind: "stream" },
  { id: "b6", name: "Big Baller", emoji: "💸", description: "Earned 1,000 points.", need: 1000, kind: "points" },
] as const;
