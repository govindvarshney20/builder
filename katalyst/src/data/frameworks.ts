export interface Framework {
  id: string;
  name: string;
  category:
    | "Prioritization"
    | "Discovery"
    | "Strategy"
    | "Analytics"
    | "AI/ML"
    | "Execution"
    | "Growth";
  description: string;
  whenToUse: string;
  whenNotToUse: string;
  steps: string[];
  example: string;
  aiAngle: string;
}

export const frameworks: Framework[] = [
  {
    id: "rice",
    name: "RICE",
    category: "Prioritization",
    description:
      "RICE is a scoring model that evaluates features by Reach, Impact, Confidence, and Effort. It produces a numeric score that allows objective comparison across competing initiatives.",
    whenToUse:
      "Use RICE when you have a long backlog of features and need a data-driven way to rank them against each other.",
    whenNotToUse:
      "Avoid RICE when strategic alignment matters more than individual feature metrics, or when you lack reliable data to estimate reach and impact.",
    steps: [
      "List all candidate features or initiatives.",
      "Estimate Reach: how many users will this affect in a given time period?",
      "Estimate Impact: on a scale of 0.25 to 3, how much will this move your target metric?",
      "Assign Confidence: as a percentage, how sure are you of your estimates?",
      "Estimate Effort: how many person-months will this take?",
      "Calculate RICE score = (Reach x Impact x Confidence) / Effort and rank accordingly.",
    ],
    example:
      "Spotify used RICE-style scoring to decide whether to invest in podcast recommendations vs. improving playlist shuffle. Reach for podcasts was higher among new user cohorts, tipping the decision.",
    aiAngle:
      "For AI products, Reach can be tricky because model improvements affect all users simultaneously. Weight Confidence lower when the model's behavior is hard to predict before launch.",
  },
  {
    id: "heart",
    name: "HEART",
    category: "Analytics",
    description:
      "HEART is Google's UX metrics framework measuring Happiness, Engagement, Adoption, Retention, and Task success. It translates qualitative user experience goals into quantifiable signals.",
    whenToUse:
      "Use HEART when you need a structured way to measure user experience quality across multiple dimensions of your product.",
    whenNotToUse:
      "Avoid HEART when you only care about a single business metric like revenue, or when your product is too early-stage to have meaningful engagement data.",
    steps: [
      "Choose which HEART dimensions are most relevant to your product area.",
      "For each dimension, define Goals: what does success look like?",
      "Identify Signals: what user behaviors indicate progress toward each goal?",
      "Select Metrics: pick specific, measurable proxies for each signal.",
      "Build dashboards and instrument your product to track chosen metrics.",
      "Review metrics regularly and iterate on your measurement approach.",
    ],
    example:
      "Google Maps used HEART to track Task Success by measuring how often users successfully completed navigation to a destination without re-routing.",
    aiAngle:
      "For AI products, Happiness maps to user trust and perceived accuracy. Track Task Success as the rate at which the AI's output is accepted without manual correction.",
  },
  {
    id: "aarrr",
    name: "AARRR (Pirate Metrics)",
    category: "Growth",
    description:
      "AARRR stands for Acquisition, Activation, Retention, Revenue, and Referral. It is a funnel-based framework that helps startups identify where users drop off in the customer lifecycle.",
    whenToUse:
      "Use AARRR when you need to diagnose growth bottlenecks and figure out which stage of the user journey needs the most attention.",
    whenNotToUse:
      "Avoid AARRR when your product is B2B enterprise with long sales cycles where a simple funnel model oversimplifies the buying process.",
    steps: [
      "Map your Acquisition channels and measure cost per acquisition for each.",
      "Define your Activation moment: the first experience where users get real value.",
      "Measure Retention cohorts to see how many users come back over time.",
      "Track Revenue metrics including conversion rates and average revenue per user.",
      "Instrument Referral loops and measure viral coefficient.",
      "Identify the weakest stage and focus your next sprint on improving it.",
    ],
    example:
      "Dropbox discovered through AARRR analysis that Referral was their strongest lever, leading them to build the famous 'invite a friend, get free space' program.",
    aiAngle:
      "For AI products, Activation is critical because users must experience the AI's value in the first session. Measure time-to-first-useful-output as your activation metric.",
  },
  {
    id: "jobs-to-be-done",
    name: "Jobs-to-be-Done",
    category: "Discovery",
    description:
      "JTBD is a theory that customers 'hire' products to accomplish specific jobs in their lives. It shifts focus from demographics and features to the underlying progress a customer is trying to make.",
    whenToUse:
      "Use JTBD when you need to deeply understand customer motivations, especially when building a new product or entering a new market.",
    whenNotToUse:
      "Avoid JTBD when you already have strong quantitative signal on what to build and need to prioritize execution speed over further discovery.",
    steps: [
      "Conduct switch interviews: talk to recent customers about what triggered their switch to your product.",
      "Identify the functional, emotional, and social dimensions of the job.",
      "Map the job statement: 'When I [situation], I want to [motivation], so I can [expected outcome].'",
      "Identify competing solutions customers currently 'hire' for the same job.",
      "Prioritize underserved jobs where current solutions fall short.",
    ],
    example:
      "Intercom used JTBD to discover that customers hired their chat tool not for 'live chat' but for 'converting website visitors into trials,' reshaping their entire positioning.",
    aiAngle:
      "For AI products, JTBD reveals whether users hire the AI for automation (do it for me) or augmentation (help me do it better), which fundamentally changes the product design.",
  },
  {
    id: "kano-model",
    name: "Kano Model",
    category: "Prioritization",
    description:
      "The Kano Model classifies features into Must-be, One-dimensional, Attractive, Indifferent, and Reverse categories based on how they affect customer satisfaction. It reveals that the relationship between feature investment and satisfaction is non-linear.",
    whenToUse:
      "Use the Kano Model when you need to understand which features will delight users versus which are table-stakes expectations.",
    whenNotToUse:
      "Avoid the Kano Model when speed is critical and you cannot afford the survey overhead, or when your user base is too small for statistically valid results.",
    steps: [
      "List candidate features you are evaluating.",
      "For each feature, ask users two questions: how they feel if the feature IS present, and how they feel if it is NOT present.",
      "Use the Kano evaluation table to classify each feature into its category.",
      "Plot features on the Kano diagram to visualize the satisfaction curve.",
      "Prioritize: ensure all Must-be features are covered first, then invest in Attractive features for differentiation.",
    ],
    example:
      "A hotel chain used Kano analysis to discover that free Wi-Fi had shifted from an Attractive feature to a Must-be feature, meaning its absence caused dissatisfaction but its presence no longer delighted guests.",
    aiAngle:
      "For AI products, accuracy is typically a Must-be while personalization is Attractive. Kano helps you decide whether to invest in reducing errors versus adding smart new capabilities.",
  },
  {
    id: "moscow",
    name: "MoSCoW",
    category: "Prioritization",
    description:
      "MoSCoW categorizes requirements into Must have, Should have, Could have, and Won't have. It is a simple prioritization technique that creates clarity around what is non-negotiable for a release versus what can be deferred.",
    whenToUse:
      "Use MoSCoW when you need to quickly align stakeholders on release scope, especially under tight deadlines.",
    whenNotToUse:
      "Avoid MoSCoW when everything gets labeled 'Must have' due to political pressure, as the framework loses its value without honest categorization.",
    steps: [
      "Gather all requirements and user stories for the upcoming release.",
      "Classify each as Must have: the release fails without it.",
      "Classify Should haves: important but the release is still viable without them.",
      "Classify Could haves: nice to include if time permits.",
      "Explicitly label Won't haves: consciously excluded from this release.",
      "Validate classifications with stakeholders and ensure Must haves fit within capacity.",
    ],
    example:
      "A fintech startup used MoSCoW to launch their payment app with Must haves (send money, bank linking) while deferring Should haves (transaction history search) to the next release.",
    aiAngle:
      "For AI products, MoSCoW helps separate Must-have safety guardrails and compliance features from Could-have model improvements, ensuring responsible launches.",
  },
  {
    id: "opportunity-scoring",
    name: "Opportunity Scoring",
    category: "Discovery",
    description:
      "Opportunity Scoring, derived from Outcome-Driven Innovation, identifies features where customer importance is high but current satisfaction is low. This gap represents the highest-value opportunity for investment.",
    whenToUse:
      "Use Opportunity Scoring when you want a customer-centric, data-backed way to find unmet needs in an existing market.",
    whenNotToUse:
      "Avoid Opportunity Scoring when you are creating an entirely new category where customers cannot yet articulate their needs or rate satisfaction.",
    steps: [
      "List the outcomes customers are trying to achieve with your product.",
      "Survey customers to rate the Importance of each outcome (1-10).",
      "Survey customers to rate their current Satisfaction with each outcome (1-10).",
      "Calculate Opportunity Score = Importance + max(Importance - Satisfaction, 0).",
      "Rank outcomes by opportunity score to identify the biggest gaps.",
      "Focus your roadmap on the top-scoring opportunities.",
    ],
    example:
      "A project management tool surveyed users and found that 'understanding task dependencies' scored high importance but low satisfaction, leading them to build a visual dependency mapping feature.",
    aiAngle:
      "For AI products, survey users on outcomes like 'getting accurate results' and 'understanding why the AI made a recommendation' to find where your model's UX falls short.",
  },
  {
    id: "ice",
    name: "ICE",
    category: "Prioritization",
    description:
      "ICE scores features by Impact, Confidence, and Ease on a 1-10 scale, then multiplies them. It is a lightweight alternative to RICE that trades precision for speed when you need quick prioritization.",
    whenToUse:
      "Use ICE when you need fast, rough prioritization in early-stage products or growth experiments where data is limited.",
    whenNotToUse:
      "Avoid ICE for high-stakes decisions where the subjective scoring could lead to biased outcomes, or when you have enough data to use a more rigorous framework like RICE.",
    steps: [
      "List all experiments or features to evaluate.",
      "Score each on Impact (1-10): how much will this move the target metric?",
      "Score each on Confidence (1-10): how sure are you it will work?",
      "Score each on Ease (1-10): how easy is this to implement?",
      "Calculate ICE = Impact x Confidence x Ease.",
      "Run the highest-scoring experiments first and update scores based on results.",
    ],
    example:
      "A growth team at a SaaS company used ICE to quickly rank 30 experiment ideas and identified that simplifying the signup form (high ease, high impact) should run before a referral program (high impact but low ease).",
    aiAngle:
      "For AI products, Confidence scores should account for model uncertainty. An AI feature might have high Impact but low Confidence if you are unsure the model will generalize to production data.",
  },
  {
    id: "north-star-metric",
    name: "North Star Metric",
    category: "Strategy",
    description:
      "The North Star Metric is a single metric that best captures the core value your product delivers to customers. It aligns the entire organization around one measurable outcome that drives sustainable growth.",
    whenToUse:
      "Use a North Star Metric when you need to align cross-functional teams around a shared definition of success and prevent metric sprawl.",
    whenNotToUse:
      "Avoid relying solely on a North Star Metric when your product serves fundamentally different user segments with conflicting definitions of value.",
    steps: [
      "Identify the core value your product delivers to customers.",
      "Brainstorm metrics that capture this value exchange (not vanity metrics).",
      "Validate that the metric correlates with long-term revenue and retention.",
      "Ensure the metric is actionable: teams can run experiments that move it.",
      "Decompose the North Star into input metrics that different teams own.",
    ],
    example:
      "Airbnb's North Star Metric is 'Nights Booked' because it captures value for both hosts (income) and guests (travel experiences), aligning the entire company.",
    aiAngle:
      "For AI products, choose a North Star that reflects AI value delivery, such as 'tasks completed with AI assistance' rather than raw model accuracy, to keep the focus on user outcomes.",
  },
  {
    id: "double-diamond",
    name: "Double Diamond",
    category: "Discovery",
    description:
      "The Double Diamond is a design process model with four phases: Discover, Define, Develop, and Deliver. It alternates between divergent thinking (exploring possibilities) and convergent thinking (narrowing focus) twice.",
    whenToUse:
      "Use Double Diamond when tackling complex, ambiguous problems where you need to ensure you are solving the right problem before jumping to solutions.",
    whenNotToUse:
      "Avoid Double Diamond when the problem is already well-defined and the team needs to move quickly on a known solution.",
    steps: [
      "Discover: conduct broad research to understand the problem space through user interviews, data analysis, and observation.",
      "Define: synthesize findings to clearly articulate the core problem you will solve.",
      "Develop: brainstorm and prototype multiple potential solutions.",
      "Deliver: test, iterate, and ship the final solution.",
      "Reflect: measure outcomes against the problem definition and feed learnings back.",
    ],
    example:
      "The UK Government Digital Service used Double Diamond to redesign GOV.UK, spending significant time in Discover to understand citizen needs before writing a single line of code.",
    aiAngle:
      "For AI products, the Discover phase should include understanding data availability and model feasibility so you do not define a problem the AI cannot realistically solve.",
  },
  {
    id: "design-sprint",
    name: "Design Sprint",
    category: "Execution",
    description:
      "The Design Sprint is a five-day process developed at Google Ventures for answering critical business questions through design, prototyping, and testing with real users. It compresses months of work into a single week.",
    whenToUse:
      "Use a Design Sprint when you face a high-stakes decision, a tight timeline, or when a team is stuck and needs to break through analysis paralysis.",
    whenNotToUse:
      "Avoid Design Sprints for incremental improvements or when the key stakeholders cannot commit a full week of uninterrupted time.",
    steps: [
      "Monday: Map the problem and pick a target area to focus on.",
      "Tuesday: Sketch competing solutions individually, emphasizing quantity over consensus.",
      "Wednesday: Decide on the best solution through structured voting and storyboard the prototype.",
      "Thursday: Build a realistic prototype (just realistic enough to test, not production-ready).",
      "Friday: Test the prototype with 5 real users and capture learnings.",
    ],
    example:
      "Slack ran a Design Sprint to explore how to onboard new teams, resulting in the 'Magic Link' email-based signup flow that dramatically improved activation rates.",
    aiAngle:
      "For AI products, Thursday's prototype can use Wizard of Oz techniques where a human simulates the AI to test whether the interaction model works before investing in model development.",
  },
  {
    id: "value-proposition-canvas",
    name: "Value Proposition Canvas",
    category: "Strategy",
    description:
      "The Value Proposition Canvas maps your product's value creators and pain relievers against your customer's jobs, pains, and gains. It ensures product-market fit by explicitly connecting what you build to what customers need.",
    whenToUse:
      "Use the Value Proposition Canvas when designing a new product, entering a new segment, or when your current positioning is not resonating with customers.",
    whenNotToUse:
      "Avoid it when you need to prioritize between features you have already validated; switch to a prioritization framework instead.",
    steps: [
      "Map the Customer Profile: list their jobs (functional, social, emotional), pains, and gains.",
      "Map your Value Proposition: list your products/services, pain relievers, and gain creators.",
      "Check for fit: draw connections between your value map and the customer profile.",
      "Identify gaps where customer needs are unaddressed by your value proposition.",
      "Iterate on your value proposition to close the most critical gaps.",
      "Validate with real customers through interviews or experiments.",
    ],
    example:
      "Zoom's Value Proposition Canvas showed that their biggest pain reliever was 'it just works' reliability, which addressed the top customer pain of dropped calls in competing products.",
    aiAngle:
      "For AI products, explicitly map 'AI-powered gains' like personalization and automation against customer jobs to ensure you are not building AI for its own sake.",
  },
  {
    id: "ai-product-canvas",
    name: "AI Product Canvas",
    category: "AI/ML",
    description:
      "The AI Product Canvas is a structured template for designing AI-powered products that accounts for data requirements, model capabilities, failure modes, and ethical considerations. It extends traditional product canvases with AI-specific dimensions.",
    whenToUse:
      "Use the AI Product Canvas when scoping a new AI feature or product to ensure you have considered data, model, and ethical requirements from the start.",
    whenNotToUse:
      "Avoid it for products where AI is incidental rather than core to the value proposition; a standard product canvas would suffice.",
    steps: [
      "Define the user problem and how AI specifically adds value over a rule-based or manual approach.",
      "Map data requirements: what training data is needed, where does it come from, and what are the privacy implications?",
      "Specify model requirements: what type of model, what accuracy threshold is acceptable, and what are latency constraints?",
      "Design the human-AI interaction: how does the user interact with, correct, and override the AI?",
      "Plan for failure modes: what happens when the model is wrong, and how do you recover gracefully?",
      "Address ethical considerations: bias, fairness, transparency, and regulatory compliance.",
    ],
    example:
      "A healthcare startup used the AI Product Canvas to plan a diagnostic assistant, identifying that a 95% accuracy threshold was insufficient for their use case and that physician override was a mandatory design requirement.",
    aiAngle:
      "This framework is natively designed for AI products. It forces teams to consider data flywheels, model degradation, and the unique failure modes that AI introduces.",
  },
  {
    id: "mlops-lifecycle",
    name: "MLOps Lifecycle",
    category: "AI/ML",
    description:
      "The MLOps Lifecycle framework covers the end-to-end process of deploying and maintaining machine learning models in production, from data collection through monitoring and retraining. It bridges the gap between ML experimentation and production-grade systems.",
    whenToUse:
      "Use MLOps Lifecycle when transitioning an ML model from research/prototype to production, or when you need to establish operational practices for existing ML systems.",
    whenNotToUse:
      "Avoid this framework for rule-based systems or when you are still in the early experimentation phase and do not yet have a validated model to deploy.",
    steps: [
      "Data pipeline: establish reliable, versioned data collection and preprocessing pipelines.",
      "Model training: set up reproducible training with experiment tracking and hyperparameter management.",
      "Model validation: define evaluation metrics, test for bias, and validate against holdout data.",
      "Deployment: implement CI/CD for models with canary releases and rollback capabilities.",
      "Monitoring: track model performance, data drift, and prediction quality in real-time.",
      "Retraining: establish triggers and automated pipelines for model updates when performance degrades.",
    ],
    example:
      "Netflix's recommendation system uses a mature MLOps pipeline that automatically retrains models when engagement metrics drop, ensuring recommendations stay fresh as user tastes evolve.",
    aiAngle:
      "This is a core AI framework. PMs must understand MLOps to set realistic timelines, as deploying a model to production often takes 3-5x longer than building the initial prototype.",
  },
  {
    id: "lean-canvas",
    name: "Lean Canvas",
    category: "Strategy",
    description:
      "The Lean Canvas is a one-page business model template adapted from the Business Model Canvas for startups. It focuses on problems, solutions, key metrics, and unfair advantages to help founders quickly articulate and test their business hypotheses.",
    whenToUse:
      "Use Lean Canvas when starting a new product or venture and you need to quickly document and communicate your business model assumptions.",
    whenNotToUse:
      "Avoid Lean Canvas for mature products where you need detailed financial modeling or operational planning rather than hypothesis testing.",
    steps: [
      "Document the top 3 problems your target customers face.",
      "Define your customer segments and identify early adopters.",
      "Articulate your unique value proposition in one clear sentence.",
      "Outline your solution: the top 3 features that address the problems.",
      "Identify your unfair advantage: what cannot easily be copied or bought.",
      "Define key metrics and revenue streams to validate your model.",
    ],
    example:
      "Buffer's original Lean Canvas identified their unique value proposition as 'schedule social media posts at optimal times' and validated it with a landing page before writing any code.",
    aiAngle:
      "For AI products, your unfair advantage is often proprietary data or a data flywheel. Make sure the Lean Canvas explicitly captures your data moat and how it strengthens over time.",
  },
  {
    id: "porters-five-forces",
    name: "Porter's Five Forces",
    category: "Strategy",
    description:
      "Porter's Five Forces analyzes industry competitiveness through five dimensions: competitive rivalry, supplier power, buyer power, threat of substitution, and threat of new entry. It helps PMs understand the structural forces shaping their market.",
    whenToUse:
      "Use Porter's Five Forces when evaluating whether to enter a new market, assessing competitive threats, or building a long-term product strategy.",
    whenNotToUse:
      "Avoid Porter's Five Forces for day-to-day product decisions or when you need to move fast on tactical feature work rather than strategic analysis.",
    steps: [
      "Analyze competitive rivalry: how many competitors exist and how intense is the competition?",
      "Assess supplier power: how much leverage do your key suppliers and partners have?",
      "Evaluate buyer power: how easily can customers switch to alternatives?",
      "Identify threat of substitutes: what alternative solutions could replace your product entirely?",
      "Gauge threat of new entrants: how high are the barriers to entry in your market?",
      "Synthesize findings into strategic implications for your product roadmap.",
    ],
    example:
      "When Apple entered the streaming market with Apple TV+, a Five Forces analysis would have shown high competitive rivalry (Netflix, Disney+), low buyer switching costs, and Apple's unique supplier advantage through its device ecosystem.",
    aiAngle:
      "For AI products, open-source models lower barriers to entry while proprietary training data increases supplier power. Five Forces helps you assess whether your AI moat is defensible.",
  },
  {
    id: "circles",
    name: "CIRCLES",
    category: "Discovery",
    description:
      "CIRCLES is a structured method for answering product design questions: Comprehend the situation, Identify the customer, Report customer needs, Cut through prioritization, List solutions, Evaluate trade-offs, and Summarize. It provides a repeatable process for product thinking.",
    whenToUse:
      "Use CIRCLES when you need a structured approach to product design problems, especially useful in PM interviews and new feature ideation sessions.",
    whenNotToUse:
      "Avoid CIRCLES when you already have deep user research and need to move into execution; the framework is better suited for problem framing than detailed specification.",
    steps: [
      "Comprehend: clarify the situation, constraints, and goals.",
      "Identify: define the primary customer segment you are solving for.",
      "Report: articulate the customer's top needs through research or empathy.",
      "Cut: prioritize the needs and decide which ones to address first.",
      "List: brainstorm multiple solution ideas for the top needs.",
      "Evaluate: assess trade-offs between solutions and select the best approach.",
    ],
    example:
      "A PM used CIRCLES to redesign Instagram's Explore page by first comprehending that the goal was increasing content discovery, then identifying casual browsers as the key segment.",
    aiAngle:
      "For AI products, the Comprehend step should include understanding what the AI can and cannot do, so solutions are grounded in technical feasibility from the start.",
  },
  {
    id: "star",
    name: "STAR",
    category: "Execution",
    description:
      "STAR stands for Situation, Task, Action, Result. While commonly used for behavioral interviews, it is equally powerful as a framework for documenting product decisions and communicating impact to stakeholders.",
    whenToUse:
      "Use STAR when you need to communicate product outcomes to leadership, write case studies, or document lessons learned from shipped features.",
    whenNotToUse:
      "Avoid STAR for forward-looking planning; it is designed for retrospective narration rather than prospective decision-making.",
    steps: [
      "Situation: describe the context, including the business problem and relevant metrics.",
      "Task: define your specific responsibility and what you set out to accomplish.",
      "Action: detail the steps you took, decisions you made, and trade-offs you navigated.",
      "Result: quantify the outcome with data, including both primary and secondary effects.",
    ],
    example:
      "A PM documented how they reduced checkout abandonment (Situation: 68% drop-off), owned the checkout redesign (Task), ran A/B tests on a simplified flow (Action), and achieved a 23% improvement in completion rate (Result).",
    aiAngle:
      "For AI products, the Result step should include model performance metrics alongside business metrics to show how AI improvements translated into user and business value.",
  },
  {
    id: "okr-framework",
    name: "OKR Framework",
    category: "Execution",
    description:
      "OKRs (Objectives and Key Results) is a goal-setting framework where Objectives are qualitative, ambitious goals and Key Results are quantitative measures of progress. Popularized by Intel and Google, OKRs align teams around outcomes rather than outputs.",
    whenToUse:
      "Use OKRs when you need to align multiple teams around shared goals and want to create accountability for measurable outcomes over a quarter or half.",
    whenNotToUse:
      "Avoid OKRs when your team is in pure exploration mode where measurable targets could prematurely constrain creative problem-solving.",
    steps: [
      "Set 3-5 Objectives that are ambitious, qualitative, and time-bound.",
      "For each Objective, define 2-4 Key Results that are specific, measurable, and verifiable.",
      "Ensure Key Results measure outcomes (user behavior changes) not outputs (features shipped).",
      "Align OKRs across teams to ensure shared Key Results where collaboration is needed.",
      "Check in weekly on Key Result progress and adjust tactics as needed.",
      "Score OKRs at the end of the cycle: 0.7 is a good target for stretch goals.",
    ],
    example:
      "Google's YouTube team set an Objective of 'Make YouTube the #1 destination for live events' with Key Results including 'Reach 10M concurrent viewers for a single event' and 'Reduce live stream latency to under 2 seconds.'",
    aiAngle:
      "For AI products, Key Results should capture model quality (accuracy, latency) alongside user outcomes. An OKR like 'Improve recommendation relevance' might include KRs for both click-through rate and model precision.",
  },
  {
    id: "now-next-later",
    name: "Now-Next-Later",
    category: "Execution",
    description:
      "Now-Next-Later is a lean roadmapping approach that replaces rigid timelines with three time horizons: Now (current work), Next (upcoming priorities), and Later (future bets). It communicates strategic direction without false precision on dates.",
    whenToUse:
      "Use Now-Next-Later when stakeholders demand a roadmap but your environment is too uncertain for date-based commitments.",
    whenNotToUse:
      "Avoid Now-Next-Later when you have hard external deadlines (regulatory, contractual) that require specific date commitments.",
    steps: [
      "Define Now: what is the team actively building this sprint or cycle? These items should be well-specified.",
      "Define Next: what are the validated priorities for the next cycle? These should have clear problem statements but flexible solutions.",
      "Define Later: what are the strategic bets or explorations on the horizon? These are deliberately vague.",
      "Ensure each column aligns with your product strategy and North Star Metric.",
      "Review and update the roadmap at regular cadences, graduating items from Later to Next to Now.",
    ],
    example:
      "Basecamp uses a Now-Next-Later style roadmap internally, sharing what the team is actively building (Now) without committing to dates for future features, reducing stakeholder misalignment.",
    aiAngle:
      "For AI products, Later is where you place ambitious model capabilities that depend on data you have not yet collected, while Now focuses on shipping AI features with current model performance.",
  },
];
