export interface CaseSnack {
  id: string;
  title: string;
  emoji: string;
  situation: string;
  options: string[];
  correctIndex: number;
  whatHappened: string;
  pmLesson: string;
  category: "AI Decision" | "Growth" | "Pricing" | "Launch Strategy" | "Pivot" | "Feature Kill";
}

export const caseSnacks: CaseSnack[] = [
  {
    id: "cs-001",
    title: "Instagram Kills Chronological Feed",
    emoji: "\u{1F4F8}",
    situation: "It's 2016. Instagram has 500M users but engagement is plateauing. Users follow too many accounts and miss 70% of posts. The team proposes replacing the chronological feed with an algorithmic one. Users are already angry about the rumor. What should Instagram do?",
    options: [
      "Keep the chronological feed \u2014 users explicitly hate the idea of algorithmic sorting",
      "Ship the algorithmic feed because data shows users miss content they'd engage with",
      "Offer both options and let users choose their preferred feed",
      "Test the algorithmic feed on 10% of users and measure engagement before deciding"
    ],
    correctIndex: 1,
    whatHappened: "Instagram shipped the algorithmic feed despite massive user backlash. The result? Time spent increased significantly, likes per post increased 50%+ for average creators, and engagement metrics improved across the board. The vocal minority who protested didn't represent actual behavior \u2014 users engaged more with an algorithmic feed even though they said they preferred chronological.",
    pmLesson: "Stated preferences and revealed preferences are often contradictory. Users said they wanted chronological, but their behavior showed they engaged more with algorithmic. Great PMs trust behavioral data over opinion surveys, especially when the status quo has a powerful incumbency bias.",
    category: "AI Decision"
  },
  {
    id: "cs-002",
    title: "Slack's Freemium Gamble",
    emoji: "\u{1F4AC}",
    situation: "It's 2014. Slack is growing fast with a freemium model, but the free tier is so generous (10K searchable messages, 10 integrations) that many teams never upgrade. The sales team wants to restrict the free tier aggressively. The product team argues the generous free tier IS the growth engine. What should Slack do?",
    options: [
      "Restrict the free tier significantly to force conversions",
      "Keep the generous free tier because organic growth is more valuable than short-term conversions",
      "Add premium features that free users can't access but don't restrict existing free features",
      "Eliminate the free tier and offer a low-cost starter plan instead"
    ],
    correctIndex: 2,
    whatHappened: "Slack kept its generous free tier largely intact but added compelling premium features (guest access, advanced admin controls, compliance features) that larger teams needed as they scaled. This strategy maintained viral growth while creating natural upgrade triggers as teams grew and had enterprise needs.",
    pmLesson: "The best freemium strategies create upgrade triggers that align with user success, not artificial restrictions. When growing teams naturally need features like SSO, compliance, and admin controls, the upgrade feels like a natural progression rather than a paywall. Restricting the free tier would have killed the bottom-up growth engine that made Slack successful.",
    category: "Growth"
  },
  {
    id: "cs-003",
    title: "Netflix Raises Prices (Again)",
    emoji: "\u{1F3AC}",
    situation: "It's 2019. Netflix has 150M subscribers and is spending $15B/year on content. They need to raise prices by $2/month to sustain content investment. Analysts warn that price increases in a competitive market (Disney+, HBO Max launching) will cause churn. What should Netflix do?",
    options: [
      "Absorb the cost and keep prices flat to avoid churn during competitive launches",
      "Raise prices because their content moat is strong enough to retain subscribers",
      "Introduce a cheaper ad-supported tier instead of raising prices on existing plans",
      "Raise prices on new subscribers only, grandfathering existing users"
    ],
    correctIndex: 1,
    whatHappened: "Netflix raised prices to $12.99 for the standard plan. Despite predictions of mass churn, subscriber growth continued. The price increase generated billions in additional annual revenue that funded content like Stranger Things S3 and The Witcher, which in turn drove more sign-ups. Netflix's content moat proved strong enough to absorb the increase.",
    pmLesson: "When you have a genuine content/product moat, pricing power is real. The key insight is that Netflix wasn't selling a commodity streaming service \u2014 they were selling exclusive access to content users couldn't get elsewhere. PMs should understand the difference between pricing power (unique value) and price sensitivity (commodity value) when making pricing decisions.",
    category: "Pricing"
  },
  {
    id: "cs-004",
    title: "Google+ vs. Facebook",
    emoji: "\u{1F50D}",
    situation: "It's 2011. Google launches Google+ to compete with Facebook. They have 1B+ Gmail users they can onboard instantly. The team debates: should they force Google+ integration into Gmail, YouTube, and other Google products to drive adoption, or let the product grow organically on its own merits?",
    options: [
      "Force integration across Google products to leverage the massive existing user base",
      "Let Google+ grow organically based on product quality and word-of-mouth",
      "Launch as a standalone app with unique features that differentiate from Facebook",
      "Target a niche audience first (e.g., photographers with Circles) before going mainstream"
    ],
    correctIndex: 3,
    whatHappened: "Google chose forced integration, bundling Google+ into Gmail, YouTube comments, and even requiring it for app reviews. This created resentment \u2014 users had Google+ accounts but never used them. The product had no unique value proposition beyond Circles, and force-feeding it through other products couldn't manufacture genuine engagement. Google+ was shut down in 2019.",
    pmLesson: "Distribution advantage cannot substitute for product-market fit. Google had unprecedented distribution through its product ecosystem, but forced integration created phantom users, not engaged users. The right approach would have been to find a niche where Google+ offered unique value (Circles for specific communities), prove engagement there, and expand organically. Distribution amplifies product-market fit; it doesn't create it.",
    category: "Launch Strategy"
  },
  {
    id: "cs-005",
    title: "Superhuman's $30/Month Email",
    emoji: "\u{2709}\uFE0F",
    situation: "It's 2017. Superhuman is building a premium email client. The market is dominated by free options (Gmail, Outlook). The team debates pricing: the product is exceptional but email is something users expect to get for free. Should they charge $30/month for an email client?",
    options: [
      "Price at $5/month to stay competitive with the perception that email should be cheap/free",
      "Launch as freemium with a $30/month pro tier",
      "Charge $30/month and position it as a productivity tool for power users, not an email client",
      "Launch for free, build a user base, then introduce pricing later"
    ],
    correctIndex: 2,
    whatHappened: "Superhuman launched at $30/month with a concierge onboarding experience. By positioning it as 'the fastest email experience ever built' for professionals who value time, they attracted users who measured the cost against hours saved, not against free alternatives. The waitlist hit 300K+, and the high price actually reinforced the premium positioning.",
    pmLesson: "Pricing communicates value. By charging $30/month, Superhuman signaled that this product was for serious professionals, not casual users. The high price filtered for users who would appreciate and evangelize the product. Combined with concierge onboarding (which the high price funded), it created a premium experience loop. PMs should price based on value delivered, not competitive anchoring.",
    category: "Pricing"
  },
  {
    id: "cs-006",
    title: "Twitter's Edit Button Dilemma",
    emoji: "\u{1F426}",
    situation: "It's 2022. Twitter users have been demanding an edit button for over a decade. It's the #1 feature request. But Twitter's core value is the real-time, public record of conversation. An edit button could enable bait-and-switch (tweet something viral, then edit the content). What should Twitter do?",
    options: [
      "Add a full edit button with no restrictions \u2014 it's what users want",
      "Never add an edit button \u2014 the integrity of the public record is more important than user convenience",
      "Add a time-limited edit window (30 min) with full edit history visible to all users",
      "Add an edit button but only for Twitter Blue subscribers"
    ],
    correctIndex: 2,
    whatHappened: "Twitter launched an edit feature (initially for Twitter Blue) with a 30-minute edit window and visible edit history. This was the right compromise: users could fix typos (the main use case), but the edit history prevented bait-and-switch tactics. The time limit prevented retroactive revision of tweets that had already spread.",
    pmLesson: "The most-requested feature isn't always the right feature as described by users. Users wanted 'edit' but what they meant was 'fix typos.' A PM's job is to understand the underlying need, not just the stated request, and design a solution that serves the need while protecting the product's integrity. Constraints (time limit, visible history) often make features better, not worse.",
    category: "Feature Kill"
  },
  {
    id: "cs-007",
    title: "Spotify's Podcast Bet",
    emoji: "\u{1F3A7}",
    situation: "It's 2019. Spotify is the #1 music streaming platform but music margins are thin (70%+ goes to labels). The team proposes spending $1B+ on podcast acquisitions and exclusives. Critics argue Spotify should stay focused on music and that podcasts are a different market. What should Spotify do?",
    options: [
      "Stay focused on music \u2014 podcasts are a distraction from the core product",
      "Invest heavily in podcasts because they offer higher margins and diversify revenue away from music label dependency",
      "Add podcasts as a feature but don't invest in exclusive content",
      "Spin out a separate podcast app to avoid confusing the Spotify brand"
    ],
    correctIndex: 1,
    whatHappened: "Spotify invested $1B+ in podcast companies (Gimlet, Anchor, The Ringer) and exclusive deals (Joe Rogan for $200M+). Podcasts became Spotify's fastest-growing content category, podcast advertising revenue grew to $300M+, and the strategy reduced Spotify's dependency on music labels for content differentiation.",
    pmLesson: "Strategic diversification is essential when your core business has structural margin constraints. Spotify's music business will always have thin margins because labels control content. Podcasts offered owned content with higher margins and advertising revenue. The PM lesson: understand your cost structure's constraints and invest in adjacencies that improve your structural economics, not just your user metrics.",
    category: "Pivot"
  },
  {
    id: "cs-008",
    title: "Apple Removes the Headphone Jack",
    emoji: "\u{1F3B6}",
    situation: "It's 2016. Apple is designing the iPhone 7. The team proposes removing the 3.5mm headphone jack to make the phone thinner, improve water resistance, and push wireless audio forward. It will alienate millions of users who own wired headphones. What should Apple do?",
    options: [
      "Keep the headphone jack \u2014 it's the most-used port and removing it will anger customers",
      "Remove the headphone jack because it enables better hardware design and pushes the industry toward wireless",
      "Keep the jack but add wireless as the primary option, phasing out the jack in iPhone 8",
      "Remove it but include wireless AirPods in the box to ease the transition"
    ],
    correctIndex: 1,
    whatHappened: "Apple removed the headphone jack in iPhone 7 despite massive criticism. They included a Lightning adapter and promoted AirPods (sold separately). The result: AirPods became a $12B+/year product line, wireless audio became the industry standard, and iPhone sales were not materially impacted. The backlash was loud but temporary.",
    pmLesson: "Sometimes the PM's job is to make decisions users will hate today but thank you for tomorrow. Apple saw that wireless audio was inevitable and decided to accelerate the transition rather than delay it. The key insight: short-term backlash is tolerable when the long-term trajectory is clear and the decision creates a platform for future products (AirPods). Courage in product decisions means making the right choice, not the popular one.",
    category: "Feature Kill"
  },
  {
    id: "cs-009",
    title: "Zoom's Explosive Growth Decision",
    emoji: "\u{1F4F9}",
    situation: "It's March 2020. COVID-19 lockdowns begin. Zoom's daily users spike from 10M to 200M in weeks. The free tier (40-minute limit for group calls) is straining under massive demand. Schools, churches, and nonprofits are relying on Zoom but can't afford paid plans. What should Zoom do?",
    options: [
      "Keep the 40-minute limit \u2014 it drives conversions and the infrastructure costs are enormous",
      "Remove the free tier temporarily to manage server load",
      "Lift the 40-minute limit for specific use cases (education, nonprofits) to build goodwill and lock in users during a category-defining moment",
      "Raise prices since demand is at an all-time high"
    ],
    correctIndex: 2,
    whatHappened: "Zoom lifted the 40-minute limit for K-12 schools globally and offered free access to various organizations. This decision cost them significant revenue in the short term but established Zoom as the default video platform for an entire generation of students, teachers, and organizations. When these users later needed premium features, Zoom was the automatic choice.",
    pmLesson: "In category-defining moments, market capture is more valuable than margin optimization. Zoom recognized that COVID was a once-in-a-generation opportunity to become the default video platform. By being generous when users needed them most, they earned loyalty and habit formation that no amount of marketing could buy. The PM insight: there are moments when acquiring users (even at a loss) is strategically more important than monetizing them.",
    category: "Growth"
  },
  {
    id: "cs-010",
    title: "WhatsApp Says No to Ads",
    emoji: "\u{1F4F1}",
    situation: "It's 2018. Facebook acquired WhatsApp for $19B in 2014. Facebook's leadership wants to introduce ads into WhatsApp Status (similar to Instagram Stories ads) to monetize the 1.5B+ user base. WhatsApp's founders (Jan Koum, Brian Acton) are opposed, citing the original promise of no ads. What should happen?",
    options: [
      "Introduce ads \u2014 Facebook paid $19B and needs to monetize the acquisition",
      "Keep the no-ads promise and find alternative monetization (business APIs, payments)",
      "Introduce subtle, non-intrusive ads only in Status to test user reaction",
      "Make WhatsApp a paid app ($1/year) as it originally was"
    ],
    correctIndex: 1,
    whatHappened: "WhatsApp's founders resigned over the disagreement. Facebook (Meta) ultimately shifted to monetizing through WhatsApp Business API (charging businesses for customer messaging) and WhatsApp Pay, rather than running consumer ads. The business API became a significant revenue stream without alienating the user base.",
    pmLesson: "The most obvious monetization path isn't always the best one. Ads would have generated revenue but risked undermining the trust and simplicity that made WhatsApp dominant. The business API monetizes WhatsApp's distribution without degrading the consumer experience. PMs should always explore monetization strategies that align with, rather than contradict, the core value proposition.",
    category: "Pricing"
  },
  {
    id: "cs-011",
    title: "Snapchat's Redesign Disaster",
    emoji: "\u{1F47B}",
    situation: "It's late 2017. Snapchat's user growth has slowed and the app is notoriously confusing for new users. The team proposes a radical redesign that separates friend content from publisher/media content. The redesign will make the app more intuitive for new users but dramatically change the experience for existing power users. What should Snapchat do?",
    options: [
      "Ship the full redesign \u2014 long-term growth depends on making the app accessible to mainstream users",
      "Keep the current design and find other ways to improve onboarding for new users",
      "Gradually introduce the changes with A/B testing, rolling out slowly to measure impact on both new and existing users",
      "Launch the redesign for new users only, keeping the old design for existing users"
    ],
    correctIndex: 2,
    whatHappened: "Snapchat shipped the radical redesign all at once. The backlash was catastrophic \u2014 a Change.org petition got 1.2M signatures, Kylie Jenner tweeted 'does anyone else not open Snapchat anymore,' wiping $1.3B from Snap's market cap. Daily active users declined for the first time. Snapchat eventually had to partially reverse the redesign.",
    pmLesson: "Major redesigns should be incremental, not revolutionary. Existing users have built muscle memory and mental models around the current product \u2014 disrupting those all at once creates backlash even if the new design is objectively better. The PM lesson: roll out major changes gradually, test with segments, and never underestimate the power of user habit. The best redesign is one users barely notice.",
    category: "Launch Strategy"
  },
  {
    id: "cs-012",
    title: "Pinterest Pivots from Catalog to Discovery",
    emoji: "\u{1F4CC}",
    situation: "It's 2012. Pinterest started as a tool for people to catalog things they like (recipes, outfits, home decor). But data shows users spend more time browsing others' pins than creating their own. The team debates: should they optimize for the cataloging use case (the original vision) or pivot to a visual discovery engine? What should Pinterest do?",
    options: [
      "Stay focused on cataloging \u2014 it's the original vision and core use case",
      "Pivot to visual discovery because that's what users are actually doing, even if it wasn't the original plan",
      "Build both experiences and let users choose",
      "Focus on social features to compete with Instagram"
    ],
    correctIndex: 1,
    whatHappened: "Pinterest pivoted to become a visual discovery engine, investing heavily in recommendation algorithms, visual search, and the home feed. This pivot aligned the product with actual user behavior and opened up a massive advertising business (users discovering products are high-intent shoppers). Pinterest reached 450M+ MAU and built a $15B+ advertising business.",
    pmLesson: "Follow the data, not the vision. Pinterest's original vision was digital scrapbooking, but users revealed a more powerful use case: visual discovery and shopping inspiration. The PM lesson is to hold your vision loosely and your data tightly. When users are telling you (through behavior) that your product is more valuable for something you didn't plan, that's not a failure of vision \u2014 it's a discovery of product-market fit.",
    category: "Pivot"
  },
  {
    id: "cs-013",
    title: "Stripe's Developer-First Bet",
    emoji: "\u{1F4B3}",
    situation: "It's 2011. The Collison brothers are building Stripe. The payments industry is dominated by PayPal and traditional payment processors. Most competitors focus on business decision-makers (CFOs, procurement). Stripe's bet is to focus entirely on developers with beautiful APIs and documentation. But developers don't write checks. What should Stripe do?",
    options: [
      "Target business decision-makers like every other payment company",
      "Build for developers because they're the ones who implement payment systems, and developer love creates bottom-up adoption",
      "Build a no-code solution so non-technical users can set up payments",
      "Start with SMBs who need simple payment processing, then add developer tools later"
    ],
    correctIndex: 1,
    whatHappened: "Stripe went all-in on developers. Their 7-line integration code became legendary. Developer word-of-mouth created organic growth that required zero enterprise sales. As startups that used Stripe grew into large companies, Stripe grew with them. Today Stripe processes $800B+/year in payments and is valued at $50B+.",
    pmLesson: "Sometimes the buyer and the user are different people, and building for the user creates better long-term outcomes. Stripe bet that developers would choose the payment processor and influence the purchase decision, even though the CFO signs the contract. This developer-first strategy created an incredibly efficient go-to-market: no sales team needed for initial adoption. PMs should ask: who actually makes the implementation decision, not just the purchasing decision?",
    category: "Launch Strategy"
  },
  {
    id: "cs-014",
    title: "YouTube Shorts vs. TikTok",
    emoji: "\u{1F3AC}",
    situation: "It's 2020. TikTok is exploding in popularity with short-form vertical video. YouTube's core product is long-form horizontal video. The team proposes launching YouTube Shorts \u2014 a TikTok-like feature within YouTube. Critics argue it will cannibalize long-form watch time and confuse YouTube's identity. What should YouTube do?",
    options: [
      "Don't launch Shorts \u2014 protect the long-form video ecosystem that drives ad revenue",
      "Launch Shorts as a separate app to avoid cannibalizing the main YouTube experience",
      "Launch Shorts within YouTube because the platform's existing creator base and distribution infrastructure give it an unfair advantage over a standalone app",
      "Acquire TikTok instead of building a competing feature"
    ],
    correctIndex: 2,
    whatHappened: "YouTube launched Shorts within the main app. Despite cannibalization concerns, Shorts reached 2B+ logged-in users monthly. Existing YouTube creators adopted Shorts to reach new audiences, and the Shorts feed drove discovery of their long-form content. Rather than cannibalizing, Shorts became a top-of-funnel for long-form engagement.",
    pmLesson: "Platform incumbents should bundle competitive features rather than launch separate apps. YouTube's existing creator ecosystem, recommendation infrastructure, and user base gave Shorts an unfair distribution advantage. The cannibalization fear was real but manageable \u2014 Shorts and long-form serve different moments (short attention vs. deep attention), so they complement rather than substitute. PMs should consider whether new formats expand usage occasions rather than just redistribute existing time.",
    category: "AI Decision"
  },
  {
    id: "cs-015",
    title: "Notion Kills the Startup They Acquired",
    emoji: "\u{1F4DD}",
    situation: "It's 2023. Notion acquires Cron, a beautifully designed calendar app with a devoted user base. The debate: should they keep Cron running as a separate product, integrate it deeply into Notion (killing the standalone app), or maintain both? Cron users are passionate about the standalone experience. What should Notion do?",
    options: [
      "Keep Cron running as a standalone app alongside Notion",
      "Immediately shut down Cron and rebuild its features inside Notion",
      "Rebrand Cron as Notion Calendar, deeply integrate it with Notion's workspace, but maintain core calendar functionality that Cron users loved",
      "Sell Cron to another company since calendar doesn't fit Notion's core product"
    ],
    correctIndex: 2,
    whatHappened: "Notion rebranded Cron as Notion Calendar, integrating it with Notion's workspace while preserving the fast, keyboard-driven calendar experience that Cron users loved. The calendar became a natural extension of Notion's all-in-one workspace vision, and existing Cron users migrated largely without backlash because their core experience was respected.",
    pmLesson: "When integrating acquisitions, preserve what users love while adding what makes the combination valuable. The mistake most acquirers make is either leaving the acquisition too independent (missing integration value) or absorbing it so aggressively that the original product's magic is lost. Notion found the middle ground: rebrand and integrate the data layer, but respect the UX that users fell in love with.",
    category: "Feature Kill"
  }
];
