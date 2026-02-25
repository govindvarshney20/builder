/* ------------------------------------------------------------------ */
/*  Interview Questions Data                                          */
/* ------------------------------------------------------------------ */

export interface InterviewQuestion {
  id: string;
  company: string;
  type: "Product Sense" | "Execution" | "Behavioral" | "AI/ML" | "Guesstimate" | "Strategy";
  difficulty: "Medium" | "Hard";
  question: string;
  options: string[];
  correctIndex: number;
  modelAnswer: string;
  tip: string;
}

export const companies = [
  "Google",
  "Meta",
  "Amazon",
  "Apple",
  "Microsoft",
  "Flipkart",
  "Swiggy",
  "Razorpay",
  "CRED",
  "Spotify",
  "Netflix",
  "Stripe",
] as const;

export const interviewQuestions: InterviewQuestion[] = [
  // ── Google ──
  {
    id: "goog-ps-1",
    company: "Google",
    type: "Product Sense",
    difficulty: "Medium",
    question: "You are the PM for Google Maps. How would you improve the experience for users navigating in unfamiliar cities?",
    options: [
      "Add a social layer where locals can pin real-time tips and recommendations along routes",
      "Redesign the entire UI with a 3D immersive view for every city",
      "Remove all ads to reduce cognitive load",
      "Partner with every local transit authority worldwide before making any changes",
    ],
    correctIndex: 0,
    modelAnswer:
      "A social layer leverages Google's existing user base to crowd-source hyper-local knowledge. It directly addresses the pain point (unfamiliarity) by surfacing contextual, real-time tips without requiring a full product overhaul. You'd validate with a small city pilot, measure engagement, and iterate.",
    tip: "In product sense questions, always tie your solution to a specific user pain point and explain how you'd validate it incrementally.",
  },
  {
    id: "goog-ex-1",
    company: "Google",
    type: "Execution",
    difficulty: "Hard",
    question: "Google Search quality has dropped 5% week-over-week as measured by user satisfaction surveys. What do you do first?",
    options: [
      "Segment the drop by geography, device, query type, and user cohort to isolate the root cause",
      "Immediately roll back the last algorithm update",
      "Launch a new A/B test with a completely redesigned results page",
      "Increase the ad load to compensate for revenue impact",
    ],
    correctIndex: 0,
    modelAnswer:
      "Before taking action, you must diagnose. Segmenting the drop helps you understand whether it's global or localized, which narrows the root cause. A rollback might fix it, but without diagnosis you won't know what broke or if the rollback introduces other regressions.",
    tip: "For metric-drop questions, always start with 'clarify the metric → segment the data → hypothesize → validate.' Never jump to solutions.",
  },
  {
    id: "goog-bh-1",
    company: "Google",
    type: "Behavioral",
    difficulty: "Medium",
    question: "Tell me about a time you had to make a product decision with incomplete data.",
    options: [
      "Describe a situation where you defined the key unknowns, gathered proxy data, set a reversible decision framework, and committed to a review checkpoint",
      "Say you always wait until you have complete data before deciding",
      "Explain that you delegate uncertain decisions to your manager",
      "Share that you rely on gut instinct and move fast",
    ],
    correctIndex: 0,
    modelAnswer:
      "The best behavioral answers use the STAR framework. Show self-awareness about incomplete info, explain how you triangulated from proxy signals, made a reversible bet, and built in a checkpoint to course-correct. This demonstrates PM maturity.",
    tip: "Use STAR (Situation, Task, Action, Result) for every behavioral question. Quantify impact wherever possible.",
  },
  {
    id: "goog-ai-1",
    company: "Google",
    type: "AI/ML",
    difficulty: "Hard",
    question: "You're building an AI feature that auto-summarizes emails in Gmail. What is the most critical product risk to address first?",
    options: [
      "Hallucination — the model generating summaries that misrepresent the email content, leading to user distrust",
      "Latency — the summary takes 2 seconds to generate",
      "Cost — running inference on every email is expensive",
      "Competition — Microsoft already has a similar feature in Outlook",
    ],
    correctIndex: 0,
    modelAnswer:
      "For an AI summarization feature, accuracy is existential. If a summary misrepresents a critical email (e.g., flipping a 'no' to a 'yes'), users lose trust permanently. Latency and cost are optimizable; hallucination undermines the core value proposition.",
    tip: "For AI/ML product questions, always prioritize trust and accuracy risks over performance or cost. Users forgive slow; they don't forgive wrong.",
  },
  {
    id: "goog-gs-1",
    company: "Google",
    type: "Guesstimate",
    difficulty: "Medium",
    question: "Estimate the number of Google Searches made per day worldwide.",
    options: [
      "~8.5 billion (based on ~4B internet users × ~2-3 searches/day average, with power users skewing higher)",
      "~500 million",
      "~50 billion",
      "~100 million",
    ],
    correctIndex: 0,
    modelAnswer:
      "Start with global internet users (~4-5B), estimate what fraction use Google (~90% in most markets), estimate average searches per user per day (~2-3 for casual, 10+ for power users), and arrive at ~8-9 billion. The actual number is roughly 8.5 billion.",
    tip: "In guesstimates, always show your framework: start with a large known number, break it down into segments, and multiply. The process matters more than the exact answer.",
  },
  // ── Meta ──
  {
    id: "meta-ps-1",
    company: "Meta",
    type: "Product Sense",
    difficulty: "Medium",
    question: "How would you increase meaningful social interactions on Facebook without increasing time spent?",
    options: [
      "Prioritize content from close friends and family in the feed algorithm, and add prompts that encourage replies over passive likes",
      "Add more video content to increase engagement",
      "Remove the News Feed entirely and replace with direct messaging",
      "Add gamification badges for posting frequently",
    ],
    correctIndex: 0,
    modelAnswer:
      "Meta's stated mission shifted toward 'meaningful social interactions.' Prioritizing close-tie content and encouraging active engagement (comments, replies) over passive consumption directly serves this goal. It's measurable via interaction depth metrics without optimizing for raw time-on-platform.",
    tip: "When asked about social products, distinguish between 'engagement' (time spent) and 'meaningful engagement' (depth of interaction). Show you understand the nuance.",
  },
  {
    id: "meta-ex-1",
    company: "Meta",
    type: "Execution",
    difficulty: "Hard",
    question: "Instagram Reels watch time is up 20% but creator posting frequency is down 10%. How do you interpret this and what do you do?",
    options: [
      "The consumption side is healthy but supply is at risk — investigate why creators are posting less (burnout, monetization gaps, algorithm changes) and address creator-side incentives",
      "Celebrate the 20% watch time increase and ignore the creator metric",
      "Immediately increase creator payouts across the board",
      "Shift focus entirely to long-form video since Reels creators are leaving",
    ],
    correctIndex: 0,
    modelAnswer:
      "A healthy marketplace needs both supply and demand. Rising consumption with falling supply is unsustainable — eventually you run out of fresh content. Diagnosing creator churn (surveys, cohort analysis, competitive intel) lets you design targeted interventions rather than throwing money at the problem.",
    tip: "For two-sided marketplace questions, always analyze both supply and demand. A metric moving in one direction on one side often signals a future problem on the other.",
  },
  {
    id: "meta-str-1",
    company: "Meta",
    type: "Strategy",
    difficulty: "Hard",
    question: "Should Meta invest heavily in AR glasses as a platform play, given the current state of the technology?",
    options: [
      "Yes, but with a phased approach: start with a developer ecosystem and niche use cases (navigation, translation) before targeting mass-market consumer adoption",
      "No, AR is too early — wait until competitors prove the market",
      "Yes, go all-in on consumer launch immediately to capture first-mover advantage",
      "Abandon hardware and focus only on software/metaverse",
    ],
    correctIndex: 0,
    modelAnswer:
      "Platform shifts require early, sustained investment (see: Android, AWS). A phased approach manages risk while building ecosystem lock-in. Starting with niche use cases validates product-market fit before the massive investment needed for mass consumer hardware.",
    tip: "Strategy questions test your ability to balance ambition with risk management. Show you can think in phases and explain the logic behind sequencing.",
  },
  // ── Amazon ──
  {
    id: "amzn-ps-1",
    company: "Amazon",
    type: "Product Sense",
    difficulty: "Medium",
    question: "Design a feature to reduce return rates on Amazon Fashion by 15%.",
    options: [
      "Build an AI-powered virtual try-on using phone cameras + size recommendation engine trained on return data",
      "Remove the free returns policy",
      "Only sell clothing from brands with low return rates",
      "Add more product photos taken by the warehouse team",
    ],
    correctIndex: 0,
    modelAnswer:
      "High fashion returns are driven by fit uncertainty. A virtual try-on combined with a data-driven size recommendation engine addresses the root cause. Amazon has the data (past purchases, returns by size) and the AI capability to build this. You'd A/B test on a single category first.",
    tip: "Amazon interviews love 'working backwards from the customer.' Always frame your solution as solving a customer pain point, not an internal metric.",
  },
  {
    id: "amzn-ex-1",
    company: "Amazon",
    type: "Execution",
    difficulty: "Hard",
    question: "You launched a new 'Buy Again' feature on Amazon and adoption is 40% below projections after 4 weeks. What's your approach?",
    options: [
      "Analyze the conversion funnel: discovery → click → purchase. Identify the biggest drop-off point and run targeted experiments to fix it",
      "Kill the feature since it's underperforming",
      "Double the marketing spend to drive awareness",
      "Redesign the feature from scratch with a new team",
    ],
    correctIndex: 0,
    modelAnswer:
      "Funnel analysis is the PM's diagnostic tool. A feature can underperform at discovery (users don't see it), consideration (they see it but don't click), or conversion (they click but don't buy). Each requires a different fix. Data-driven diagnosis before action is key.",
    tip: "For underperforming feature questions, use a funnel framework. Never propose solutions before diagnosing where in the funnel the problem lies.",
  },
  {
    id: "amzn-bh-1",
    company: "Amazon",
    type: "Behavioral",
    difficulty: "Medium",
    question: "Describe a time you had to earn trust with a skeptical stakeholder.",
    options: [
      "Share a specific example where you listened to their concerns, addressed them with data, delivered a quick win, and gradually built credibility through consistent execution",
      "Explain that you escalated to their manager to force alignment",
      "Say you simply presented a compelling slide deck and they were convinced",
      "Admit you avoided the stakeholder and worked around them",
    ],
    correctIndex: 0,
    modelAnswer:
      "Amazon's 'Earn Trust' leadership principle values leaders who listen, are self-critical, and benchmark against the best. Show that you took time to understand the skeptic's perspective, used data (not authority), and built trust incrementally through delivery.",
    tip: "For Amazon behavioral questions, explicitly map your answer to one of their 16 Leadership Principles. Mention the principle by name.",
  },
  // ── Apple ──
  {
    id: "aapl-ps-1",
    company: "Apple",
    type: "Product Sense",
    difficulty: "Hard",
    question: "How would you design a health monitoring feature for AirPods?",
    options: [
      "Continuous heart rate monitoring via in-ear optical sensors, with smart alerts for irregular rhythms — integrated into Apple Health with physician-shareable reports",
      "Add a screen to AirPods to display health data",
      "Make AirPods track steps like a Fitbit",
      "Bundle AirPods with an Apple Watch for health features",
    ],
    correctIndex: 0,
    modelAnswer:
      "In-ear is an ideal location for optical heart rate sensing. Apple already has Health infrastructure (HealthKit, Apple Health). The differentiator is passive, continuous monitoring without wearing a watch. Physician-shareable reports tie into Apple's health ecosystem strategy.",
    tip: "For Apple product questions, think about the ecosystem (how does this connect to iPhone, Watch, Health?) and the design philosophy (simple, delightful, private).",
  },
  {
    id: "aapl-str-1",
    company: "Apple",
    type: "Strategy",
    difficulty: "Hard",
    question: "Should Apple launch a search engine to compete with Google?",
    options: [
      "Not directly — instead, build privacy-focused search features within Spotlight and Safari that reduce dependency on Google, preserving the $20B+ annual Google deal while hedging",
      "Yes, launch a full Google competitor immediately",
      "No, search is not relevant to Apple's business",
      "Acquire DuckDuckGo and rebrand it as Apple Search",
    ],
    correctIndex: 0,
    modelAnswer:
      "Apple earns $20B+ annually from Google for default search. A direct competitor would sacrifice this revenue before a replacement is viable. Instead, incrementally building search capabilities (Spotlight, Siri, App Store search) hedges the risk while preserving revenue. This is classic disruption theory — don't attack your revenue source head-on.",
    tip: "Strategy questions at Apple often involve the tension between ecosystem control and revenue partnerships. Show you can navigate that tradeoff.",
  },
  // ── Microsoft ──
  {
    id: "msft-ai-1",
    company: "Microsoft",
    type: "AI/ML",
    difficulty: "Medium",
    question: "How would you measure the success of Copilot in Microsoft Word?",
    options: [
      "Track task completion rate, time-to-first-draft reduction, user retention of Copilot features, and a qualitative 'helpfulness' score from in-product surveys",
      "Only measure the number of Copilot activations per day",
      "Track revenue generated from Copilot subscriptions only",
      "Measure the word count of AI-generated text",
    ],
    correctIndex: 0,
    modelAnswer:
      "Success for an AI writing assistant is multi-dimensional: efficiency (time saved), quality (user satisfaction with output), adoption (retention and frequency), and business impact (subscription conversion). A single metric misses the picture. The helpfulness survey captures the subjective 'did this actually help?' signal.",
    tip: "For AI product metrics questions, always include both quantitative (usage, time saved) and qualitative (satisfaction, trust) measures. AI products need trust metrics.",
  },
  {
    id: "msft-ps-1",
    company: "Microsoft",
    type: "Product Sense",
    difficulty: "Medium",
    question: "How would you improve Microsoft Teams for hybrid work environments?",
    options: [
      "Build 'presence parity' features: smart room layouts that give remote participants equal screen real estate, AI-powered meeting summaries for async catch-up, and status indicators that show focus time vs. available time",
      "Add more emoji reactions to messages",
      "Remove the chat feature and focus only on video calls",
      "Make Teams exclusive to in-office employees",
    ],
    correctIndex: 0,
    modelAnswer:
      "The core pain point of hybrid work is the 'presence gap' between in-office and remote workers. Presence parity features directly address this by equalizing the experience. AI summaries solve the async problem. Focus-time indicators reduce interruption culture.",
    tip: "For collaboration tool questions, always frame around the specific pain points of the target user segment (in this case, hybrid workers) rather than generic 'add more features.'",
  },
  // ── Flipkart ──
  {
    id: "fk-ps-1",
    company: "Flipkart",
    type: "Product Sense",
    difficulty: "Medium",
    question: "How would you increase conversion rates for first-time buyers on Flipkart from Tier 2/3 cities?",
    options: [
      "Introduce vernacular language support, cash-on-delivery trust badges, a simplified checkout with fewer steps, and video product demos from local creators",
      "Offer free next-day delivery to all Tier 2/3 cities",
      "Only show premium brands to build aspirational value",
      "Remove the app and focus on a desktop website",
    ],
    correctIndex: 0,
    modelAnswer:
      "Tier 2/3 buyers face trust barriers (is this legit?), language barriers (English-first UI), and complexity barriers (too many checkout steps). Vernacular support, trust signals (COD badges), simplified flows, and relatable video content address all three. This is user-centric localization.",
    tip: "For India-specific e-commerce questions, always consider the trust gap, language diversity, and digital literacy levels of Tier 2/3 users.",
  },
  {
    id: "fk-ex-1",
    company: "Flipkart",
    type: "Execution",
    difficulty: "Hard",
    question: "Flipkart's Big Billion Days sale saw a 30% cart abandonment spike compared to last year. Diagnose the issue.",
    options: [
      "Segment abandonment by stage (pricing page, payment, address), device type, payment method, and compare to last year's funnel to isolate the regression",
      "Offer bigger discounts to compensate",
      "Blame the engineering team for server issues",
      "Cancel the sale and try again next quarter",
    ],
    correctIndex: 0,
    modelAnswer:
      "Cart abandonment during a sale event has specific causes: payment gateway failures under load, price confusion (strikethrough vs. actual), coupon application errors, or delivery date disappointments. Segmenting by funnel stage and comparing year-over-year pinpoints the exact regression.",
    tip: "For e-commerce metric questions, the checkout funnel is your best friend. Always break down the user journey into stages and analyze drop-offs at each.",
  },
  // ── Swiggy ──
  {
    id: "swig-ps-1",
    company: "Swiggy",
    type: "Product Sense",
    difficulty: "Medium",
    question: "How would you reduce food delivery time on Swiggy without compromising food quality?",
    options: [
      "Implement predictive order preparation (notify restaurants before the user confirms order based on cart behavior) and optimize rider assignment with ML-based demand forecasting",
      "Tell riders to drive faster",
      "Only partner with fast-food restaurants",
      "Pre-cook all popular dishes in Swiggy's own kitchens",
    ],
    correctIndex: 0,
    modelAnswer:
      "The biggest time component in food delivery is preparation time, not transit. Predictive preparation (starting to prep when the user is highly likely to order) shaves minutes without rushing the kitchen. ML-based rider pre-assignment further cuts idle time. Both preserve food quality.",
    tip: "For delivery/logistics questions, break down the total time into components (prep, assignment, transit, handoff) and identify the biggest bottleneck before proposing solutions.",
  },
  {
    id: "swig-gs-1",
    company: "Swiggy",
    type: "Guesstimate",
    difficulty: "Medium",
    question: "Estimate the number of food orders Swiggy delivers per day in Bangalore.",
    options: [
      "~800K-1M (based on ~3M Swiggy users in Bangalore, ~25-30% monthly active, ~10-15% daily ordering, average 1.1 orders per ordering user)",
      "~50,000",
      "~10 million",
      "~5,000",
    ],
    correctIndex: 0,
    modelAnswer:
      "Framework: Bangalore population (~13M) → smartphone users (~8M) → food delivery app users (~4M) → Swiggy share (~60% = ~2.5-3M) → daily active orderers (~10-12%) → ~300K-360K users × ~1.1 orders = ~350-400K. With Instamart and other verticals, total Swiggy orders could be ~800K-1M.",
    tip: "For market-specific guesstimates, start with the addressable population and narrow down with realistic conversion rates at each step.",
  },
  // ── Razorpay ──
  {
    id: "rzp-ps-1",
    company: "Razorpay",
    type: "Product Sense",
    difficulty: "Medium",
    question: "How would you design a product to help small merchants accept UPI payments with zero technical integration?",
    options: [
      "A simple QR code-based solution with auto-generated payment pages, instant settlement notifications via WhatsApp, and a lightweight dashboard accessible via mobile browser",
      "Build a full-featured POS terminal that merchants must purchase",
      "Require merchants to integrate via API documentation",
      "Only support credit card payments for higher margins",
    ],
    correctIndex: 0,
    modelAnswer:
      "Small merchants need zero-friction setup. QR codes require no technical skill, WhatsApp is already on every merchant's phone (no new app needed), and a mobile-first dashboard respects their context. This mirrors the successful UPI adoption playbook in India.",
    tip: "For fintech products targeting small merchants, always optimize for zero-friction onboarding and use channels they already use (WhatsApp, SMS).",
  },
  {
    id: "rzp-str-1",
    company: "Razorpay",
    type: "Strategy",
    difficulty: "Hard",
    question: "Should Razorpay expand into lending (Buy Now Pay Later) for its merchant base?",
    options: [
      "Yes — Razorpay has unique transaction data that enables superior credit underwriting, and merchants already trust the platform. Start with working capital loans using transaction history as the credit signal",
      "No, lending is too risky for a payments company",
      "Yes, but only partner with banks and earn referral fees",
      "Focus only on enterprise payments and ignore SMB lending",
    ],
    correctIndex: 0,
    modelAnswer:
      "Razorpay processes merchant transactions, giving it real-time revenue data — a better credit signal than traditional bank statements. This data advantage enables better underwriting. Starting with working capital loans (backed by transaction data) is a natural extension that deepens merchant lock-in.",
    tip: "For fintech strategy questions, always consider the data advantage. Companies with transaction data can underwrite credit better than traditional lenders.",
  },
  // ── CRED ──
  {
    id: "cred-ps-1",
    company: "CRED",
    type: "Product Sense",
    difficulty: "Medium",
    question: "How would you increase daily active usage of CRED beyond credit card bill payments?",
    options: [
      "Build a personal finance command center: spending insights, credit score tracking, bill reminders, and curated rewards — making CRED the daily financial health check-in",
      "Add a social media feed for users to share purchases",
      "Launch a cryptocurrency trading feature",
      "Send more push notifications about rewards",
    ],
    correctIndex: 0,
    modelAnswer:
      "CRED's core value is financial wellness for premium users. A daily finance check-in (spending patterns, credit score movement, upcoming bills) creates habitual engagement beyond the monthly bill pay. It leverages CRED's existing data and strengthens the value proposition for its premium user base.",
    tip: "For engagement questions, focus on creating habits around the core value proposition rather than adding tangentially related features.",
  },
  {
    id: "cred-bh-1",
    company: "CRED",
    type: "Behavioral",
    difficulty: "Medium",
    question: "Tell me about a time you launched a product that initially failed. What did you learn?",
    options: [
      "Share a real example using STAR: describe the launch, specific metrics that showed failure, how you gathered user feedback, pivoted the approach, and what systemic lesson you applied to future launches",
      "Say you've never had a failed launch",
      "Blame the engineering team for poor execution",
      "Explain that you left the company before having to address the failure",
    ],
    correctIndex: 0,
    modelAnswer:
      "Interviewers asking about failure want to see self-awareness, analytical rigor, and growth mindset. The best answers show you recognized failure early (not in denial), diagnosed it with data and user feedback, took ownership, and extracted a generalizable lesson you've since applied.",
    tip: "Failure questions are really about learning velocity. Show that you fail fast, learn faster, and apply the lesson going forward.",
  },
  // ── Spotify ──
  {
    id: "spot-ps-1",
    company: "Spotify",
    type: "Product Sense",
    difficulty: "Medium",
    question: "How would you design a feature to help users discover podcasts they'll love on Spotify?",
    options: [
      "Build a 'Podcast DJ' that uses listening history, music taste signals, and time-of-day context to serve personalized podcast recommendations with 30-second audio previews",
      "Show a static list of top 50 podcasts",
      "Let users only discover podcasts through manual search",
      "Remove music recommendations to prioritize podcasts",
    ],
    correctIndex: 0,
    modelAnswer:
      "Spotify's music recommendation engine is world-class — extending it to podcasts using cross-domain signals (music taste correlates with podcast preferences) is a unique advantage. Audio previews reduce the commitment barrier. Time-of-day context (commute = news, evening = storytelling) adds personalization depth.",
    tip: "For Spotify questions, always leverage the recommendation engine and audio-first nature of the platform. Cross-domain signals (music → podcast) are a key differentiator.",
  },
  {
    id: "spot-ai-1",
    company: "Spotify",
    type: "AI/ML",
    difficulty: "Hard",
    question: "How would you use AI to improve the Spotify Wrapped experience?",
    options: [
      "Generate personalized AI narratives about the user's listening journey, create custom AI-generated playlist artwork, and predict next year's music taste — making Wrapped a forward-looking experience, not just retrospective",
      "Just add more statistics and charts",
      "Use AI to auto-post Wrapped to social media without user consent",
      "Replace Wrapped with a generic year-in-review email",
    ],
    correctIndex: 0,
    modelAnswer:
      "Wrapped's magic is personalization and shareability. AI can deepen both: narrative storytelling ('Your spring was soundtracked by indie folk during your road trip phase'), custom artwork (unique to each user), and predictive elements create novelty. The forward-looking twist makes it actionable, not just nostalgic.",
    tip: "For AI feature questions, focus on how AI enhances the existing value proposition rather than replacing the human experience. AI should augment, not alienate.",
  },
  // ── Netflix ──
  {
    id: "nflx-ps-1",
    company: "Netflix",
    type: "Product Sense",
    difficulty: "Medium",
    question: "How would you reduce churn among Netflix subscribers who haven't watched anything in 30 days?",
    options: [
      "Implement a progressive re-engagement sequence: personalized 'what you missed' emails → in-app 'quick picks' based on past taste → a 'Surprise Me' one-tap play feature that eliminates decision fatigue",
      "Cancel their subscription automatically to save them money",
      "Send them a generic 'we miss you' email",
      "Increase the subscription price to offset churn revenue",
    ],
    correctIndex: 0,
    modelAnswer:
      "Inactive users often face decision fatigue (too much content, can't choose). A progressive approach (email → in-app → one-tap play) meets them at different touchpoints with decreasing friction. 'Surprise Me' directly addresses the paradox of choice that causes inaction.",
    tip: "For churn/retention questions, diagnose why users become inactive before proposing solutions. Decision fatigue, content mismatch, and billing concerns are the top three.",
  },
  {
    id: "nflx-str-1",
    company: "Netflix",
    type: "Strategy",
    difficulty: "Hard",
    question: "Should Netflix invest in live sports streaming?",
    options: [
      "Selectively — acquire rights for niche/emerging sports (F1, tennis, combat sports) and sports documentaries that fit Netflix's brand, rather than competing head-on with ESPN/Amazon for NFL/NBA rights",
      "No, sports don't fit Netflix's brand at all",
      "Yes, bid aggressively for NFL and NBA rights immediately",
      "Only invest in esports content",
    ],
    correctIndex: 0,
    modelAnswer:
      "Live sports drive real-time engagement and reduce churn (subscribers won't cancel mid-season). But top-tier rights (NFL, NBA) are prohibitively expensive. Niche sports (F1 drove massive engagement via Drive to Survive) let Netflix build sports credibility at lower cost while staying true to the storytelling brand.",
    tip: "Strategy questions want you to find the 'smart entry point' — not whether to enter, but how to enter with an asymmetric advantage.",
  },
  // ── Stripe ──
  {
    id: "strp-ps-1",
    company: "Stripe",
    type: "Product Sense",
    difficulty: "Medium",
    question: "How would you design a fraud detection dashboard for Stripe merchants?",
    options: [
      "Real-time fraud risk scoring with explainable AI (showing why a transaction was flagged), customizable risk thresholds per merchant, and a one-click dispute management workflow",
      "A simple list of all transactions sorted by date",
      "Automated blocking of all international transactions",
      "A monthly PDF report emailed to merchants",
    ],
    correctIndex: 0,
    modelAnswer:
      "Merchants need transparency (why was this flagged?), control (different businesses have different risk tolerances), and efficiency (quick dispute resolution). Explainable AI builds trust in the fraud system. Customizable thresholds prevent false positives that hurt revenue. One-click workflows save time.",
    tip: "For B2B product questions, always think about the merchant's workflow. They need transparency, control, and efficiency — not just a 'smart' system.",
  },
  {
    id: "strp-ex-1",
    company: "Stripe",
    type: "Execution",
    difficulty: "Hard",
    question: "Stripe's payment success rate dropped from 97% to 94% for a specific card network in India. How do you investigate?",
    options: [
      "Map the payment flow end-to-end (tokenization → authentication → authorization → settlement), instrument each step to find the failure point, cross-reference with the card network's status page and recent regulatory changes",
      "Immediately switch all traffic to a different card network",
      "Wait a week to see if it resolves itself",
      "Ask merchants to tell their customers to use a different payment method",
    ],
    correctIndex: 0,
    modelAnswer:
      "A 3% drop in payment success rate is critical (millions in failed transactions). Systematic diagnosis requires mapping the full payment flow and instrumenting each step. In India specifically, RBI regulatory changes (e.g., tokenization mandates, recurring payment rules) are a common root cause that must be checked.",
    tip: "For payments/infrastructure questions, always think in terms of the full transaction flow and check for both technical failures and regulatory/compliance changes.",
  },
  // ── More Google ──
  {
    id: "goog-ps-2",
    company: "Google",
    type: "Product Sense",
    difficulty: "Hard",
    question: "How would you design a product to help students learn more effectively using YouTube?",
    options: [
      "Build 'YouTube Learning Paths' — curated, sequential playlists with progress tracking, embedded quizzes, AI-generated summaries, and certificate completion — integrated with Google Classroom",
      "Just recommend more educational videos in the algorithm",
      "Create a separate app called 'YouTube School'",
      "Remove all non-educational content from YouTube",
    ],
    correctIndex: 0,
    modelAnswer:
      "YouTube already has the world's largest educational content library. The gap is structured learning (progression, assessment, credentialing). Learning Paths add structure without requiring new content creation. Google Classroom integration leverages the existing education ecosystem.",
    tip: "When designing for education, think about the learning loop: discover → consume → practice → assess → certify. Most content platforms only do the first two.",
  },
  {
    id: "goog-ai-2",
    company: "Google",
    type: "AI/ML",
    difficulty: "Hard",
    question: "How would you evaluate whether Google's AI Overviews in Search are helping or hurting the user experience?",
    options: [
      "Measure task completion rate, time-to-answer, click-through to sources (healthy ecosystem check), user satisfaction surveys, and query reformulation rate (lower is better — means the first answer worked)",
      "Only track whether users click on the AI Overview",
      "Measure cost per query and optimize for efficiency",
      "Count the number of AI Overviews shown per day",
    ],
    correctIndex: 0,
    modelAnswer:
      "AI Overviews fundamentally change the search experience. Success isn't just 'did they read it?' but 'did it solve their problem?' (task completion), 'faster than before?' (time-to-answer), 'is the ecosystem healthy?' (source clicks), and 'do they trust it?' (satisfaction). Query reformulation is a clever inverse metric — fewer reformulations = better first-try accuracy.",
    tip: "For AI feature evaluation, always include ecosystem health metrics. If AI Overviews kill click-through to websites, publishers stop creating content, and the AI has nothing to learn from.",
  },
  // ── More Meta ──
  {
    id: "meta-ps-2",
    company: "Meta",
    type: "Product Sense",
    difficulty: "Medium",
    question: "How would you design a feature to make WhatsApp more useful for small businesses in India?",
    options: [
      "A lightweight catalog + order management system within WhatsApp Business, with UPI payment integration and automated order confirmation messages",
      "Add Stories for businesses only",
      "Create a separate WhatsApp Business social network",
      "Charge small businesses a monthly subscription fee for basic features",
    ],
    correctIndex: 0,
    modelAnswer:
      "Small businesses in India already use WhatsApp as their primary customer communication channel. Adding catalog, ordering, and payment (via UPI) turns WhatsApp into a full commerce platform without requiring merchants to learn a new tool. This is the 'WeChat for India' playbook.",
    tip: "For emerging market product questions, build on existing user behavior rather than asking users to adopt new tools. Meet them where they are.",
  },
  // ── More Amazon ──
  {
    id: "amzn-gs-1",
    company: "Amazon",
    type: "Guesstimate",
    difficulty: "Medium",
    question: "Estimate the number of packages Amazon delivers per day in the United States.",
    options: [
      "~20 million (based on ~$600B US e-commerce market, ~40% Amazon share, ~$40 average order value, divided by 365 days)",
      "~500,000",
      "~200 million",
      "~1 million",
    ],
    correctIndex: 0,
    modelAnswer:
      "Framework: US e-commerce ~$600B/year → Amazon ~40% share = ~$240B → average order value ~$40 → ~6B orders/year → ~16-20M packages/day (some orders have multiple packages). Cross-check: ~150M Prime members in US, if 13% order on any given day ≈ ~20M. The actual number is reportedly ~20M+.",
    tip: "For guesstimates, always try two independent approaches and see if they converge. This builds confidence in your estimate and impresses interviewers.",
  },
  // ── More Flipkart ──
  {
    id: "fk-ai-1",
    company: "Flipkart",
    type: "AI/ML",
    difficulty: "Hard",
    question: "How would you use AI to improve product search relevance on Flipkart?",
    options: [
      "Implement semantic search (understanding intent beyond keywords), personalized ranking based on user purchase history and browsing patterns, and visual search for fashion/home categories",
      "Only improve the keyword matching algorithm",
      "Show sponsored products first regardless of relevance",
      "Remove the search bar and only use category browsing",
    ],
    correctIndex: 0,
    modelAnswer:
      "E-commerce search is a revenue multiplier — better search = higher conversion. Semantic search understands 'comfortable office shoes for women' beyond keyword matching. Personalized ranking uses the insight that different users searching the same query want different products. Visual search addresses the 'I don't know what it's called but I know what it looks like' use case.",
    tip: "For search/recommendation AI questions, always think about the gap between user intent and expressed query. AI's job is to bridge that gap.",
  },
  // ── More Spotify ──
  {
    id: "spot-ex-1",
    company: "Spotify",
    type: "Execution",
    difficulty: "Medium",
    question: "Spotify's free-to-premium conversion rate dropped from 4.2% to 3.5% this quarter. How do you diagnose and address this?",
    options: [
      "Segment by user cohort (new vs. returning), geography, and conversion trigger (which feature/moment prompted upgrades). Compare against the previous quarter's conversion paths to identify what changed",
      "Immediately offer a 50% discount on Premium to all free users",
      "Remove more features from the free tier to force upgrades",
      "Ignore it since free users still generate ad revenue",
    ],
    correctIndex: 0,
    modelAnswer:
      "Conversion rate drops have specific, diagnosable causes. New user quality might have changed (different acquisition channels), the 'aha moments' that trigger conversion might have been disrupted (feature changes, A/B tests), or competitive alternatives might have emerged. Segmentation reveals which factor is dominant.",
    tip: "For conversion/monetization questions, always investigate whether the user base composition changed (denominator) before assuming the product changed (numerator).",
  },
  // ── More Netflix ──
  {
    id: "nflx-ai-1",
    company: "Netflix",
    type: "AI/ML",
    difficulty: "Medium",
    question: "How would you improve Netflix's recommendation system for households with multiple viewers sharing one profile?",
    options: [
      "Build implicit viewer identification using viewing pattern signals (time of day, device, content type) to serve personalized recommendations without requiring profile switches",
      "Force every viewer to create their own profile",
      "Show only the most popular content to avoid personalization conflicts",
      "Ask 'who's watching?' before every session with a mandatory prompt",
    ],
    correctIndex: 0,
    modelAnswer:
      "Profile switching has high friction and low compliance. Implicit identification (watching patterns, device fingerprinting, time-of-day signals) can infer the likely viewer and adjust recommendations accordingly. This preserves the seamless experience while improving recommendation quality for shared accounts.",
    tip: "For recommendation system questions, always consider the tension between personalization accuracy and user friction. The best solutions are invisible to the user.",
  },
  // ── More Stripe ──
  {
    id: "strp-ai-1",
    company: "Stripe",
    type: "AI/ML",
    difficulty: "Hard",
    question: "How would you build an AI system to predict and prevent payment disputes before they happen?",
    options: [
      "Train a model on historical dispute patterns (transaction amount, merchant category, buyer behavior, time patterns) to flag high-risk transactions pre-authorization, with merchant-configurable intervention actions",
      "Block all transactions above $500",
      "Only allow payments from verified bank accounts",
      "Wait for disputes to happen and then improve the resolution process",
    ],
    correctIndex: 0,
    modelAnswer:
      "Preventing disputes is 10x cheaper than resolving them. A predictive model trained on historical dispute data can identify risk signals before authorization. The key is merchant configurability — a luxury brand and a SaaS company have very different risk profiles. Pre-auth intervention (3D Secure, additional verification) reduces disputes without blanket blocking.",
    tip: "For fraud/risk AI questions, emphasize the economic argument (prevention vs. resolution cost) and the importance of configurable thresholds for different merchant segments.",
  },
  // ── More CRED ──
  {
    id: "cred-str-1",
    company: "CRED",
    type: "Strategy",
    difficulty: "Hard",
    question: "How should CRED monetize its premium user base without compromising the user experience?",
    options: [
      "Build a premium financial products marketplace (high-yield savings, premium credit cards, insurance) where CRED earns distribution fees — users get curated access, financial partners get qualified leads",
      "Show banner ads from any advertiser",
      "Charge users a monthly fee for the app",
      "Sell user financial data to third parties",
    ],
    correctIndex: 0,
    modelAnswer:
      "CRED's user base (high credit score, affluent) is extremely valuable to financial product companies. A curated marketplace aligns all incentives: users discover premium products matched to their profile, financial partners access qualified leads they can't get elsewhere, and CRED earns distribution fees. This is the 'premium audience monetization' playbook.",
    tip: "For monetization questions, always ensure the monetization model aligns incentives across all stakeholders (users, partners, platform). Misaligned incentives create long-term problems.",
  },
  // ── More Razorpay ──
  {
    id: "rzp-ex-1",
    company: "Razorpay",
    type: "Execution",
    difficulty: "Medium",
    question: "Razorpay's merchant onboarding completion rate dropped from 78% to 62%. What's your approach?",
    options: [
      "Map the onboarding funnel step by step (signup → KYC → bank verification → first transaction), identify the biggest drop-off step, segment by merchant size/type, and compare against the previous period's funnel",
      "Simplify KYC by removing all verification requirements",
      "Offer cash incentives for completing onboarding",
      "Blame the sales team for bringing in unqualified leads",
    ],
    correctIndex: 0,
    modelAnswer:
      "A 16-point drop in completion rate is significant. Funnel analysis reveals where merchants are dropping off. In fintech, common culprits are KYC friction (document upload issues), bank verification delays, or unclear requirements. Segmenting by merchant size helps — a large enterprise and a small shop face very different onboarding challenges.",
    tip: "For onboarding funnel questions, always diagnose the specific step where drop-off occurs before proposing solutions. The fix for a KYC problem is very different from a bank verification problem.",
  },
  // ── More Swiggy ──
  {
    id: "swig-str-1",
    company: "Swiggy",
    type: "Strategy",
    difficulty: "Hard",
    question: "Should Swiggy invest in building its own private-label food brands (like Amazon Basics for food)?",
    options: [
      "Yes, but start with high-margin, low-differentiation categories (water, snacks, staples) on Instamart where Swiggy controls the last-mile experience and has demand data to optimize inventory",
      "No, it would alienate restaurant partners",
      "Yes, launch 50 private-label brands simultaneously across all categories",
      "Only invest in cloud kitchens instead",
    ],
    correctIndex: 0,
    modelAnswer:
      "Private labels work best in categories where brand matters less than price and convenience (staples, commodities). Swiggy's Instamart gives it the delivery infrastructure and demand data to identify high-velocity, low-differentiation SKUs. Starting small and expanding based on data minimizes risk and restaurant partner backlash.",
    tip: "For platform strategy questions, consider the multi-stakeholder impact. Private labels can boost margins but risk alienating supply-side partners. Show you can balance both.",
  },
  // ── Additional questions for breadth ──
  {
    id: "meta-gs-1",
    company: "Meta",
    type: "Guesstimate",
    difficulty: "Medium",
    question: "Estimate the number of photos uploaded to Instagram per day.",
    options: [
      "~100 million (based on ~2B MAUs, ~500M DAUs, ~20% posting on any given day = ~100M posts, mix of photos and reels)",
      "~1 million",
      "~5 billion",
      "~10,000",
    ],
    correctIndex: 0,
    modelAnswer:
      "Framework: Instagram has ~2B MAUs, ~500M DAUs. Not all DAUs post (most consume). If ~20% of DAUs post/share something daily = ~100M. This includes feed posts, stories, and reels. The actual reported number is ~95-100M photos/videos per day.",
    tip: "For social media guesstimates, always distinguish between consumers (view) and creators (post). The creator-to-consumer ratio is typically 1:5 to 1:10.",
  },
  {
    id: "aapl-ex-1",
    company: "Apple",
    type: "Execution",
    difficulty: "Medium",
    question: "Apple Music's playlist completion rate (users finishing a playlist they started) dropped 15%. How do you investigate?",
    options: [
      "Segment by playlist type (editorial, algorithmic, user-created), skip rate patterns, listening context (device, time), and check if recent algorithm changes affected song ordering or playlist length",
      "Add more songs to every playlist",
      "Send push notifications reminding users to finish playlists",
      "Remove playlists shorter than 20 songs",
    ],
    correctIndex: 0,
    modelAnswer:
      "Playlist completion is driven by relevance, length, and context. Segmenting by type reveals if algorithmic playlists are the problem (bad recommendations) vs. editorial (too long or mismatched mood). Skip rate patterns show where users disengage. Context (device, time) reveals if the listening occasion changed.",
    tip: "For media consumption metrics, always consider the content quality dimension. A drop in completion might mean content relevance declined, not that the feature is broken.",
  },
  {
    id: "msft-bh-1",
    company: "Microsoft",
    type: "Behavioral",
    difficulty: "Medium",
    question: "Tell me about a time you had to say no to a stakeholder's feature request.",
    options: [
      "Share a specific example where you listened empathetically, explained the prioritization framework and data behind the decision, offered an alternative solution, and maintained the relationship",
      "Say you always accommodate stakeholder requests to maintain harmony",
      "Explain that you simply forwarded the request to your manager to handle",
      "Describe ignoring the request and hoping they'd forget about it",
    ],
    correctIndex: 0,
    modelAnswer:
      "Saying no is a core PM skill. The best approach: acknowledge the request's merit, share the prioritization framework (impact vs. effort, strategic alignment), explain what would need to be deprioritized to accommodate it, and propose an alternative or future timeline. This turns 'no' into a transparent trade-off discussion.",
    tip: "When answering 'saying no' questions, never frame it as a confrontation. Frame it as a transparent prioritization discussion with shared context and data.",
  },
  {
    id: "nflx-gs-1",
    company: "Netflix",
    type: "Guesstimate",
    difficulty: "Hard",
    question: "Estimate Netflix's monthly content hosting and streaming infrastructure cost.",
    options: [
      "~$150-200M/month (based on ~260M subscribers, ~2 hours average daily viewing, ~3GB/hour average bitrate, at ~$0.01/GB CDN cost, plus storage and encoding overhead)",
      "~$1 million/month",
      "~$5 billion/month",
      "~$10 million/month",
    ],
    correctIndex: 0,
    modelAnswer:
      "Framework: 260M subscribers × ~50% concurrent daily = ~130M daily viewers × 2hrs × 3GB/hr = ~780 petabytes/day → ~23,000 PB/month. At ~$0.005-0.01/GB (Netflix runs its own CDN, Open Connect) = ~$115-230M/month. Add storage, encoding, and redundancy overhead → ~$150-200M/month. Netflix's total tech spend is ~$2.5B/year, so ~$200M/month is reasonable.",
    tip: "For infrastructure guesstimates, build from usage patterns (users × time × data rate) up to total data volume, then apply unit economics. Cross-check against known annual spending.",
  },
  {
    id: "strp-bh-1",
    company: "Stripe",
    type: "Behavioral",
    difficulty: "Medium",
    question: "Describe a time you had to balance short-term revenue goals with long-term product vision.",
    options: [
      "Share a real example where you quantified the short-term revenue opportunity, articulated the long-term strategic risk of pursuing it, proposed a compromise that partially served both goals, and aligned leadership on the trade-off",
      "Say you always prioritize revenue because it's measurable",
      "Explain that product vision is the engineering team's responsibility",
      "Describe choosing long-term vision every time without considering revenue",
    ],
    correctIndex: 0,
    modelAnswer:
      "The best PMs frame this as a quantified trade-off, not a religious debate. Show that you modeled the short-term revenue impact, articulated the long-term compounding value of the vision, and found a creative middle ground that partially served both. Leadership wants PMs who can hold both timelines in their head.",
    tip: "For trade-off behavioral questions, never pick one extreme. Show you can quantify both sides and find creative compromises that serve the business holistically.",
  },
  {
    id: "fk-bh-1",
    company: "Flipkart",
    type: "Behavioral",
    difficulty: "Medium",
    question: "Tell me about a time you had to launch a product in a market you didn't fully understand.",
    options: [
      "Describe how you immersed yourself (user interviews, field visits, data analysis), identified your knowledge gaps, partnered with local experts, and built feedback loops to learn fast post-launch",
      "Say you relied entirely on market research reports",
      "Explain that you launched based on your intuition from other markets",
      "Admit you delegated the entire project to someone with market knowledge",
    ],
    correctIndex: 0,
    modelAnswer:
      "Launching in unfamiliar markets requires structured learning: primary research (talking to users), secondary research (market data), and local expertise (partnering with people who know the market). The best PMs are explicit about their knowledge gaps and build rapid feedback loops to correct course post-launch.",
    tip: "For 'unfamiliar territory' questions, show intellectual humility and a structured approach to learning. PMs who admit what they don't know and build systems to learn fast are more valued than those who pretend to know everything.",
  },
];
