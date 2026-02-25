export interface Challenge {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category:
    | "Product Sense"
    | "AI Product Management"
    | "Execution"
    | "Analytics"
    | "Strategy"
    | "Leadership";
  difficulty: "Medium" | "Hard";
}

export const challenges: Challenge[] = [
  // ============================================================
  // PRODUCT SENSE (7 questions)
  // ============================================================
  {
    id: "ps-001",
    question:
      "You're the PM for Instagram Stories. Engagement is up 20% quarter-over-quarter, but creator posting frequency has dropped 15% in the same period. What is the most likely explanation and the best next step?",
    options: [
      "The algorithm is surfacing older stories more — investigate content recirculation patterns and their impact on creator incentives.",
      "A smaller group of power creators is producing more content — segment creator cohorts by posting volume and analyze per-creator engagement trends.",
      "Users are rewatching stories more often — add a replay count metric and optimize for re-engagement.",
      "The drop in creators is seasonal — wait another quarter to confirm the trend before acting.",
    ],
    correctIndex: 1,
    explanation:
      "When aggregate engagement rises while creator participation falls, the most likely structural explanation is concentration: fewer creators are driving disproportionate engagement. The right PM move is to segment the data before jumping to solutions, because the health of a creator ecosystem depends on breadth of participation, not just total output. Waiting passively or assuming algorithmic causes without data would be negligent given the magnitude of the creator drop.",
    category: "Product Sense",
    difficulty: "Hard",
  },
  {
    id: "ps-002",
    question:
      "You're designing a new feature for a food delivery app that lets users set dietary preferences (e.g., vegan, gluten-free). User research shows 80% of users say they want this feature, but only 12% of users in a competitor's app actually use a similar feature. How should you interpret this gap?",
    options: [
      "The competitor's implementation is poor — build a better version and expect higher adoption.",
      "Users aspirationally overstate dietary discipline in surveys — design the feature to be low-friction and passively applied rather than requiring active configuration.",
      "The 12% who use it are likely high-LTV users — build it as a premium feature to capture willingness to pay.",
      "The gap proves users don't really want it — deprioritize and focus on delivery speed instead.",
    ],
    correctIndex: 1,
    explanation:
      "This is a classic stated-vs-revealed preference gap. Users genuinely believe they want dietary filtering, but the cognitive overhead of configuring and maintaining preferences creates abandonment. The insight for the PM is to design around the behavior, not the stated intent — for example, by inferring preferences from order history and applying them as soft defaults rather than requiring explicit setup. Dismissing the feature entirely ignores that the desire is real; the execution model just needs to match actual user behavior.",
    category: "Product Sense",
    difficulty: "Hard",
  },
  {
    id: "ps-003",
    question:
      "Your SaaS product has a free tier and a paid tier. You notice that users who invite teammates during their first session convert to paid at 3x the rate of users who don't. Your growth team wants to add a mandatory team-invite step to onboarding. What is the strongest objection to this approach?",
    options: [
      "It will annoy solo users who don't have teammates to invite.",
      "Correlation between inviting and converting likely reflects user intent, not causation — forcing invites won't replicate the conversion lift and may increase onboarding drop-off.",
      "The invite step will slow down time-to-value for all users.",
      "It could expose the product to spam complaints if users invite people who didn't opt in.",
    ],
    correctIndex: 1,
    explanation:
      "This is a causation-vs-correlation trap that PMs frequently encounter in growth metrics. Users who invite teammates in their first session are likely already highly motivated and see immediate value, which is why they both invite and convert. Making the invite mandatory forces the behavior without the underlying intent, meaning you won't get the same conversion lift but will add friction. Strong PMs recognize that instrumenting a correlated behavior doesn't manufacture the causal driver behind it.",
    category: "Product Sense",
    difficulty: "Hard",
  },
  {
    id: "ps-004",
    question:
      "You're the PM for a messaging app. Your team proposes adding read receipts as a default-on feature. Privacy advocates on your team object, while the growth team argues it increases reply rates by 40%. How should you frame this decision?",
    options: [
      "Default read receipts on since the data supports higher engagement, and let users opt out in settings.",
      "Default read receipts off to respect privacy, and let users opt in.",
      "Run a 50/50 A/B test for 3 months and let the engagement data decide.",
      "Ship read receipts as on-by-default but frame the decision around user expectations in the specific relationship context (e.g., on for group chats, off for DMs), and invest in clear controls.",
    ],
    correctIndex: 3,
    explanation:
      "The nuance here is that read receipts aren't uniformly good or bad — their social dynamics differ by context. In group chats, read receipts create healthy accountability; in DMs, they can create social pressure and anxiety. A sophisticated PM recognizes that the right default depends on the use case, not a blanket policy. This approach captures most of the engagement upside while respecting the legitimate privacy concern, and investing in clear controls gives users genuine agency.",
    category: "Product Sense",
    difficulty: "Medium",
  },
  {
    id: "ps-005",
    question:
      "You're a PM at Spotify. A significant number of users create playlists but never share them. The sharing team wants to add social prompts after playlist creation. What is the most important thing to validate before building this?",
    options: [
      "Whether users who share playlists have higher retention than those who don't.",
      "Whether the reason users don't share is friction (they want to but it's hard) or intent (they deliberately keep playlists private as a form of personal curation).",
      "Whether competitors like Apple Music have similar social sharing features.",
      "Whether adding share prompts would cannibalize the existing share button's discoverability.",
    ],
    correctIndex: 1,
    explanation:
      "The critical product sense question is understanding user intent before designing an intervention. If users keep playlists private deliberately — because playlists serve as personal identity artifacts or guilty-pleasure collections — then social prompts won't just fail, they'll feel invasive and erode trust. If the barrier is friction or awareness, prompts could help. The PM must distinguish between a behavior gap caused by poor UX and one caused by genuine user preference, because the solutions are fundamentally different.",
    category: "Product Sense",
    difficulty: "Medium",
  },
  {
    id: "ps-006",
    question:
      "You're building a consumer fintech app. Your NPS is 72 (excellent), but your 90-day retention is only 25%. What is the most likely explanation?",
    options: [
      "Users love the app when they use it, but the core use case is episodic rather than habitual — the product solves a real problem that doesn't recur frequently enough to drive retention.",
      "NPS is inflated because only satisfied users respond to the survey, creating survivorship bias.",
      "The onboarding is strong but the product lacks depth, causing users to churn after initial exploration.",
      "Retention is being measured incorrectly — fintech apps should use 180-day retention windows.",
    ],
    correctIndex: 0,
    explanation:
      "High NPS with low retention is a classic signal of a product that delivers real value for an infrequent need. Think of tax software: users love it when they need it but don't open it daily. The PM insight is that retention isn't always the right north star — for episodic products, the better metrics might be return rate when the need recurs, or expanding into adjacent use cases that increase frequency. Blaming survey bias or measurement windows avoids confronting the core product-market fit question.",
    category: "Product Sense",
    difficulty: "Hard",
  },
  {
    id: "ps-007",
    question:
      "You're the PM for Google Maps. You're considering adding a feature that shows real-time crowd density at restaurants and stores. Which second-order effect should concern you most?",
    options: [
      "Users may avoid busy places, reducing foot traffic for popular small businesses and concentrating visits at off-peak hours in ways that hurt their operations.",
      "The data might be inaccurate during events or holidays, leading to user trust issues.",
      "Competitors could copy the feature quickly, eliminating any competitive advantage.",
      "Users might feel surveilled knowing Google tracks their location density patterns.",
    ],
    correctIndex: 0,
    explanation:
      "The deepest product sense concern here is the platform effect on the ecosystem. If crowd density data systematically diverts traffic away from popular small businesses, Google Maps becomes an active force in reshaping local economies — businesses that thrive on walk-in volume could see revenue drops because the platform signals 'too busy.' This is a second-order consequence that doesn't show up in user satisfaction metrics but fundamentally changes the relationship between the platform and the merchants who depend on it. Privacy concerns, while valid, are already inherent in using Google Maps; the ecosystem impact is the novel and harder-to-reverse risk.",
    category: "Product Sense",
    difficulty: "Hard",
  },

  // ============================================================
  // AI PRODUCT MANAGEMENT (8 questions)
  // ============================================================
  {
    id: "ai-001",
    question:
      "You're the PM for an LLM-powered customer support chatbot. The model achieves 92% accuracy on your test set, but after launch, customer satisfaction drops 15%. What is the most likely root cause?",
    options: [
      "The test set doesn't represent the distribution of real customer queries — production traffic includes edge cases, emotional contexts, and multi-turn conversations the test set missed.",
      "The model is hallucinating answers that sound confident but are wrong, and users can't distinguish AI errors from real answers.",
      "Customers inherently distrust AI and prefer human agents regardless of accuracy.",
      "The 8% error rate is compounding because each wrong answer leads to follow-up queries that also fail.",
    ],
    correctIndex: 0,
    explanation:
      "The most common failure mode for AI products in production is distribution mismatch between evaluation data and real-world usage. Test sets are typically curated, balanced, and stripped of the messiness of production — where users ask ambiguous questions, express frustration, switch topics mid-conversation, and reference previous interactions. A PM must ensure evaluation frameworks reflect actual usage patterns, not idealized benchmarks. While hallucination is a real concern, the systemic explanation for a broad CSAT drop is almost always the gap between test conditions and production reality.",
    category: "AI Product Management",
    difficulty: "Hard",
  },
  {
    id: "ai-002",
    question:
      "Your company is building an AI-powered hiring screening tool. The model performs equally well across demographic groups on your test data. A responsible AI review flags a concern. What is the most subtle and dangerous risk they likely identified?",
    options: [
      "The training data may encode historical hiring biases — equal performance on biased ground truth still perpetuates discrimination.",
      "The model might use proxy variables (zip code, university name) that correlate with protected characteristics.",
      "Candidates may game the system by optimizing resumes for AI parsing rather than actual qualifications.",
      "Regulatory requirements like the EU AI Act may classify this as high-risk AI requiring additional compliance.",
    ],
    correctIndex: 0,
    explanation:
      "This is one of the most critical concepts in responsible AI: a model can have perfect demographic parity on accuracy metrics while still perpetuating systemic bias if the ground truth labels themselves reflect historical discrimination. If the model learns to predict 'who got hired in the past,' and past hiring was biased, then the model faithfully reproduces that bias with high accuracy across all groups. The PM must ensure the team interrogates not just model fairness metrics but the legitimacy and equity of the labels the model is trained to predict.",
    category: "AI Product Management",
    difficulty: "Hard",
  },
  {
    id: "ai-003",
    question:
      "You're deciding between using a fine-tuned smaller model versus prompting a large foundation model (like GPT-4) for a document classification task in your enterprise product. Which factor most strongly favors the fine-tuned smaller model?",
    options: [
      "The task requires very high accuracy on a narrow, domain-specific taxonomy that doesn't change frequently, and you have substantial labeled data.",
      "Your team lacks ML engineering expertise and needs to ship quickly.",
      "The classification categories evolve quarterly as the business adds new document types.",
      "Cost is the only concern, and you want the cheapest possible solution.",
    ],
    correctIndex: 0,
    explanation:
      "Fine-tuned smaller models excel when the task is narrow, stable, and well-defined with abundant labeled data — they achieve higher accuracy on specific domains than general-purpose models prompted with instructions, at lower latency and cost. The key qualifier is stability: if categories change frequently, the retraining overhead negates the advantage. A PM choosing between these architectures must weigh task specificity, data availability, rate of change, and operational complexity. Lack of ML expertise actually favors the prompted foundation model, and cost alone is too simplistic a framing.",
    category: "AI Product Management",
    difficulty: "Medium",
  },
  {
    id: "ai-004",
    question:
      "You're the PM for an AI writing assistant. Users report that the AI's suggestions are 'too generic.' Your ML team proposes fine-tuning on each user's writing history to personalize outputs. What is the most important concern to raise?",
    options: [
      "Fine-tuning per user is computationally expensive and won't scale to millions of users.",
      "Personalization creates a feedback loop where the model reinforces the user's existing style, potentially narrowing their creative range and making the tool less useful for growth.",
      "Users may not consent to having their writing used for model training.",
      "The personalized models could memorize and regurgitate sensitive content from the user's documents.",
    ],
    correctIndex: 1,
    explanation:
      "The deepest product concern is the feedback loop problem inherent in personalization. If the AI learns to mimic a user's existing patterns and the user accepts those suggestions, the training data becomes increasingly homogeneous, creating a narrowing spiral. For a writing assistant, this is particularly dangerous because the product's value proposition should include helping users improve and expand their capabilities, not just automating their current habits. A PM must think about whether personalization serves the user's long-term goals or just their short-term comfort.",
    category: "AI Product Management",
    difficulty: "Hard",
  },
  {
    id: "ai-005",
    question:
      "Your team is building a retrieval-augmented generation (RAG) system for internal knowledge management. The system retrieves relevant documents and uses an LLM to synthesize answers. Users report that answers are sometimes wrong even when the correct document was retrieved. What is the most likely failure point?",
    options: [
      "The LLM's context window is too small to process the retrieved documents fully.",
      "The retrieval step returns too many irrelevant documents that dilute the signal, causing the LLM to synthesize from noise alongside the correct source.",
      "The LLM is ignoring the retrieved context and relying on its parametric knowledge, which may be outdated or incorrect for domain-specific questions.",
      "The documents themselves contain contradictory information and the LLM picks the wrong source.",
    ],
    correctIndex: 2,
    explanation:
      "A well-documented failure mode in RAG systems is the LLM defaulting to its pre-trained knowledge instead of faithfully grounding its response in retrieved context, especially when its parametric knowledge conflicts with the retrieved documents. This is sometimes called 'context ignorance' or 'knowledge conflict.' The PM needs to ensure the system design includes mechanisms to force grounding — such as explicit citation requirements, constrained decoding, or prompt engineering that prioritizes retrieved content. Understanding this failure mode is essential for setting realistic quality expectations and designing appropriate guardrails.",
    category: "AI Product Management",
    difficulty: "Hard",
  },
  {
    id: "ai-006",
    question:
      "You're launching an AI-powered medical symptom checker. Which evaluation metric should be your primary gating criterion for launch, and why?",
    options: [
      "Overall accuracy (percentage of correct diagnoses) because it captures the broadest measure of quality.",
      "Recall on serious conditions (sensitivity) because missing a dangerous condition has far worse consequences than a false alarm, and the cost asymmetry must drive metric selection.",
      "Precision on common conditions because most users will have benign symptoms and you want to avoid unnecessary anxiety.",
      "User satisfaction scores from beta testers because perceived quality drives adoption.",
    ],
    correctIndex: 1,
    explanation:
      "In medical AI products, the cost of a false negative (missing a serious condition) is categorically different from the cost of a false positive (flagging something benign as potentially concerning). A PM must recognize that metric selection should reflect the asymmetry of real-world consequences, not just statistical elegance. Optimizing for overall accuracy would let the model perform well on common, benign cases while potentially missing rare, dangerous ones. This principle — choosing metrics that reflect consequence asymmetry — applies broadly to high-stakes AI products.",
    category: "AI Product Management",
    difficulty: "Medium",
  },
  {
    id: "ai-007",
    question:
      "Your company wants to add an 'AI-powered insights' feature to your analytics dashboard that automatically surfaces interesting patterns in customer data. The prototype impresses stakeholders in demos. Before committing to production, what is the most critical question to answer?",
    options: [
      "Can the system explain why it surfaced each insight in terms the user can verify against their own domain knowledge?",
      "How fast can the system generate insights for large datasets?",
      "Will the insights feature cannibalize usage of the existing manual exploration tools?",
      "Can we patent the insight-generation algorithm for competitive protection?",
    ],
    correctIndex: 0,
    explanation:
      "The fundamental risk of automated insight generation is that users cannot distinguish genuine patterns from statistical artifacts or spurious correlations without the ability to interrogate and verify the reasoning. If the system surfaces an 'insight' like 'customers in the Northeast are 30% more likely to churn' without explaining the methodology, sample size, and confounders, users may make consequential business decisions based on noise. Explainability isn't a nice-to-have — it's the mechanism by which domain experts apply their judgment to AI outputs, and without it, the feature is more dangerous than useful.",
    category: "AI Product Management",
    difficulty: "Medium",
  },
  {
    id: "ai-008",
    question:
      "You're the PM for a generative AI product that creates marketing copy. Your legal team requires a human review step before any AI-generated content goes live. The review step is creating a bottleneck that makes the product slower than manual copywriting. What is the best approach?",
    options: [
      "Remove the human review for low-risk content categories (e.g., internal emails) while maintaining it for external-facing and regulated content, using a risk-tiered approval framework.",
      "Invest heavily in model improvements until accuracy is high enough to eliminate human review entirely.",
      "Hire more reviewers to increase throughput and maintain the current review policy for all content.",
      "Add a disclaimer that all content is AI-generated and shift liability to the user, eliminating the need for internal review.",
    ],
    correctIndex: 0,
    explanation:
      "The risk-tiered approach reflects mature AI product thinking: not all AI outputs carry the same risk, so applying uniform controls creates unnecessary friction for low-risk use cases while appropriately protecting high-risk ones. This is analogous to how financial services use different approval thresholds for different transaction sizes. The PM's job is to create a framework where the level of human oversight matches the potential consequence of error, rather than treating all AI outputs as equally risky or pushing to eliminate safeguards entirely.",
    category: "AI Product Management",
    difficulty: "Medium",
  },

  // ============================================================
  // EXECUTION (5 questions)
  // ============================================================
  {
    id: "ex-001",
    question:
      "You're midway through a quarter and your team's primary initiative is behind schedule. Your engineering lead says they can hit the deadline if they skip writing integration tests. Your QA lead objects. The feature is a new payments flow. What should you do?",
    options: [
      "Accept the engineering lead's proposal — shipping on time is critical for the business commitment, and you can backfill tests next quarter.",
      "Cut scope on the feature to something that can be fully built and tested within the remaining time, and negotiate a revised definition of 'done' with stakeholders.",
      "Extend the deadline by two weeks to accommodate both full feature scope and testing.",
      "Ship without integration tests but add extensive monitoring and a feature flag to enable quick rollback.",
    ],
    correctIndex: 1,
    explanation:
      "For a payments flow — where bugs have direct financial and trust consequences — skipping integration tests is not a legitimate tradeoff. Extending the deadline punts the hard prioritization conversation. The disciplined PM move is to reduce scope to what can be properly built and tested, then communicate clearly to stakeholders about what's shipping and what's deferred. Scope cutting is the highest-leverage execution tool a PM has, because it preserves quality and trust while still delivering value on time. The key skill is negotiating what 'done' means, not whether to cut corners on quality.",
    category: "Execution",
    difficulty: "Hard",
  },
  {
    id: "ex-002",
    question:
      "You're prioritizing your Q3 roadmap. You have four candidate projects with the following profiles: (A) High impact, high effort, strong executive sponsor; (B) Medium impact, low effort, no sponsor; (C) High impact, medium effort, depends on another team's API that's not ready; (D) Medium impact, medium effort, directly addresses top customer complaint. Which should you prioritize first?",
    options: [
      "Project A — high impact with executive sponsorship ensures organizational support and visibility.",
      "Project B — the low effort makes it a quick win that builds momentum.",
      "Project D — directly addressing the top customer complaint delivers certain, near-term value without dependency risk.",
      "Project C — high impact justifies the effort, and you should start now to align with the other team's timeline.",
    ],
    correctIndex: 2,
    explanation:
      "Project D is the strongest first priority because it combines meaningful impact with execution certainty. It has no external dependencies, directly addresses a validated customer need (the top complaint), and delivers medium impact for medium effort. Project A's executive sponsorship is appealing but doesn't reduce execution risk. Project C's dependency on another team's unfinished API introduces schedule risk that could block your team. Strong PMs optimize for deliverable impact, not theoretical impact, and dependency risk is the most common roadmap killer.",
    category: "Execution",
    difficulty: "Medium",
  },
  {
    id: "ex-003",
    question:
      "Your team uses two-week sprints. Over the last four sprints, velocity has been consistent, but the percentage of sprint goals fully achieved has dropped from 90% to 60%. Engineers report no morale or capacity issues. What is the most likely cause?",
    options: [
      "The team is taking on increasingly complex work and story points aren't accurately reflecting the true effort.",
      "Sprint goals are becoming more ambitious or less well-defined, creating a gap between consistent throughput and increasingly aspirational targets.",
      "Technical debt is silently consuming capacity that doesn't show up in velocity calculations.",
      "The team is sandbagging velocity estimates to create a comfortable buffer.",
    ],
    correctIndex: 1,
    explanation:
      "When velocity (total output) is stable but goal completion (targeted outcome) drops, the disconnect is almost always in goal-setting, not delivery. The team is producing the same amount of work but the goals are either growing in scope or becoming less precisely defined, meaning 'done' keeps moving. This is a PM-side problem, not an engineering-side problem. The fix is to tighten sprint goal definitions and align them with the team's demonstrated capacity rather than aspirational targets. Blaming estimation, tech debt, or sandbagging ignores the signal that the team's output hasn't actually changed.",
    category: "Execution",
    difficulty: "Medium",
  },
  {
    id: "ex-004",
    question:
      "You're managing a platform team that builds internal tools used by five product teams. Three of those teams have conflicting priority requests for Q4. How should you determine your team's roadmap?",
    options: [
      "Let each product team vote on priorities and allocate platform capacity proportionally to team size.",
      "Escalate to a VP or CPO to make the call on which product team's needs take precedence.",
      "Evaluate requests based on total downstream user impact, unblocking potential, and strategic alignment — then publish a transparent prioritization rationale that all teams can see.",
      "Rotate priority across the three teams so each gets top billing for one month of the quarter.",
    ],
    correctIndex: 2,
    explanation:
      "Platform teams must prioritize based on the impact they enable, not the political weight of requesting teams. The right approach evaluates each request by how many end users it affects, how many teams it unblocks, and whether it aligns with company strategy. Critically, publishing a transparent rationale builds trust and gives teams the ability to challenge the reasoning rather than the decision. Voting creates politics, escalation creates dependency on executives, and rotation ignores that not all requests have equal urgency or impact.",
    category: "Execution",
    difficulty: "Hard",
  },
  {
    id: "ex-005",
    question:
      "You inherit a product with significant technical debt. The engineering team estimates that addressing the debt would take one full quarter with no new features. Your CEO has publicly committed to three major features this year. What is the best approach?",
    options: [
      "Dedicate the full quarter to debt reduction — the long-term velocity gains justify the short-term feature pause.",
      "Ignore the tech debt and focus on the committed features — the CEO's credibility is on the line.",
      "Allocate 20-30% of each sprint to debt reduction while delivering features at a reduced pace, and renegotiate feature timelines with the CEO based on realistic projections.",
      "Hire additional contractors to handle the debt work while the core team focuses on features.",
    ],
    correctIndex: 2,
    explanation:
      "The sustainable approach blends debt reduction into ongoing work rather than treating it as an all-or-nothing investment. A full-quarter pause is politically unrealistic and unnecessary — most technical debt can be addressed incrementally alongside feature work. The PM's key responsibility is to translate the debt situation into revised timelines and present the CEO with honest options rather than silently sacrificing quality or making commitments the team can't keep. Contractors unfamiliar with the codebase are unlikely to effectively address systemic debt.",
    category: "Execution",
    difficulty: "Medium",
  },

  // ============================================================
  // ANALYTICS (5 questions)
  // ============================================================
  {
    id: "an-001",
    question:
      "You run an A/B test for a new checkout flow. The test group shows a 5% increase in conversion rate (p-value = 0.03) but a 2% decrease in average order value (p-value = 0.12). What should you do?",
    options: [
      "Ship the new checkout flow — the conversion increase is statistically significant and the AOV decrease is not.",
      "Don't ship — the AOV decrease suggests the new flow attracts lower-quality conversions.",
      "Calculate the net revenue impact by combining both metrics, and make the decision based on total revenue per visitor rather than either metric in isolation.",
      "Extend the test duration to achieve statistical significance on the AOV metric before deciding.",
    ],
    correctIndex: 2,
    explanation:
      "Evaluating A/B tests on individual metrics in isolation is a common PM mistake. A 5% conversion lift with a 2% AOV drop could be net positive, net negative, or neutral depending on the magnitudes. Revenue per visitor (conversion rate multiplied by AOV) is the composite metric that captures the actual business impact. Making the decision on statistical significance of one metric while ignoring a directionally concerning movement in another leads to locally optimized but globally suboptimal decisions. The PM should compute the holistic impact on the metric that matters most to the business.",
    category: "Analytics",
    difficulty: "Hard",
  },
  {
    id: "an-002",
    question:
      "Your product team is debating the north star metric for a B2B collaboration tool. The candidates are: (A) Daily Active Users, (B) Weekly Active Teams, (C) Documents created per week, (D) Time spent in app per user. Which is the strongest north star metric?",
    options: [
      "Daily Active Users — it's the most standard engagement metric and easy to benchmark.",
      "Weekly Active Teams — it captures the collaborative unit that drives value in B2B, aligns with the billing entity, and reflects the habit loop at the right cadence.",
      "Documents created per week — it measures output and value creation directly.",
      "Time spent in app per user — more time means more engagement and stickiness.",
    ],
    correctIndex: 1,
    explanation:
      "For a B2B collaboration tool, the unit of value is the team, not the individual. Weekly Active Teams captures whether the product is delivering on its core promise — enabling team collaboration — at the cadence that matches how teams actually work (weekly, not daily). DAU ignores the collaborative dimension, documents created is an output metric that could be gamed, and time spent is a vanity metric for productivity tools where efficiency (less time for same output) is actually desirable. A strong north star metric aligns with the value proposition, the customer unit, and the natural usage cadence.",
    category: "Analytics",
    difficulty: "Medium",
  },
  {
    id: "an-003",
    question:
      "You launch a referral program and notice that referred users have 2x the retention of organic users after 30 days. Your growth team claims the referral program is the cause. What is the most important methodological concern?",
    options: [
      "Referred users are pre-selected by existing users who understand the product, creating a selection bias where the referral source — not the program itself — explains the retention difference.",
      "The sample size of referred users may be too small for statistical significance.",
      "Referred users might have received a sign-up bonus that artificially inflated early retention.",
      "The 30-day window is too short to draw conclusions about long-term retention.",
    ],
    correctIndex: 0,
    explanation:
      "This is a selection bias problem. The people who get referred are not a random sample of potential users — they're specifically chosen by existing users who believe they'd find the product valuable. This pre-selection means referred users are inherently more likely to be a good fit for the product, independent of anything the referral program itself does. Attributing the retention lift to the program rather than the selection mechanism would lead the PM to overinvest in referral incentives when the real driver is the quality of the match between referrer judgment and product fit.",
    category: "Analytics",
    difficulty: "Hard",
  },
  {
    id: "an-004",
    question:
      "Your e-commerce platform's overall conversion rate has been flat for three months despite significant product improvements. You dig into the data and find that conversion rates have actually improved in every single product category. How is this possible?",
    options: [
      "There's a data pipeline error causing incorrect aggregation.",
      "This is Simpson's Paradox — the traffic mix has shifted toward lower-converting categories, so improving conversion within each category is offset by proportionally more traffic in categories with lower base rates.",
      "Seasonal effects are masking the improvements at the aggregate level.",
      "The conversion improvements are not statistically significant when viewed individually.",
    ],
    correctIndex: 1,
    explanation:
      "Simpson's Paradox occurs when a trend present in multiple subgroups reverses or disappears when the groups are combined, due to a lurking variable — in this case, traffic distribution. If more users are now browsing categories that inherently convert at lower rates (e.g., expensive electronics vs. everyday consumables), the aggregate rate can stay flat even as every individual category improves. This is one of the most important analytical concepts for PMs to understand because it means that aggregate metrics can fundamentally mislead you about what's actually happening in your product.",
    category: "Analytics",
    difficulty: "Hard",
  },
  {
    id: "an-005",
    question:
      "Your mobile app team wants to measure the impact of a performance improvement that reduced app load time from 3 seconds to 1.5 seconds. They propose using session length as the success metric. Why is this problematic?",
    options: [
      "Session length is too noisy and varies too much between users to detect the effect.",
      "Faster load times might actually decrease session length (users complete tasks faster), so an improvement in product quality could appear as a negative result on this metric.",
      "The performance improvement affects only the first load, which is a tiny fraction of total session time.",
      "Users don't consciously notice load time improvements, so it won't affect their behavior.",
    ],
    correctIndex: 1,
    explanation:
      "This illustrates a critical analytics concept: choosing a metric that moves in the wrong direction when the product improves. If the app loads faster, users accomplish their goals more efficiently, which can reduce session length. A PM who interprets shorter sessions as a negative outcome would be punishing the team for building a better product. The right metrics for a performance improvement are task completion rate, sessions per user (frequency), or long-term retention — metrics where 'better product' and 'metric goes up' are aligned.",
    category: "Analytics",
    difficulty: "Medium",
  },

  // ============================================================
  // STRATEGY (5 questions)
  // ============================================================
  {
    id: "st-001",
    question:
      "You're the PM for a successful project management SaaS tool used primarily by small businesses (10-50 employees). Your CEO wants to move upmarket to enterprise (1,000+ employees). What is the biggest strategic risk of this move?",
    options: [
      "Enterprise sales cycles are long, which will strain cash flow.",
      "The product architecture, go-to-market motion, and organizational culture required for enterprise are fundamentally different from SMB, and pursuing both simultaneously risks being mediocre at each — the 'stuck in the middle' problem.",
      "Enterprise customers will demand on-premise deployment, which your cloud-native architecture can't support.",
      "Competitors in the enterprise space are too entrenched to displace.",
    ],
    correctIndex: 1,
    explanation:
      "The strategic risk isn't any single tactical challenge (sales cycles, deployment, or competition) — it's the systemic tension of serving two fundamentally different customer segments simultaneously. Enterprise requires different product capabilities (SSO, audit logs, permissions), different GTM (sales-led vs. product-led), different support (dedicated CSMs vs. self-serve), and different organizational priorities. Companies that try to serve both segments without clearly sequencing the transition often end up under-investing in both. This is Porter's 'stuck in the middle' applied to the SaaS context, and it's one of the most common strategic failures in B2B software.",
    category: "Strategy",
    difficulty: "Hard",
  },
  {
    id: "st-002",
    question:
      "A competitor launches a free version of a product similar to your paid product. Your product has 40% market share and strong brand loyalty. Customer churn increases from 3% to 5% monthly. What is the most strategically sound response?",
    options: [
      "Launch your own free tier immediately to match the competitor and stop the bleeding.",
      "Aggressively differentiate on the dimensions the free product can't match — such as integrations, support, security, and workflow depth — while monitoring whether the competitor's free users convert to paid.",
      "Lower your price by 30% to narrow the gap while maintaining your paid model.",
      "Acquire the competitor before they gain more traction.",
    ],
    correctIndex: 1,
    explanation:
      "Reflexively launching a free tier devalues your existing revenue base and plays the competitor's game. Price cuts erode margins without addressing the structural challenge. The strategically sound response is to identify what your most valuable customers pay for that a free product structurally cannot provide — deep integrations, enterprise-grade security, reliable support, and complex workflow automation — and invest aggressively in those differentiators. Meanwhile, monitoring whether the competitor can convert free users to sustainable revenue will reveal whether their model is viable. Competing on price against free is a losing strategy; competing on value is defensible.",
    category: "Strategy",
    difficulty: "Hard",
  },
  {
    id: "st-003",
    question:
      "You're evaluating whether to build a new feature in-house or integrate a third-party API. The third-party solution covers 80% of your requirements and would take 2 weeks to integrate, while building in-house would take 3 months but cover 100% of requirements. What additional factor should most influence your decision?",
    options: [
      "Whether the feature is a core differentiator or a commodity capability — core differentiators should almost always be built in-house regardless of timeline, while commodities should be bought.",
      "The total cost comparison over a 3-year period.",
      "Whether your engineering team has the expertise to build it in-house.",
      "The third party's funding status and risk of going out of business.",
    ],
    correctIndex: 0,
    explanation:
      "The build-vs-buy decision should be driven primarily by strategic differentiation, not timeline or cost. If the feature is a core part of your value proposition — the reason customers choose you over competitors — outsourcing it to a third party means your differentiation depends on a vendor's roadmap and is available to your competitors. If it's a commodity (authentication, payments, email sending), building it in-house is wasted engineering effort. This 'core vs. context' framework is the most durable lens for build-vs-buy decisions because it aligns engineering investment with competitive advantage.",
    category: "Strategy",
    difficulty: "Medium",
  },
  {
    id: "st-004",
    question:
      "Your product has strong network effects — each new user makes the product more valuable for existing users. A well-funded competitor enters the market with a technically superior product but zero users. How worried should you be?",
    options: [
      "Very worried — technical superiority always wins eventually, and they'll attract your users.",
      "Not worried at all — network effects are an insurmountable moat once established.",
      "Moderately worried — network effects create switching costs but are vulnerable if the competitor targets a niche segment where they can build a local network effect before expanding into your core market.",
      "Only worried if they offer a lower price, since network effects protect against everything except price competition.",
    ],
    correctIndex: 2,
    explanation:
      "Network effects are powerful but not impenetrable. The classic disruption pattern is that a competitor targets an underserved niche where they can build a dense, local network effect — think how Facebook started at Harvard before expanding to all colleges, then everyone. If the competitor captures a segment where your network effects are weakest (a vertical, a geography, a use case), they can build momentum in that pocket before expanding. The PM's strategic response should be to identify and strengthen the weakest segments of their network, not assume the moat is permanent.",
    category: "Strategy",
    difficulty: "Hard",
  },
  {
    id: "st-005",
    question:
      "You're leading product strategy for a marketplace platform (connecting buyers and sellers). Both sides of the marketplace are growing, but you notice that the top 5% of sellers generate 60% of transactions. What is the most important strategic implication?",
    options: [
      "You should invest in tools and support for the top 5% to keep them happy and prevent churn.",
      "The concentration creates platform risk — if a few top sellers leave or build direct relationships with buyers, the marketplace collapses, so you must reduce concentration by investing in the long tail of sellers.",
      "This is a natural power-law distribution and doesn't require any strategic response.",
      "You should increase the take rate on top sellers since they receive the most value from the platform.",
    ],
    correctIndex: 1,
    explanation:
      "Seller concentration is one of the most dangerous structural risks for a marketplace. When a small number of sellers drive the majority of value, each of those sellers has enormous leverage — they can demand lower fees, threaten to leave, or disintermediate by building direct buyer relationships. The strategic imperative is to invest in growing the long tail: better onboarding for new sellers, tools that help mid-tier sellers compete, and discovery mechanisms that surface diverse inventory. Catering exclusively to top sellers or raising their fees accelerates the concentration risk rather than mitigating it.",
    category: "Strategy",
    difficulty: "Medium",
  },

  // ============================================================
  // LEADERSHIP (5 questions)
  // ============================================================
  {
    id: "ld-001",
    question:
      "You're a PM leading a cross-functional initiative involving engineering, design, data science, and marketing. The project is on track, but the data science team consistently delivers their components late, causing cascading delays. Their manager says they're overcommitted across too many projects. What is the most effective approach?",
    options: [
      "Escalate to the data science manager's boss to get your project prioritized.",
      "Work with the data science manager to identify the minimum viable data science contribution that unblocks your team, and restructure the project plan so your critical path doesn't depend on their most time-consuming deliverables.",
      "Add the delays to your risk register and adjust your timeline to account for the data science team's realistic delivery pace.",
      "Ask your engineering team to take on some of the data science work to reduce the dependency.",
    ],
    correctIndex: 1,
    explanation:
      "Effective cross-functional leadership means solving dependency problems collaboratively, not through escalation or passive accommodation. By working with the data science manager to scope a minimum viable contribution, you respect their constraints while protecting your project's critical path. This approach reduces the burden on the overcommitted team while giving you a path forward. Escalation damages relationships and rarely speeds things up, simply absorbing delays is passive, and asking engineers to do data science work usually produces poor quality results. The PM's superpower is creative problem-solving that turns zero-sum conflicts into win-win restructurings.",
    category: "Leadership",
    difficulty: "Medium",
  },
  {
    id: "ld-002",
    question:
      "You strongly disagree with a technical architecture decision your engineering lead has made. You believe it will create scalability problems in 12-18 months. The engineering lead has more technical expertise than you and is confident in the decision. How should you handle this?",
    options: [
      "Defer to the engineering lead's expertise — architecture decisions should be owned by engineering.",
      "Overrule the decision — as the PM, you're responsible for the product's long-term success.",
      "Clearly articulate the product scenarios and growth projections that inform your scalability concern, ask the engineering lead to evaluate the architecture against those specific scenarios, and agree on a joint decision with documented trade-offs.",
      "Propose a compromise architecture that splits the difference between your approaches.",
    ],
    correctIndex: 2,
    explanation:
      "The PM's role isn't to make technical architecture decisions or to blindly defer to engineering — it's to ensure technical decisions are informed by product context. By framing your concern in terms of specific product scenarios and growth projections (your domain expertise), you give the engineering lead the information they need to pressure-test their decision using their domain expertise. This approach respects the engineering lead's authority while ensuring the decision accounts for product realities. Documenting the trade-offs ensures accountability and creates a shared reference point if the scalability concern materializes.",
    category: "Leadership",
    difficulty: "Medium",
  },
  {
    id: "ld-003",
    question:
      "You're presenting a product strategy to your company's executive team. The CFO challenges your revenue projections, saying they're too optimistic. The CEO, who sponsored the initiative, is in the room. What is the best way to respond?",
    options: [
      "Defend your projections with the data and assumptions behind them — backing down undermines your credibility.",
      "Agree with the CFO to avoid conflict and offer to revise the numbers downward.",
      "Acknowledge the CFO's concern, transparently walk through your assumptions and the sensitivity analysis showing outcomes under conservative, moderate, and aggressive scenarios, and commit to stage-gated investment tied to hitting milestones.",
      "Defer to the CEO's support and suggest taking the CFO's feedback offline.",
    ],
    correctIndex: 2,
    explanation:
      "The best response demonstrates intellectual honesty and strategic maturity. Acknowledging the concern shows respect for the CFO's fiduciary perspective. Walking through assumptions transparently (rather than defensively) builds credibility by showing your projections are reasoned, not aspirational. Presenting sensitivity scenarios demonstrates that you've already thought about downside cases. Proposing stage-gated investment directly addresses the CFO's risk concern by limiting downside exposure. This approach satisfies both the CFO's need for fiscal prudence and the CEO's desire to pursue the initiative — without making either feel undermined.",
    category: "Leadership",
    difficulty: "Hard",
  },
  {
    id: "ld-004",
    question:
      "Your team just shipped a feature that caused a significant production incident affecting 10% of users for 4 hours. The root cause was an edge case your team didn't test for. Your VP asks you to present a postmortem to the broader product organization. What should you emphasize?",
    options: [
      "The technical root cause and the specific code fix that resolved the issue.",
      "The process gaps that allowed the edge case to reach production — what was missing from the testing framework, release process, or monitoring — and the systemic changes you're implementing to prevent similar failures, without assigning individual blame.",
      "The quick response time and how the team rallied to fix the issue within 4 hours.",
      "The feature's strong performance metrics outside of the incident to provide context on its overall success.",
    ],
    correctIndex: 1,
    explanation:
      "An effective postmortem for a leadership audience focuses on systemic learning, not technical details or hero narratives. The broader product organization doesn't need to know the specific code fix — they need to understand what process failure allowed this to happen and what systemic changes will prevent recurrence across all teams. Emphasizing the fix or the response time subtly deflects from accountability. Highlighting the feature's success appears defensive. The most valuable thing a PM can model in a postmortem is blameless accountability: owning the failure transparently and demonstrating that the organization learns from it.",
    category: "Leadership",
    difficulty: "Medium",
  },
  {
    id: "ld-005",
    question:
      "You're a senior PM mentoring a junior PM who is struggling with stakeholder alignment. They complain that stakeholders keep changing requirements mid-sprint and that engineering is frustrated. What is the most impactful coaching you can give?",
    options: [
      "Teach them to push back firmly on scope changes and protect the engineering team from disruption.",
      "Advise them to over-communicate the sprint plan so stakeholders feel informed and are less likely to inject changes.",
      "Help them recognize that requirement volatility is often a symptom of stakeholders not being involved early enough in the decision-making process — the fix is to shift alignment upstream by including stakeholders in discovery and prioritization, not just informing them of decisions already made.",
      "Recommend they create a formal change request process so that any mid-sprint changes go through an approval workflow.",
    ],
    correctIndex: 2,
    explanation:
      "The most impactful coaching addresses the root cause rather than the symptom. Stakeholders who inject changes mid-sprint are usually doing so because they didn't feel heard during planning, didn't understand the trade-offs, or weren't consulted on the priorities. Pushing back creates adversarial dynamics, over-communicating is still one-directional, and formal change processes add bureaucracy without solving the underlying trust gap. Teaching the junior PM to involve stakeholders earlier in discovery — so they're co-creators of the plan rather than recipients of it — transforms the dynamic from 'PM defends the sprint' to 'stakeholders invested in the sprint's success.'",
    category: "Leadership",
    difficulty: "Hard",
  },
];
