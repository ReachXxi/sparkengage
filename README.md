# FanStage Connect

# Functional Requirements Document (FRD): STAGE Platform

**Version:** 1.0  
**Date:** August 2, 2026  
**Product Vision:** A vibrant, AI-powered fan engagement platform where creators launch customized campaigns with games, quizzes, and social actions, and users earn rewards for participating.

---

## 1. Introduction & Scope

### 1.1 Product Overview
STAGE is a mobile-first engagement platform that enables creators (artists, labels, movie studios, brands) to launch interactive campaigns. Users participate by streaming content, playing games (inspired by Zikoko's quiz style), completing social media actions, and earning points redeemable for prizes. The platform features an AI assistant for seamless campaign creation and a daily engagement ritual with a "Spin & Fun Fact" mechanic.

### 1.2 Target Users
| User Type | Description | Primary Goals |
| :--- | :--- | :--- |
| **Creators** | Artists, labels, movie studios, brand marketers | Launch campaigns quickly, drive engagement, track ROI, build fanbase |
| **End-Users** | Fans, entertainment enthusiasts, gamers | Have fun, earn rewards, discover new content, compete with friends |

### 1.3 Key Differentiators
- **AI-Powered Campaign Creation:** Natural language setup, auto-generated content.
- **Zikoko-Inspired Quizzes:** Culturally relevant, personality-driven, and shareable.
- **Social Tracking Engine:** Automated verification of likes, follows, mentions, and retweets.
- **Daily Retention Loop:** Spin wheel + "Did You Know?" entertainment fact.

---

## 2. User-Facing Features (End-User Application)

### 2.1 Onboarding & Authentication
| Requirement ID | Feature | Description | Priority |
| :--- | :--- | :--- | :--- |
| **U-ONB-01** | Sign Up / Log In | Email, phone, or social login (Google, X, Instagram). | **P0** |
| **U-ONB-02** | Profile Setup | Display name, profile picture, interests (genres, artists). | **P0** |
| **U-ONB-03** | Social Account Connection | One-time OAuth flow to connect X, Instagram, Facebook, TikTok for automated social action verification. | **P0** |
| **U-ONB-04** | Tutorial Walkthrough | Gamified onboarding: "Spin the wheel, play a quiz, earn points." | **P1** |

### 2.2 Home Feed & Discovery
| Requirement ID | Feature | Description | Priority |
| :--- | :--- | :--- | :--- |
| **U-HOME-01** | Campaign Cards Feed | Vertically scrolling feed of active campaigns. Each card shows: Hero image, campaign title, creator name, time remaining, participant count, and "Join" button. | **P0** |
| **U-HOME-02** | Personalized Recommendations | Based on user's interests and past participation, show relevant campaigns. | **P1** |
| **U-HOME-03** | Trending Campaigns | Highlight campaigns with the highest engagement in the last hour. | **P1** |
| **U-HOME-04** | Live Campaign Banner | Prominent banner for campaigns that are currently "Live" (e.g., "Burna Boy Listening Party - LIVE NOW!"). | **P0** |

### 2.3 Daily Engagement Loop (Retention Hook)
| Requirement ID | Feature | Description | Priority |
| :--- | :--- | :--- | :--- |
| **U-SPIN-01** | Daily Spin Wheel | A colorful, animated wheel displayed prominently on the Home tab. Users get **one free spin per day**. Rewards: 10, 20, 50, or 100 Points. | **P0** |
| **U-SPIN-02** | "Did You Know?" Fun Fact | Immediately after the spin, a bright, Zikoko-styled card displays an entertainment trivia fact. Users can "Share Fact" or "Save to Trivia Deck." | **P0** |
| **U-SPIN-03** | Spin Streak Bonus | Bonus points for consecutive daily spins (e.g., Day 7: +50 bonus points). | **P1** |
| **U-SPIN-04** | Purchase Points | Users can buy additional Points Packs (e.g., 100 points for $0.99) via in-app purchase. | **P0** |

### 2.4 Campaign Participation Experience
#### 2.4.1 Campaign Landing Page
| Requirement ID | Feature | Description | Priority |
| :--- | :--- | :--- | :--- |
| **U-CAMP-01** | Campaign Header | Hero image/video, campaign title, creator name, and live stats (participants, actions completed). | **P0** |
| **U-CAMP-02** | Action Tabs | Horizontal scrollable tabs: **Stream**, **Quiz**, **Games**, **Social Tasks**, **Leaderboard**. | **P0** |
| **U-CAMP-03** | Real-Time Updates | Live counter of total points earned in the campaign and participant count. | **P1** |
| **U-CAMP-04** | Campaign Timer | Countdown to campaign end. | **P0** |

#### 2.4.2 Streaming Module
| Requirement ID | Feature | Description | Priority |
| :--- | :--- | :--- | :--- |
| **U-STR-01** | One-Click Stream | Button that redirects to Spotify/Apple Music/YouTube. After a defined listen/watch time (e.g., 30 seconds), user earns points. | **P0** |
| **U-STR-02** | Stream Verification | Platform listens for playback confirmation via deep linking or Spotify SDK. | **P0** |
| **U-STR-03** | Multi-Platform Support | Support for Spotify, Apple Music, YouTube, Boomplay, Audiomack. | **P1** |

#### 2.4.3 Zikoko-Inspired Quiz Module
*(This is the heart of the experience, mirroring Zikoko's fun, personality-driven style.)*

| Requirement ID | Feature | Description | Priority |
| :--- | :--- | :--- | :--- |
| **U-QUIZ-01** | Quiz Cards | Full-screen, vibrant, single-question cards. One question per screen. | **P0** |
| **U-QUIZ-02** | Question Types | Multiple-choice, true/false, and "Personality Quiz" (e.g., "Which Afrobeats star are you?"). | **P0** |
| **U-QUIZ-03** | Immediate Feedback | After selection, show: "Nailed it! ✅ +15 Points" (with celebration animation) or "Ope! ❌ Correct answer was: [Answer]. Try the next one!" (with the correct answer highlighted). | **P0** |
| **U-QUIZ-04** | Quiz Progress | Progress bar showing "Question 3 of 10." | **P0** |
| **U-QUIZ-05** | Personality Results | At the end of a personality quiz, show a fun, shareable result card (e.g., "You are 80% Wizkid, 20% Burna Boy!"). | **P1** |
| **U-QUIZ-06** | Share Results | One-click share to social media with a branded image of the user's quiz result. | **P0** |
| **U-QUIZ-07** | Quiz Content Sources | Quizzes can be pre-built by the creator or generated by AI (see Creator Features). | **P0** |

#### 2.4.4 Games Module
| Requirement ID | Feature | Description | Priority |
| :--- | :--- | :--- | :--- |
| **U-GAME-01** | Unscramble the Lyrics | Jumbled lyrics displayed as colorful tiles. User types or taps the correct order. | **P0** |
| **U-GAME-02** | 4 Pics 1 Word (Music/Movie Edition) | Four images with a common theme. User guesses the word/phrase. | **P0** |
| **U-GAME-03** | Guess the Celebrity | Pixelated/blurred image that clears slightly with a "Hint" button (costs points). | **P0** |
| **U-GAME-04** | Game Score & Timer | Each game shows a timer and a score based on speed and accuracy. | **P0** |
| **U-GAME-05** | Game Leaderboard | Within the campaign, users can see the top scores for each game. | **P1** |

#### 2.4.5 Social Tasks Module
| Requirement ID | Feature | Description | Priority |
| :--- | :--- | :--- | :--- |
| **U-SOC-01** | Social Action Buttons | Prominent buttons: "Follow @Artist on X (25 pts)" or "Retweet This (15 pts)." | **P0** |
| **U-SOC-02** | One-Click Action | Button takes user to the social platform's action page (with a pre-filled post). | **P0** |
| **U-SOC-03** | Verify Action | After the user performs the action, they click "Verify" in the STAGE app. The platform checks the social API and awards points immediately. | **P0** |
| **U-SOC-04** | Verification Status | Shows a loading spinner while verifying, then a success or fail message. | **P0** |
| **U-SOC-05** | Unique Shareable Links | For "Share" actions, a unique coded link is generated for each user to track clicks. | **P0** |
| **U-SOC-06** | Manual Verification Fallback | If API verification fails, allow users to submit a screenshot for manual review by the creator (with a warning about processing time). | **P2** |

#### 2.4.6 Leaderboard Module
| Requirement ID | Feature | Description | Priority |
| :--- | :--- | :--- | :--- |
| **U-LEAD-01** | Global Campaign Leaderboard | Shows top 100 participants and the user's current rank. | **P0** |
| **U-LEAD-02** | Friends Leaderboard | Shows how the user ranks against their friends (requires social graph integration). | **P1** |
| **U-LEAD-03** | Real-Time Updates | Leaderboard updates in real-time as users earn points. | **P0** |
| **U-LEAD-04** | Reward Visibility | Shows the prize for the top finishers (e.g., "Top 50 win exclusive content"). | **P0** |

### 2.5 Points & Rewards
| Requirement ID | Feature | Description | Priority |
| :--- | :--- | :--- | :--- |
| **U-PTS-01** | Points Wallet | A dedicated tab showing total points, recent transactions, and points history. | **P0** |
| **U-PTS-02** | Reward Catalog | A "Redeem" section displaying available prizes (digital, physical, experiential). | **P0** |
| **U-PTS-03** | Reward Filtering | Filter rewards by category (e.g., "Music," "Movies," "Merch," "Exclusive Content"). | **P1** |
| **U-PTS-04** | Instant Redemption | Users click "Redeem" on a reward. The platform deducts points and provides a reward code or digital asset immediately. | **P0** |
| **U-PTS-05** | Points Purchase | In-app purchase of points packs (e.g., 100 pts, 500 pts, 1000 pts). | **P0** |
| **U-PTS-06** | Points Expiry | Points expire after 90 days of inactivity (to encourage engagement). | **P1** |

### 2.6 Profile & Social Features
| Requirement ID | Feature | Description | Priority |
| :--- | :--- | :--- | :--- |
| **U-PROF-01** | User Profile | Display name, avatar, total points earned, badges earned, campaign history. | **P0** |
| **U-PROF-02** | Badge System | Users earn badges for milestones (e.g., "Quiz Master: Completed 50 quizzes," "Social Butterfly: 100 social actions verified"). | **P1** |
| **U-PROF-03** | Friend Connections | Follow friends and see their activity and leaderboard ranks. | **P1** |
| **U-PROF-04** | Notifications | Push/in-app notifications for: Points earned, reward unlocks, campaign ending soon, friend activity. | **P0** |

### 2.7 Content Moderation
| Requirement ID | Feature | Description | Priority |
| :--- | :--- | :--- | :--- |
| **U-MOD-01** | Report Content | Users can report inappropriate campaign content, quizzes, or user profiles. | **P0** |
| **U-MOD-02** | AI Content Filtering | All AI-generated content is run through a moderation API to filter offensive/prohibited content. | **P0** |
| **U-MOD-03** | Manual Review Queue | Admin dashboard to review flagged content. | **P1** |

---

## 3. Creator-Facing Features (Dashboard & Management)

### 3.1 Onboarding & Account Setup
| Requirement ID | Feature | Description | Priority |
| :--- | :--- | :--- | :--- |
| **C-ONB-01** | Creator Registration | Email sign-up, business verification (label, studio, brand). | **P0** |
| **C-ONB-02** | Profile & Branding | Upload logo, brand colors, social media handles, and bio. | **P0** |
| **C-ONB-03** | Billing Setup | Credit card / PayPal for paying campaign fees. | **P0** |
| **C-ONB-04** | API Key Management | For enterprise creators, generate API keys for custom integrations. | **P1** |

### 3.2 AI Campaign Assistant (Setup Wizard)
| Requirement ID | Feature | Description | Priority |
| :--- | :--- | :--- | :--- |
| **C-AI-01** | Natural Language Input | A chat-like prompt: *"Tell us about your campaign in a few words."* The AI parses the response to auto-fill campaign fields. | **P0** |
| **C-AI-02** | Auto-Generate Campaign Structure | Based on the input, AI creates: Campaign name, type (Album/Movie/Brand), suggested modules, point values, and prize structure. | **P0** |
| **C-AI-03** | Content Scraping | AI pulls artist/movie metadata from Spotify/Apple Music/IMDb APIs to suggest assets. | **P0** |
| **C-AI-04** | AI-Generated Copy | Writes campaign descriptions, titles, and social media posts in the platform's playful tone. | **P0** |
| **C-AI-05** | Quiz/Game Content Generation | AI creates up to 50 quiz questions, lyrics unscrambles, "Guess the Celebrity" clues, and "4 Pics 1 Word" images (using DALL-E). | **P0** |
| **C-AI-06** | Campaign Preview | A "Preview" button shows what the campaign will look like to users, with a "Publish" or "Edit" option. | **P0** |
| **C-AI-07** | AI Recommendation Engine | Suggests optimal campaign duration, prize points, and module combinations based on historical platform data. | **P1** |

### 3.3 Campaign Builder (Manual & Advanced Settings)
| Requirement ID | Feature | Description | Priority |
| :--- | :--- | :--- | :--- |
| **C-BLD-01** | Campaign Type Selection | Choose from: Album Launch, Listening Party, Movie Trailer, TV Show Premiere, Brand Collab, Custom. | **P0** |
| **C-BLD-02** | Campaign Dates | Set start and end date/time. Option for "Live" or "On-Demand" (48-hour window). | **P0** |
| **C-BLD-03** | Entry Rules | Toggle: Free-to-play, Points required (e.g., "50 pts to enter"), or Action-based (e.g., "Follow to unlock"). | **P0** |
| **C-BLD-04** | Module Selection | Checkbox list of modules to include: Stream, Quiz, Unscramble, 4 Pics, Guess the Celebrity, Social Tasks, Polls, Surveys. | **P0** |
| **C-BLD-05** | Content Upload | Upload assets: Hero image/video, song snippets, quiz images, custom trivia questions. Drag-and-drop interface. | **P0** |
| **C-BLD-06** | Point Assignment | For each module, set point values per action (e.g., "Stream = 10 pts," "Quiz correct = 15 pts"). | **P0** |
| **C-BLD-07** | Prize Configuration | Define the prize pool (e.g., "Top 100 win exclusive digital art," "Top 3 win signed merch"). Upload reward codes or set up automated fulfillment. | **P0** |
| **C-BLD-08** | Automated Prize Distribution | For digital rewards (e.g., discount codes), the platform generates unique codes for winners automatically. | **P0** |
| **C-BLD-09** | Social Action Rules | For each social action (Follow, Like, Retweet, Mention, Comment), set the target URL, platform, and point value. | **P0** |
| **C-BLD-10** | Polls & Surveys | Custom questions to gather fan feedback (e.g., "What's your favorite track?"). Responses are tracked but not scored. | **P1** |
| **C-BLD-11** | Campaign Tagging | Add campaign hashtags and keywords for social listening and tracking. | **P1** |
| **C-BLD-12** | Save as Draft | Save campaign as draft for later editing. | **P0** |

### 3.4 Content Management (Quizzes & Games)
| Requirement ID | Feature | Description | Priority |
| :--- | :--- | :--- | :--- |
| **C-CONT-01** | Quiz Builder | Interface to create custom quizzes with: Title, Description, Image, Questions (up to 50), Correct Answers, Point Value per question. | **P0** |
| **C-CONT-02** | Personality Quiz Builder | Create quizzes with multiple outcomes (e.g., "Which artist are you?"). Assign point values to each outcome. | **P1** |
| **C-CONT-03** | Game Builder | Customize "Unscramble the Lyrics" with your own jumbled lyrics. Customize "4 Pics 1 Word" with your own images and answer. | **P0** |
| **C-CONT-04** | Question Bank | Store past quizzes and games in a library for reuse in future campaigns. | **P1** |
| **C-CONT-05** | AI-Assisted Bulk Generation | "Generate 20 Questions" button uses AI to create content based on a topic or artist name. | **P0** |

### 3.5 Tracking & Analytics Dashboard
| Requirement ID | Feature | Description | Priority |
| :--- | :--- | :--- | :--- |
| **C-ANL-01** | Live Campaign Dashboard | Real-time view of: Total participants, total actions, points earned, top performers, and engagement per module. | **P0** |
| **C-ANL-02** | Social Action Tracker | Breakdown of social actions by platform (X, Instagram, TikTok) and type (Follow, Like, Retweet, Mention). Shows verification success rates. | **P0** |
| **C-ANL-03** | User Demographics | Location, age, gender (if available) of participants. | **P1** |
| **C-ANL-04** | Module Performance | Which modules (Quiz, Games, Streams) had the highest completion rates and point generation. | **P0** |
| **C-ANL-05** | Funnel Analysis | Shows user drop-off at each step (e.g., Campaign view → Joining → Completing quiz → Redeeming prize). | **P1** |
| **C-ANL-06** | Export Data | Export campaign data as CSV or PDF. | **P0** |

### 3.6 AI-Generated Reporting
| Requirement ID | Feature | Description | Priority |
| :--- | :--- | :--- | :--- |
| **C-REP-01** | Post-Campaign Executive Summary | AI-generated narrative report with: Key metrics, top insights, and visual charts. | **P0** |
| **C-REP-02** | Actionable Recommendations | AI suggests specific actions for the next campaign (e.g., "Target Lagos users," "Add a Dance Challenge module"). | **P0** |
| **C-REP-03** | ROI Analysis | AI calculates cost per engagement (CPE) and compares it to industry benchmarks. | **P1** |
| **C-REP-04** | Historical Data Comparison | AI compares current campaign performance to the creator's past campaigns and provides trend analysis. | **P1** |
| **C-REP-05** | Shareable Report | One-click to generate a branded report PDF to share with stakeholders. | **P0** |

### 3.7 Creator Monetization & Billing
| Requirement ID | Feature | Description | Priority |
| :--- | :--- | :--- | :--- |
| **C-BILL-01** | Campaign Pricing Tiers | Basic ($99), Pro ($199), Enterprise (Custom). | **P0** |
| **C-BILL-02** | Points Purchase | Buy Points Packs to distribute as rewards (e.g., 10,000 points for $100). | **P0** |
| **C-BILL-03** | Invoice & Receipts | Generate and download invoices for campaign fees. | **P1** |
| **C-BILL-04** | Account Balance | View remaining points balance and transaction history. | **P0** |

### 3.8 Compliance & Moderation
| Requirement ID | Feature | Description | Priority |
| :--- | :--- | :--- | :--- |
| **C-MOD-01** | Content Guidelines | Display platform content policies and terms of service. | **P0** |
| **C-MOD-02** | Campaign Review | All campaigns are auto-reviewed by an AI moderation system before going live. | **P0** |
| **C-MOD-03** | Manual Override | Platform admin can manually approve, reject, or suspend campaigns. | **P1** |

---

## 4. Technical Requirements

### 4.1 Platform Architecture
| Component | Technology Stack | Description |
| :--- | :--- | :--- |
| **Frontend (User)** | React Native (iOS/Android) + Web PWA | Mobile-first experience, with web support for desktop users. |
| **Frontend (Creator Dashboard)** | Next.js + Tailwind CSS | Responsive, feature-rich dashboard for campaign management. |
| **Backend API** | Node.js (Express) or Python (Django) | RESTful API with WebSocket for real-time updates. |
| **Database** | PostgreSQL (Primary) + Redis (Caching) | PostgreSQL for structured data (users, campaigns, points). Redis for real-time leaderboards and session management. |
| **File Storage** | AWS S3 or Cloudinary | Store campaign images, videos, and user avatars. |
| **Social Media APIs** | X API, Instagram Graph API, Facebook Graph API, TikTok API | For verification of social actions. |
| **AI/ML Integration** | OpenAI GPT-4 API, DALL-E 3, Genius API, Spotify API, Apple Music API | For content generation and reporting. |
| **Real-Time Updates** | WebSockets (Socket.io) | For live leaderboards, points updates, and campaign counters. |
| **Analytics** | Mixpanel / Amplitude (for user analytics) + Custom AI reporting engine | Track user behavior and campaign performance. |
| **Payment Gateway** | Stripe / Paystack | Handle in-app purchases and creator payments. |

### 4.2 API Integrations
| Integration | Purpose | Priority |
| :--- | :--- | :--- |
| **Spotify Web API** | Pull artist metadata, album art, and track lists for campaign content. | **P0** |
| **Apple Music API** | Same as Spotify. | **P1** |
| **YouTube Data API** | Pull video thumbnails and metadata for movie/trailer campaigns. | **P0** |
| **Genius API** | Fetch lyrics for "Unscramble the Lyrics" games. | **P0** |
| **IMDb API** | Fetch movie metadata for trivia questions. | **P1** |
| **OpenAI GPT-4** | Generate campaign structure, copy, trivia, and report narratives. | **P0** |
| **OpenAI DALL-E 3** | Generate images for "4 Pics 1 Word" games. | **P1** |
| **OpenAI Moderation** | Filter inappropriate content in AI-generated quizzes and user submissions. | **P0** |
| **X API v2** | Verify follows, retweets, likes, and mentions. | **P0** |
| **Instagram Graph API** | Verify follows and likes. | **P0** |
| **TikTok API** | Verify shares and follows. | **P1** |
| **Stripe / Paystack** | Process payments for points purchases and campaign fees. | **P0** |

### 4.3 Security & Compliance
| Requirement | Description | Priority |
| :--- | :--- | :--- |
| **Data Encryption** | All user data encrypted at rest (AES-256) and in transit (TLS 1.3). | **P0** |
| **OAuth 2.0** | Secure social media connections and user authentication. | **P0** |
| **GDPR / CCPA Compliance** | User data privacy controls, data deletion requests, and consent management. | **P0** |
| **Rate Limiting** | Protect APIs from abuse and social media API limits. | **P0** |
| **Fraud Detection** | AI-based detection of fake accounts, bot activity, and point farming. | **P1** |

---

## 5. User Journeys

### 5.1 End-User Journey: Daily Engagement Loop

1. **Open App** → See Home Feed with Campaign Cards.
2. **Daily Spin** → Tap prominent "Spin" button → Wheel animates → User gets 30 Points + "Did You Know?" Fun Fact pop-up.
3. **Join Campaign** → Tap "Join Now" on a campaign card (e.g., "Burna Boy Album Launch").
4. **Participate** → Navigate tabs:
   - **Stream:** Tap "Listen on Spotify" → Earn 10 points.
   - **Quiz:** Answer 10 fun, Zikoko-style questions → Earn 15 points per correct answer.
   - **Games:** Play "Unscramble the Lyrics" → Earn up to 25 points.
   - **Social Tasks:** Click "Follow @BurnaBoy on X" → Verify → Earn 25 points.
5. **Check Leaderboard** → See rank "You're #12!"
6. **Redeem Rewards** → Go to Wallet → Spend 500 points on "Exclusive Digital Art" → Get unique download link.

### 5.2 Creator Journey: Campaign Creation

1. **Log In** to Creator Dashboard.
2. **Create Campaign** → Click "Create New Campaign."
3. **AI Assistant** → Type: *"I'm launching my new single 'Shayo' next Friday. I want streams and lyrics games."*
4. **AI Auto-Fills** → Campaign name, dates, suggested modules (Stream + Unscramble), point values, and prize structure. AI also pulls album art and suggests quiz questions.
5. **Preview & Customize** → Edit content, upload custom images, adjust points.
6. **Publish** → Campaign goes live. Creator gets a unique campaign link to share.
7. **Monitor Live Dashboard** → See real-time participants, actions, and points.
8. **Review Post-Campaign Report** → AI generates an executive summary with insights and recommendations for the next campaign.

---

## 6. Success Metrics (KPIs)

| Metric | Target | Measurement |
| :--- | :--- | :--- |
| **User Retention** | 40% daily active users (DAU/MAU) | Analytics tracking daily spins and logins. |
| **Campaign Completion Rate** | >60% of users who join complete at least 1 action | Funnel analysis. |
| **Social Action Verification Success Rate** | >95% success rate for automated verification | Social API analytics. |
| **Creator Campaign Launch Time** | <5 minutes from start to publish (with AI) | In-app timing tracking. |
| **Points Purchase Conversion** | 5% of active users purchase points packs | Payment analytics. |
| **Average Campaign Engagement** | 10+ actions per participating user | Campaign analytics. |
| **AI Report Utility** | 80% of creators report AI insights as "valuable" | Post-campaign survey. |

---

## 7. Appendix: Non-Functional Requirements

| Requirement | Description | Priority |
| :--- | :--- | :--- |
| **Performance** | App load time < 3 seconds on 4G. Leaderboard updates < 500ms. | **P0** |
| **Scalability** | Support 100,000 concurrent users per campaign. | **P0** |
| **Availability** | 99.9% uptime SLA. | **P0** |
| **Internationalization** | Support for multiple languages (English, French, Portuguese initially). | **P1** |
| **Accessibility** | WCAG 2.1 AA compliance for users with disabilities. | **P1** |
| **Offline Mode** | Users can view campaigns and quizzes offline; actions sync when back online. | **P2** |

Here's the revised comprehensive prompt for Lovable, now explicitly specifying a **web application** (React SPA with responsive design) rather than a mobile app. All mobile references have been replaced with web-first terminology.

---

**LOVABLE PROMPT – BUILD FULL STAGE PLATFORM (WEB APPLICATION)**

---

I need you to build a complete, fully functional **web application** called "STAGE" – a fan engagement platform where creators run campaigns with games, quizzes, and social actions, and users earn rewards. This is a **responsive web app** that works on desktop, tablet, and mobile browsers. Build everything described below without asking for any clarification, permissions, or breaks. Continue until every component is fully working. Do not stop or request input. Build the entire system now.

---

### PROJECT OVERVIEW

**Platform Name:** STAGE

**Platform Type:** Responsive Web Application (SPA – Single Page Application)

**Core Concept:** A vibrant, web-based engagement platform inspired by Zikoko's playful quiz style. Creators (artists, labels, movie studios, brands) launch customizable campaigns with games, quizzes, and social tasks. Users participate, earn points, and redeem rewards. The platform features AI-powered campaign creation and a daily "Spin & Fun Fact" retention loop.

**Primary Audience:** African youth culture, entertainment fans, and content creators.

**Tech Stack:** 
- **Frontend:** React with React Router, Tailwind CSS, Framer Motion for animations. Build as a single-page application (SPA) with client-side routing.
- **Backend:** Node.js with Express.js.
- **Database:** PostgreSQL with Prisma ORM.
- **Caching & Real-Time:** Redis for session management, leaderboards, and WebSockets (Socket.io) for live updates.
- **File Storage:** AWS S3 or Cloudinary for images and videos.
- **AI Integrations:** OpenAI GPT-4, DALL-E 3, Moderation API.
- **Social APIs:** X API, Instagram Graph API, Facebook Graph API, TikTok API.
- **Music APIs:** Spotify Web API, Apple Music API, Genius API.
- **Payment:** Stripe for payments and payouts.

---

### USER-FACING FEATURES (FRONTEND – REACT WEB APP)

**1. Onboarding & Authentication**
- Build a full authentication system with email/password and social login (Google, X, Instagram). Use JWT tokens stored in HTTP-only cookies.
- After login, show a one-time OAuth flow to connect X, Instagram, and Facebook accounts for social action verification.
- Create a gamified tutorial walkthrough: "Spin the wheel, play a quiz, earn points." This should be an interactive modal/overlay on first login.

**2. Home Feed (Responsive Grid Layout)**
- Build a responsive grid of campaign cards (3 columns on desktop, 2 on tablet, 1 on mobile).
- Each card displays: Hero image, campaign title, creator name, time remaining, participant count, and a "Join Now" button.
- Add a "Trending" section showing campaigns with highest engagement in the last hour (horizontal scroll on mobile, grid on desktop).
- Include a prominent "Live Campaign" banner for campaigns currently active (full-width hero section).

**3. Daily Engagement Loop (Retention Hook)**
- Build a colorful, animated Spin Wheel prominently on the Home page (above the fold). Users get one free spin per day.
- Rewards: 10, 20, 50, or 100 Points.
- After the spin, display a bright, card-based "Did You Know?" entertainment fun fact. Include "Share Fact" and "Save to Trivia Deck" buttons.
- Implement a spin streak bonus (e.g., Day 7: +50 bonus points) tracked in localStorage or database.
- Add a "Purchase Points" button with Stripe integration for points packs (opens a Stripe Checkout modal).

**4. Campaign Participation (Dynamic Route: /campaign/:id)**
- Build a Campaign Landing Page with: Hero image/video, title, creator name, live stats (participants, actions), and a countdown timer.
- Create horizontal scrollable tabs (desktop: inline tabs, mobile: swipeable): **Stream**, **Quiz**, **Games**, **Social Tasks**, **Leaderboard**.

**Stream Module:**
- Build a "One-Click Stream" button that redirects to Spotify/Apple Music/YouTube in a new tab. After 30 seconds of listening/watching (tracked via page focus or Spotify SDK), user earns points.
- Implement stream verification using Spotify Web API (check user's recent listening history) or YouTube Data API.

**Quiz Module (Zikoko-inspired):**
- Build full-viewport, vibrant, single-question cards. One question per screen with smooth transitions between questions.
- Support multiple-choice, true/false, and "Personality Quiz" types.
- Show immediate feedback: "Nailed it! ✅ +15 Points" with celebration animation (confetti), or "Ope! ❌ Correct answer was: [Answer]" with correct answer highlighted.
- Add a progress bar showing "Question 3 of 10."
- At the end of personality quizzes, show a fun, shareable result card (e.g., "You are 80% Wizkid, 20% Burna Boy!").
- Include a "Share Results" button with branded image generation (HTML canvas to image).

**Games Module:**
- Build **"Unscramble the Lyrics"** : Display jumbled lyrics as colorful draggable tiles (or tap-to-select on mobile). User arranges in correct order.
- Build **"4 Pics 1 Word"** : Show four images with a common theme. User guesses the word/phrase via text input.
- Build **"Guess the Celebrity"** : Show pixelated/blurred image that clears slightly with a "Hint" button (costs points).
- Each game includes a timer and score based on speed and accuracy.
- Add a game-specific leaderboard within the campaign.

**Social Tasks Module:**
- Build prominent action buttons: "Follow @Artist on X (25 pts)" or "Retweet This (15 pts)."
- On click, redirect to the social platform's action page with pre-filled content (opens in new tab).
- After action, user returns to the web app and clicks a "Verify" button. Call the social API to check and award points immediately.
- Show loading spinner during verification, then success or fail message via toast notifications.
- For "Share" actions, generate unique coded links for each user to track clicks (e.g., `stage.com/c/xyz123`).

**Leaderboard Module:**
- Build a global campaign leaderboard showing top 100 participants and the user's current rank.
- Add a friends leaderboard (requires social graph integration – use X/Instagram friends list).
- Ensure real-time updates using WebSockets (Socket.io).
- Display prize visibility (e.g., "Top 50 win exclusive content").

**5. Points & Rewards (Route: /wallet)**
- Build a Points Wallet page showing total points, recent transactions (table/list), and history (filterable by date).
- Create a Reward Catalog displaying available prizes (digital, physical, experiential) as a responsive grid.
- Add reward filtering by category (Music, Movies, Merch, Exclusive Content).
- Implement instant redemption: User clicks "Redeem," points deducted, reward code or digital asset provided immediately (display in modal).
- Integrate Stripe Checkout for in-app points purchases (100 pts, 500 pts, 1000 pts).
- Implement points expiry after 90 days of inactivity (show warning in wallet).

**6. Profile & Social Features (Route: /profile)**
- Build user profile page with: Display name, avatar (upload via Cloudinary), total points earned, badges earned (grid view), campaign history (list).
- Create a badge system for milestones (e.g., "Quiz Master: Completed 50 quizzes," "Social Butterfly: 100 social actions verified"). Badges are SVG icons with unlock conditions.
- Add friend connections: Follow friends and see their activity and leaderboard ranks (search bar to find users).
- Build notification system: In-app notifications (bell icon dropdown) for points earned, reward unlocks, campaign ending soon, friend activity. Use Server-Sent Events or WebSockets for real-time notifications.

**7. Content Moderation**
- Add a "Report Content" button on every campaign, quiz, and user profile. Opens a modal with reason selection and text field.
- Integrate AI content filtering (OpenAI Moderation API) for all AI-generated content before display.
- Build an admin dashboard (separate route) for manual review queue with approve/reject/delete actions.

---

### CREATOR-FACING FEATURES (BACKEND DASHBOARD – /dashboard)

**1. Creator Onboarding & Account Setup**
- Build registration with email and business verification (label, studio, brand) – collect company name, tax ID, website.
- Profile setup: Upload logo, brand colors (hex codes), social media handles, bio.
- Billing setup: Credit card/PayPal via Stripe Connect (onboarding flow).
- API key management for enterprise creators (generate/revoke keys).

**2. AI Campaign Assistant (Setup Wizard)**
- Build a chat-like prompt interface (similar to ChatGPT): "Tell us about your campaign in a few words." Parse the response to auto-fill campaign fields.
- Auto-generate campaign structure: Name, type (Album/Movie/Brand), suggested modules, point values, prize structure.
- Scrape content from Spotify/Apple Music/IMDb APIs to suggest assets (album art, track lists, movie posters).
- Generate campaign copy and social media posts in the platform's playful tone.
- Generate up to 50 quiz questions, lyrics unscrambles, celebrity clues, and "4 Pics 1 Word" images using DALL-E.
- Include a "Preview" button showing what the campaign looks like to users (opens in new tab), with "Publish" or "Edit" options.
- Add an AI recommendation engine suggesting optimal duration, prize points, and module combinations based on historical platform data.

**3. Campaign Builder (Manual & Advanced Settings)**
- Build campaign type selection: Album Launch, Listening Party, Movie Trailer, TV Show Premiere, Brand Collab, Custom.
- Set campaign start/end date/time with datetime pickers. Option for "Live" or "On-Demand" (48-hour window).
- Entry rules: Toggle Free-to-play, Points required (e.g., "50 pts to enter"), or Action-based (e.g., "Follow to unlock").
- Module selection: Checkbox list (Stream, Quiz, Unscramble, 4 Pics, Guess the Celebrity, Social Tasks, Polls, Surveys).
- Content upload: Drag-and-drop interface for hero image/video, song snippets, quiz images, custom trivia (accept images, audio, video).
- Point assignment: For each module, set point values per action via input fields.
- Prize configuration: Define prize pool (e.g., "Top 100 win exclusive digital art," "Top 3 win signed merch"). Upload reward codes (CSV) or set up automated fulfillment.
- Automated prize distribution: For digital rewards (discount codes, digital downloads), generate unique codes for winners automatically.
- Social action rules: For each action (Follow, Like, Retweet, Mention, Comment), set target URL, platform (dropdown), and point value.
- Polls & Surveys: Build a form builder to create custom questions (multiple choice, text, rating scale).
- Campaign tagging: Add hashtags and keywords for social listening.
- Save as Draft functionality (drafts stored in database with status: draft).

**4. Content Management (Quizzes & Games)**
- Build a Quiz Builder interface to create custom quizzes with: Title, Description, Image (upload), Questions (up to 50), Correct Answers, Point Value per question.
- Build a Personality Quiz Builder with multiple outcomes (e.g., "Which artist are you?"). Assign point values to each outcome.
- Build a Game Builder to customize "Unscramble the Lyrics" with own jumbled lyrics, "4 Pics 1 Word" with own images and answer.
- Create a Question Bank (database table) to store past quizzes and games for reuse.
- Add an "AI-Assisted Bulk Generation" button: "Generate 20 Questions" based on a topic or artist name (calls OpenAI API).

**5. Tracking & Analytics Dashboard**
- Build a Live Campaign Dashboard with real-time view of: Total participants, total actions, points earned, top performers, engagement per module (bar charts).
- Create a Social Action Tracker: Breakdown by platform (X, Instagram, TikTok) and type (Follow, Like, Retweet, Mention). Show verification success rates (pie chart).
- Display User Demographics: Location (map), age, gender (if available from social data).
- Show Module Performance: Which modules had highest completion rates and point generation (line chart over time).
- Build Funnel Analysis: User drop-off at each step (Campaign view → Joining → Completing quiz → Redeeming prize) as a funnel chart.
- Add Export Data: Export campaign data as CSV or PDF (server-side generation).

**6. AI-Generated Reporting**
- Build a Post-Campaign Executive Summary with AI-generated narrative: Key metrics, top insights, visual charts (using Chart.js or Recharts).
- Include Actionable Recommendations: AI suggests specific actions for the next campaign (e.g., "Target Lagos users," "Add a Dance Challenge module").
- Calculate ROI Analysis: Cost per engagement (CPE) compared to industry benchmarks (show as gauge chart).
- Add Historical Data Comparison: Compare current campaign performance to past campaigns with trend analysis (line chart overlay).
- Build a Shareable Report: One-click to generate a branded report PDF (use Puppeteer or PDFKit).

**7. Creator Monetization & Billing**
- Build campaign pricing tiers: Basic ($99), Pro ($199), Enterprise (Custom). Display feature comparison table.
- Points Purchase: Buy Points Packs to distribute as rewards (e.g., 10,000 points for $100). Stripe Checkout integration.
- Generate Invoices & Receipts (PDF generation).
- Display Account Balance: View remaining points balance and transaction history (table).

**8. Compliance & Moderation**
- Display Content Guidelines and Terms of Service (static pages).
- Auto-review all campaigns with AI moderation before going live (OpenAI Moderation API).
- Admin manual override to approve, reject, or suspend campaigns (admin dashboard).

---

### TECHNICAL REQUIREMENTS (FULL STACK)

**1. Architecture**
- **Frontend:** React with React Router (v6), Tailwind CSS, Framer Motion for animations. Build as a single-page application (SPA) with client-side routing.
- **Backend:** Node.js with Express.js, RESTful API structure.
- **Database:** PostgreSQL with Prisma ORM (schema defined below).
- **Caching & Real-Time:** Redis for session management, leaderboards, and WebSockets (Socket.io) for live updates.
- **File Storage:** AWS S3 or Cloudinary for images and videos.
- **AI Integrations:** OpenAI GPT-4, DALL-E 3, Moderation API.
- **Social APIs:** X API v2, Instagram Graph API, Facebook Graph API, TikTok API.
- **Music APIs:** Spotify Web API, Apple Music API, Genius API.
- **Payment:** Stripe (Checkout for points purchases, Connect for creator payouts).
- **Hosting:** Deploy as a full-stack app on Vercel (frontend) + Railway/Heroku (backend), or use a single platform like Render.

**2. Database Schema (Prisma Models)**
- Build these tables: 
  - `User` (id, email, passwordHash, displayName, avatar, createdAt, lastActive)
  - `Creator` (id, userId, companyName, taxId, website, brandColors, bio, logo)
  - `Campaign` (id, creatorId, title, type, description, heroImage, startDate, endDate, status [draft, live, ended], entryType [free, points, action], entryPoints, prizeDescription, totalParticipants, totalActions)
  - `CampaignModule` (id, campaignId, moduleType [stream, quiz, unscramble, fourPics, guessCelebrity, social, poll, survey], settings JSON, pointValue)
  - `Quiz` (id, campaignId, title, description, image, type [trivia, personality])
  - `QuizQuestion` (id, quizId, question, options JSON, correctAnswer, pointValue)
  - `PersonalityResult` (id, quizId, title, description, image, minScore, maxScore)
  - `Game` (id, campaignId, gameType [unscramble, fourPics, guessCelebrity], content JSON, pointValue)
  - `SocialTask` (id, campaignId, platform [x, instagram, tiktok], actionType [follow, like, retweet, mention, comment], targetUrl, pointValue)
  - `SocialVerification` (id, userId, socialTaskId, status [pending, verified, failed], attemptCount, lastAttempt)
  - `PointsTransaction` (id, userId, amount, type [earn, spend, purchase, bonus], source [spin, quiz, game, social, stream, purchase], referenceId)
  - `Reward` (id, campaignId, title, description, image, type [digital, physical, experiential], stock, pointCost, fulfillmentData JSON)
  - `RewardRedemption` (id, userId, rewardId, pointsSpent, redemptionCode, redeemedAt)
  - `Notification` (id, userId, type, title, body, read, createdAt)
  - `Badge` (id, name, description, icon, triggerType [quiz_count, social_actions, points_total])
  - `UserBadge` (id, userId, badgeId, unlockedAt)
  - `Leaderboard` (id, campaignId, userId, totalPoints, rank, lastUpdated)
  - `AnalyticsEvent` (id, campaignId, userId, eventType, metadata JSON, createdAt)

**3. API Integrations – Detailed Implementation**

**Social Verification Engine:**
- Build a service that connects to X API v2 to verify follows, retweets, likes, and mentions. Use OAuth 2.0 for user authorization (store access/refresh tokens).
- For Instagram, use the Graph API to verify follows and likes.
- For TikTok, use TikTok API to verify shares and follows.
- Implement a queue system (Bull/Redis) to handle API rate limits. Users' points are "reserved" and processed in batches (worker processes).
- For "Share" actions, generate unique coded URLs (e.g., `stage.com/c/xyz123`) and track clicks using middleware.
- If API verification fails, implement a manual review fallback (screenshot upload with warning about processing time).

**AI Content Generation:**
- Build a service that calls OpenAI GPT-4 API to parse creator input and generate campaign structure, copy, and trivia.
- Use DALL-E 3 to generate "4 Pics 1 Word" images based on campaign themes (store in S3/Cloudinary).
- Use Genius API and Spotify API to fetch lyrics and artist metadata for quiz content.
- Use IMDb API for movie trivia.
- Implement RAG (Retrieval-Augmented Generation) with Pinecone or Weaviate to store and retrieve campaign templates and past performance data for better AI suggestions over time.

**Stream Verification:**
- Integrate Spotify Web API to check user's recent listening history (via OAuth). Verify that the user played the campaign track for at least 30 seconds.
- For YouTube, use YouTube Data API to verify video watch time via the user's history (requires OAuth).
- Implement deep linking for Apple Music and Audiomack (redirect with tracking params, verify via API callbacks).

**Real-Time Updates:**
- Use WebSockets (Socket.io) to push live updates to the leaderboard, campaign stats, and user points.
- Redis pub/sub for scaling real-time events across multiple server instances.

**4. Security & Compliance**
- Implement JWT-based authentication with refresh tokens (stored in HTTP-only cookies for security).
- Use bcrypt for password hashing (salt rounds: 12).
- Encrypt all user data at rest (AES-256) and in transit (TLS 1.3).
- Add rate limiting (express-rate-limit) to APIs to prevent abuse (e.g., 100 requests per minute per IP).
- Build GDPR/CCPA compliance: User data deletion requests (admin tool), consent management (cookies banner).
- Implement fraud detection: AI-based detection of fake accounts, bot activity, point farming (e.g., patterns of rapid, identical actions). Use Redis to track and flag suspicious activity.

**5. Testing & Deployment**
- Write unit tests for all critical services (Jest for backend, React Testing Library for frontend).
- Write integration tests for API endpoints (Supertest).
- Deploy using Docker containers and orchestrate with Kubernetes (or use a simpler platform like Heroku/Railway).
- Set up CI/CD pipeline with GitHub Actions (automated testing and deployment on push to main branch).

---

### USER JOURNEYS TO IMPLEMENT END-TO-END

**End-User Journey:**
1. User visits webapp, signs up with email, completes tutorial.
2. On Home page, clicks "Spin" on daily spin wheel, receives 30 points + "Did You Know?" fact.
3. Clicks "Join Now" on "Burna Boy Album Launch" campaign card.
4. Navigates to "Stream" tab, clicks "Listen on Spotify," earns 10 points after 30 seconds (Spotify SDK verifies).
5. Goes to "Quiz" tab, answers 10 questions (with immediate feedback), earns 15 points per correct answer.
6. Goes to "Games" tab, plays "Unscramble the Lyrics," earns up to 25 points.
7. Goes to "Social Tasks" tab, clicks "Follow @BurnaBoy on X," verifies, earns 25 points.
8. Checks "Leaderboard" tab, sees "You're #12!"
9. Goes to "Wallet," spends 500 points on "Exclusive Digital Art," receives unique download link.

**Creator Journey:**
1. Creator logs into dashboard (separate route: /dashboard).
2. Clicks "Create New Campaign."
3. Types in AI Assistant: "I'm launching my new single 'Shayo' next Friday. I want streams and lyrics games."
4. AI auto-fills: Campaign name, dates, suggested modules (Stream + Unscramble), point values, prize structure.
5. AI pulls album art from Spotify and generates 10 quiz questions.
6. Creator previews, tweaks, and clicks "Publish."
7. Campaign goes live. Creator shares unique link on social media.
8. Creator monitors Live Dashboard: Sees 1,000 participants, 5,000 actions, top performers (live charts).
9. After campaign ends, AI generates Executive Summary: "Shayo Launch Party had 4,237 participants. Top performers in Lagos. Recommend targeting Lagos for next drop."
10. Creator downloads PDF report and shares with label.

---

### DESIGN & BRANDING REQUIREMENTS

- **Color Palette:** High-energy, contrasting colors: Bright yellows (#FFC107), deep purples (#6A1B9A), hot pinks (#FF4081), electric blues (#00BCD4). No muted corporate greys. Background: #FAFAFA, cards: white with shadow.
- **Typography:** Use Google Fonts: "Poppins" for headings (bold, 700 weight), "Inter" for body text. Headlines: 2rem+, body: 1rem.
- **Tone of Voice:** Playful, conversational, slightly cheeky. Examples: "Omo! You just earned 50 points. Don't spend it all in one place." "Nailed it! ✅ +15 Points." "Ope! ❌"
- **Layout:** Card-based, full-bleed imagery. No sidebars. Bottom navigation bar (mobile) or top navigation (desktop): **Home, Games, Leaderboard, Wallet**.
- **Campaign Cards:** Large, tappable cards with hero image, campaign title, creator name, time remaining, participant count, "Join Now" button. On hover: scale up slightly (transform: scale(1.02)).
- **Fun Fact Cards:** Bright, Zikoko-styled card slides up after spin (overlay). Looks like a chat bubble or flashcard. Header: "🎤 DID YOU KNOW?" Body: Entertainment trivia. Footer: "Share this fact 🗣️" or "Save to your trivia deck 📚".
- **Animations:** Use Framer Motion for smooth transitions, confetti effects on points earned, wheel spin animation (CSS + JS).

---

### SUCCESS METRICS (BUILD ANALYTICS TO TRACK THESE)

- User Retention: 40% daily active users (DAU/MAU) – track via login events.
- Campaign Completion Rate: >60% of users who join complete at least 1 action – track via funnel analysis.
- Social Action Verification Success Rate: >95% – track via verification logs.
- Creator Campaign Launch Time: <5 minutes from start to publish (with AI) – track via session timing.
- Points Purchase Conversion: 5% of active users purchase points packs – track via Stripe webhooks.
- Average Campaign Engagement: 10+ actions per participating user – track via action logs.
- AI Report Utility: 80% of creators report AI insights as "valuable" – track via post-campaign survey.

---

### EXECUTION INSTRUCTIONS FOR LOVABLE

1. **Start building the frontend first:** Create the React app with all user-facing pages and components (Home, Campaign, Games, Wallet, Profile). Ensure the Zikoko-inspired design is applied from the start. Use React Router for navigation.
2. **Build the backend APIs simultaneously:** Create all necessary Express routes, database models (Prisma), and integration services (social APIs, AI APIs, payment).
3. **Implement real-time features:** Use WebSockets (Socket.io) for leaderboard and live stats. Set up Redis for session management.
4. **Integrate all third-party APIs:** OpenAI, Spotify, X, Instagram, Stripe, etc. Use environment variables for all API keys (.env file).
5. **Test each feature as you build:** Ensure each module works independently before moving to the next. Write tests as you go.
6. **Do not stop or ask for clarification.** If you encounter a problem, implement a standard solution (e.g., use a well-known library, use a fallback approach). Continue building.
7. **Deploy the application** once all features are implemented and tested. Use a platform like Vercel (frontend) + Railway (backend) or a single platform like Render.
8. **Provide a fully working .zip file or deployment URL** at the end with all source code and a README with setup instructions.

**DO NOT ASK FOR PERMISSION. DO NOT ASK FOR CLARIFICATION. BUILD EVERYTHING NOW. COMPLETE THE ENTIRE APPLICATION END-TO-END.**



This prompt is exhaustive and designed to leave no room for ambiguity. It instructs Lovable to build the entire STAGE platform as a web application—frontend, backend, integrations, and AI features—in one continuous session. It should proceed without interruption until every component is fully functional.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9b4ab311-eaf2-420c-9385-94a11b59e311).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
