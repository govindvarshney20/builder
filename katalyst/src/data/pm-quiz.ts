export interface QuizQuestion {
  id: string;
  question: string;
  options: { text: string; scores: Record<string, number> }[];
}

export interface PMType {
  type: string;
  emoji: string;
  title: string;
  description: string;
  strengths: string[];
  growthAreas: string[];
  idealRoles: string[];
  famousPMs: string[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "You just joined a new company. What's the first thing you want to understand?",
    options: [
      {
        text: "The data pipeline -- I want to see every metric, funnel, and cohort analysis before I form opinions",
        scores: { analytical: 3, growth: 1, technical: 1 },
      },
      {
        text: "The customers -- I want to sit in on 10 user interviews this week and map their journey end-to-end",
        scores: { customer: 3, design: 1 },
      },
      {
        text: "The tech stack and architecture -- I want to know what's possible and where the technical debt lives",
        scores: { technical: 3, analytical: 1 },
      },
      {
        text: "The competitive landscape and market trends -- where is the industry heading in 3-5 years?",
        scores: { visionary: 3, growth: 1 },
      },
    ],
  },
  {
    id: "q2",
    question: "Your team is debating what to build next quarter. How do you break the tie?",
    options: [
      {
        text: "Pull up the data -- A/B test results, usage analytics, and revenue projections tell the real story",
        scores: { analytical: 3, growth: 1 },
      },
      {
        text: "Show user research -- play the clips from customer interviews where they describe the pain point",
        scores: { customer: 3, design: 1 },
      },
      {
        text: "Map the technical dependencies -- the right answer is whatever unblocks the most future capabilities",
        scores: { technical: 3 },
      },
      {
        text: "Paint the vision -- if we nail this, here's how it transforms our product category entirely",
        scores: { visionary: 3, design: 1 },
      },
    ],
  },
  {
    id: "q3",
    question: "A feature you launched is underperforming expectations. What's your instinct?",
    options: [
      {
        text: "Segment the data by cohort, device, and acquisition channel to find where the breakdown is",
        scores: { analytical: 3, growth: 1 },
      },
      {
        text: "Call five users who tried it and five who didn't to understand the gap between intent and behavior",
        scores: { customer: 3 },
      },
      {
        text: "Check the performance metrics -- maybe latency or bugs are silently killing the experience",
        scores: { technical: 3, analytical: 1 },
      },
      {
        text: "Redesign the experience -- the core idea is right but the UX isn't communicating the value clearly enough",
        scores: { design: 3, customer: 1 },
      },
    ],
  },
  {
    id: "q4",
    question: "What kind of product meeting energizes you the most?",
    options: [
      {
        text: "A deep-dive into experiment results where you find a surprising insight that changes the roadmap",
        scores: { analytical: 3 },
      },
      {
        text: "A design review where the team is crafting a delightful experience down to the micro-interactions",
        scores: { design: 3, customer: 1 },
      },
      {
        text: "A technical architecture discussion where you're designing for scale and extensibility",
        scores: { technical: 3 },
      },
      {
        text: "A brainstorm about how AI and emerging tech could create an entirely new product category",
        scores: { visionary: 3, technical: 1 },
      },
    ],
  },
  {
    id: "q5",
    question: "How do you define product success?",
    options: [
      {
        text: "Clear metrics moving in the right direction -- retention up, churn down, revenue growing",
        scores: { analytical: 2, growth: 3 },
      },
      {
        text: "Users genuinely love it -- high NPS, organic word-of-mouth, and emotional connection to the product",
        scores: { customer: 2, design: 2 },
      },
      {
        text: "The product is technically elegant, reliable, and built on a foundation that can evolve for years",
        scores: { technical: 3 },
      },
      {
        text: "It changes user behavior or creates a market that didn't exist before",
        scores: { visionary: 3, growth: 1 },
      },
    ],
  },
  {
    id: "q6",
    question: "You're writing a PRD. What section do you spend the most time on?",
    options: [
      {
        text: "Success metrics and measurement plan -- if we can't measure it, we can't improve it",
        scores: { analytical: 3, growth: 1 },
      },
      {
        text: "User stories and jobs-to-be-done -- every feature maps back to a real human need",
        scores: { customer: 3 },
      },
      {
        text: "Technical considerations and system design -- I want engineering to know I've thought through the constraints",
        scores: { technical: 3 },
      },
      {
        text: "The product vision and how this feature fits the long-term narrative",
        scores: { visionary: 2, design: 2 },
      },
    ],
  },
  {
    id: "q7",
    question: "Your CEO asks you to 10x growth in 18 months. Your first move?",
    options: [
      {
        text: "Build a growth model -- map every lever from acquisition to monetization and find the highest-leverage bottleneck",
        scores: { growth: 3, analytical: 2 },
      },
      {
        text: "Talk to power users -- understand why they stay, then find more people like them",
        scores: { customer: 3, growth: 1 },
      },
      {
        text: "Invest in platform capabilities -- APIs, integrations, and developer tools that let others build on top of you",
        scores: { technical: 3, growth: 1 },
      },
      {
        text: "Reimagine the product for a 10x bigger market -- maybe the current form factor is the constraint",
        scores: { visionary: 3, growth: 1 },
      },
    ],
  },
  {
    id: "q8",
    question: "Which product decision keeps you up at night?",
    options: [
      {
        text: "Are we optimizing for the right metric? What if our north star is actually misleading us?",
        scores: { analytical: 3 },
      },
      {
        text: "Are we solving a real problem or just building what's easy? Have we truly listened to users?",
        scores: { customer: 3 },
      },
      {
        text: "Is our architecture going to scale? Are we accumulating debt that will slow us down in 2 years?",
        scores: { technical: 3 },
      },
      {
        text: "Are we being bold enough? What if a competitor leapfrogs us because we played it too safe?",
        scores: { visionary: 2, growth: 2 },
      },
    ],
  },
  {
    id: "q9",
    question: "A designer presents three concepts for a new feature. How do you decide?",
    options: [
      {
        text: "Run a quantitative preference test with a representative user sample and let the data decide",
        scores: { analytical: 3 },
      },
      {
        text: "The one that makes you feel something -- great products create emotional responses",
        scores: { design: 3, customer: 1 },
      },
      {
        text: "Whichever is most technically feasible within our constraints and timeline",
        scores: { technical: 2, growth: 1 },
      },
      {
        text: "The one that's most differentiated -- even if it's riskier, it could define a new standard",
        scores: { visionary: 3, design: 1 },
      },
    ],
  },
  {
    id: "q10",
    question: "What's your superpower in stakeholder conversations?",
    options: [
      {
        text: "I bring receipts -- dashboards, analyses, and evidence that make the case undeniable",
        scores: { analytical: 3, growth: 1 },
      },
      {
        text: "I bring the user's voice -- I make stakeholders feel what the customer feels",
        scores: { customer: 3, design: 1 },
      },
      {
        text: "I translate between business and engineering -- I can explain technical trade-offs in business terms",
        scores: { technical: 3 },
      },
      {
        text: "I paint a compelling future -- I get people excited about where we're going and why it matters",
        scores: { visionary: 3 },
      },
    ],
  },
  {
    id: "q11",
    question: "You have a free afternoon. What product content do you consume?",
    options: [
      {
        text: "Case studies on how companies like Spotify and Netflix use experimentation at scale",
        scores: { analytical: 2, growth: 2 },
      },
      {
        text: "UX teardowns and design critiques -- I love understanding why great interfaces work",
        scores: { design: 3, customer: 1 },
      },
      {
        text: "Engineering blogs about system design, ML infrastructure, or new frameworks",
        scores: { technical: 3 },
      },
      {
        text: "Thought pieces about the future of technology, AI, and how products will evolve",
        scores: { visionary: 3 },
      },
    ],
  },
  {
    id: "q12",
    question: "Your product just hit product-market fit. What's your priority now?",
    options: [
      {
        text: "Instrument everything -- build the analytics foundation to understand every user touchpoint at scale",
        scores: { analytical: 2, growth: 2 },
      },
      {
        text: "Deepen the experience -- make the core loop so good that users can't imagine life without it",
        scores: { customer: 2, design: 2 },
      },
      {
        text: "Scale the infrastructure -- make sure the product doesn't break as 10x more users arrive",
        scores: { technical: 3, growth: 1 },
      },
      {
        text: "Expand the vision -- now that the core works, build the broader platform and ecosystem",
        scores: { visionary: 2, growth: 2 },
      },
    ],
  },
];

export const pmTypes: PMType[] = [
  {
    type: "analytical",
    emoji: "📊",
    title: "The Data Strategist",
    description:
      "You let the numbers tell the story. Your decisions are grounded in rigorous analysis, A/B testing, and metric-driven thinking. You believe every great product decision starts with a hypothesis and ends with data. Teams love working with you because you cut through opinions with evidence, and stakeholders trust your recommendations because they're always backed by proof.",
    strengths: [
      "Turning ambiguous situations into measurable experiments",
      "Building compelling business cases with data",
      "Identifying hidden patterns in user behavior",
      "Setting the right KPIs and success metrics",
      "Calling out vanity metrics and correlation-causation traps",
    ],
    growthAreas: [
      "Making bold bets when data is insufficient or ambiguous",
      "Connecting emotionally with user stories beyond the numbers",
      "Moving fast on intuition when perfect data isn't available",
      "Balancing analytical rigor with speed of execution",
    ],
    idealRoles: [
      "Growth PM at a data-rich platform (Spotify, Netflix, Uber)",
      "PM for experimentation or analytics platforms",
      "PM at fintech or marketplace companies",
      "Product analytics or insights leadership",
    ],
    famousPMs: [
      "Shreyas Doshi (Stripe, Twitter)",
      "Casey Winters (Eventbrite, Pinterest)",
      "Dan Olsen (author of The Lean Product Playbook)",
    ],
  },
  {
    type: "customer",
    emoji: "💬",
    title: "The User Whisperer",
    description:
      "You have an almost supernatural ability to understand what users need -- sometimes before they know it themselves. Your product instinct is honed through thousands of hours of user research, support tickets, and customer conversations. You build products that people love because you genuinely understand and empathize with the humans using them.",
    strengths: [
      "Conducting insightful user research that uncovers deep needs",
      "Translating fuzzy user pain points into clear product requirements",
      "Building products with exceptional product-market fit",
      "Championing the user's voice in every decision",
      "Spotting the gap between what users say and what they do",
    ],
    growthAreas: [
      "Balancing user desires with business viability and technical constraints",
      "Saying no to user requests that don't align with strategy",
      "Scaling insights from qualitative research to quantitative validation",
      "Making prioritization decisions when multiple user segments have conflicting needs",
    ],
    idealRoles: [
      "Consumer PM at companies like Airbnb, Duolingo, or Headspace",
      "PM for onboarding and activation",
      "0-to-1 product roles where deep user understanding is essential",
      "Product roles at mission-driven or health-tech companies",
    ],
    famousPMs: [
      "Julie Zhuo (former VP Design at Facebook)",
      "Teresa Torres (author of Continuous Discovery Habits)",
      "Marty Cagan (Silicon Valley Product Group)",
    ],
  },
  {
    type: "technical",
    emoji: "🛠️",
    title: "The Platform Architect",
    description:
      "You think in systems, APIs, and architectural trade-offs. Where others see features, you see the infrastructure that enables them. You bridge the gap between product vision and engineering reality, earning deep respect from developers because you speak their language. Your products are built on foundations that scale and evolve gracefully.",
    strengths: [
      "Deeply understanding technical constraints and possibilities",
      "Making smart build-vs-buy and architecture decisions",
      "Earning credibility and trust with engineering teams",
      "Designing extensible platforms and developer experiences",
      "Identifying and prioritizing technical debt strategically",
    ],
    growthAreas: [
      "Staying focused on user outcomes rather than elegant solutions",
      "Communicating technical decisions in business-friendly language",
      "Balancing platform thinking with near-term user value delivery",
      "Developing stronger design and UX sensibility",
    ],
    idealRoles: [
      "Platform PM at companies like Stripe, Twilio, or AWS",
      "Developer tools and API product management",
      "Infrastructure or internal tools PM",
      "Technical PM at AI/ML-first companies",
    ],
    famousPMs: [
      "Satya Nadella (CEO, Microsoft -- started as a technical PM)",
      "Werner Vogels (CTO, Amazon)",
      "Jean Yang (Akita Software, former academic)",
    ],
  },
  {
    type: "visionary",
    emoji: "🚀",
    title: "The Visionary Disruptor",
    description:
      "You see the future before it arrives. While others optimize the present, you're imagining the product that will define the next era. Your superpower is connecting dots across industries, technologies, and trends to envision products that create entirely new categories. You inspire teams to build things that seem impossible -- until they ship.",
    strengths: [
      "Creating compelling product visions that inspire teams and investors",
      "Identifying emerging technology opportunities before they're mainstream",
      "Thinking in systems and ecosystems rather than individual features",
      "Challenging assumptions and pushing past incremental thinking",
      "Building narratives that attract top talent and partners",
    ],
    growthAreas: [
      "Grounding visions in feasible execution plans and timelines",
      "Staying patient with iterative progress toward the big vision",
      "Validating ideas with users before falling in love with them",
      "Balancing moonshot thinking with delivering near-term value",
    ],
    idealRoles: [
      "0-to-1 product creation at startups or innovation labs",
      "Head of Product or CPO at early-stage companies",
      "PM for emerging tech (AR/VR, AI agents, spatial computing)",
      "Strategic product roles at companies like Apple, Tesla, or OpenAI",
    ],
    famousPMs: [
      "Steve Jobs (Apple)",
      "Sundar Pichai (Google -- started as a PM)",
      "Kevin Systrom (Instagram co-founder)",
    ],
  },
  {
    type: "growth",
    emoji: "📈",
    title: "The Growth Engine",
    description:
      "You see every product interaction as a lever in a growth machine. Funnels, loops, and flywheels are your native language. You obsess over activation rates, viral coefficients, and monetization efficiency. Teams love working with you because you connect product decisions directly to business outcomes and can model the impact of any change.",
    strengths: [
      "Building and optimizing acquisition and retention funnels",
      "Designing viral loops and referral mechanisms",
      "Connecting product metrics to revenue and business outcomes",
      "Running high-velocity experimentation programs",
      "Identifying and removing friction in critical user flows",
    ],
    growthAreas: [
      "Ensuring growth tactics don't compromise long-term user trust",
      "Building for sustainable growth rather than short-term metric spikes",
      "Developing deeper empathy for user experience beyond conversion",
      "Thinking beyond optimization to create step-change innovations",
    ],
    idealRoles: [
      "Growth PM at high-scale consumer companies",
      "PM for monetization, payments, or pricing",
      "PM at marketplace or platform companies (Uber, DoorDash, Stripe)",
      "Head of Growth at Series B-D startups",
    ],
    famousPMs: [
      "Andrew Chen (a16z, former Uber growth)",
      "Lenny Rachitsky (Airbnb, Lenny's Newsletter)",
      "Elena Verna (Amplitude, Miro growth advisor)",
    ],
  },
  {
    type: "design",
    emoji: "🎨",
    title: "The Experience Crafter",
    description:
      "You believe that how a product feels is just as important as what it does. You obsess over micro-interactions, information hierarchy, and the emotional journey of every user flow. Your products don't just work -- they delight. You bridge the gap between design and product, ensuring that craft and usability are never sacrificed for speed.",
    strengths: [
      "Crafting intuitive, beautiful product experiences",
      "Collaborating deeply with designers to elevate the UX",
      "Understanding information architecture and interaction design",
      "Sweating the details that turn good products into beloved ones",
      "Balancing aesthetic quality with functional usability",
    ],
    growthAreas: [
      "Making trade-offs when perfection conflicts with shipping speed",
      "Leveraging data to validate design intuitions at scale",
      "Building technical fluency to better scope design ambitions",
      "Prioritizing business impact alongside experience quality",
    ],
    idealRoles: [
      "Consumer PM at design-led companies (Apple, Figma, Linear)",
      "PM for creative tools and content platforms",
      "UX-focused PM at health, wellness, or education companies",
      "Product Design leadership (PM/Design hybrid roles)",
    ],
    famousPMs: [
      "Brian Chesky (Airbnb CEO -- design-driven PM)",
      "Rahul Vohra (Superhuman CEO)",
      "Jony Ive (former Apple CDO)",
    ],
  },
];
