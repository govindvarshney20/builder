export interface PMTemplate {
  id: string;
  name: string;
  description: string;
  category: "Documentation" | "Strategy" | "AI/ML" | "Analytics" | "Planning";
  icon: string;
  sections: { title: string; placeholder: string }[];
  aiPrompt: string;
}

export const pmTemplates: PMTemplate[] = [
  {
    id: "prd",
    name: "Product Requirements Document",
    description:
      "A comprehensive PRD covering problem statement, user stories, requirements, success metrics, and timeline.",
    category: "Documentation",
    icon: "\uD83D\uDCCB",
    sections: [
      { title: "Problem Statement", placeholder: "What problem are we solving?" },
      { title: "User Stories", placeholder: "As a [user], I want to [action] so that [benefit]" },
      { title: "Functional Requirements", placeholder: "List the key features and functionalities" },
      { title: "Non-Functional Requirements", placeholder: "Performance, security, scalability needs" },
      { title: "Success Metrics", placeholder: "KPIs and how success will be measured" },
      { title: "Timeline & Milestones", placeholder: "Key dates and deliverables" },
    ],
    aiPrompt:
      "You are a senior product manager. Generate a comprehensive Product Requirements Document (PRD) with these sections: Problem Statement, Target Users, User Stories (at least 5), Functional Requirements, Non-Functional Requirements, Success Metrics (with specific KPIs), Risks & Mitigations, and Timeline. Be specific, detailed, and actionable. Use markdown formatting.",
  },
  {
    id: "strategy-doc",
    name: "Product Strategy Brief",
    description:
      "Define your product vision, market positioning, competitive moats, and go-to-market strategy.",
    category: "Strategy",
    icon: "\uD83C\uDFAF",
    sections: [
      { title: "Vision & Mission", placeholder: "What is the long-term vision?" },
      { title: "Market Analysis", placeholder: "Market size, trends, and opportunities" },
      { title: "Competitive Landscape", placeholder: "Key competitors and differentiation" },
      { title: "Go-to-Market Strategy", placeholder: "How will we reach our target users?" },
      { title: "Strategic Pillars", placeholder: "Key strategic bets and priorities" },
    ],
    aiPrompt:
      "You are a VP of Product. Generate a compelling Product Strategy Brief with these sections: Vision & Mission, Market Opportunity (TAM/SAM/SOM), Target Audience Segments, Competitive Landscape (with positioning matrix), Strategic Pillars (3-4 key bets), Go-to-Market Strategy, Key Metrics & OKRs, and Risk Assessment. Be insightful and data-informed. Use markdown formatting.",
  },
  {
    id: "ai-ml-spec",
    name: "AI/ML Feature Specification",
    description:
      "Spec for AI-powered features including model requirements, data needs, evaluation criteria, and ethical considerations.",
    category: "AI/ML",
    icon: "\uD83E\uDD16",
    sections: [
      { title: "AI Feature Overview", placeholder: "What AI capability are we building?" },
      { title: "Model Requirements", placeholder: "Type of model, accuracy needs, latency constraints" },
      { title: "Data Requirements", placeholder: "Training data sources and volume needed" },
      { title: "Evaluation Criteria", placeholder: "How will we measure model performance?" },
      { title: "Ethical Considerations", placeholder: "Bias, fairness, privacy concerns" },
    ],
    aiPrompt:
      "You are an AI Product Manager. Generate a detailed AI/ML Feature Specification with: Feature Overview, Problem Definition, ML Approach (model type, architecture), Data Requirements (sources, volume, labeling), Training & Evaluation Plan (metrics, baselines), Integration Architecture, Latency & Performance Requirements, Ethical Considerations (bias, fairness, transparency), Monitoring & Retraining Strategy, and Rollout Plan (A/B testing approach). Use markdown formatting.",
  },
  {
    id: "metrics-dashboard",
    name: "Analytics & Metrics Framework",
    description:
      "Define your product analytics strategy with North Star metric, supporting KPIs, and tracking plan.",
    category: "Analytics",
    icon: "\uD83D\uDCCA",
    sections: [
      { title: "North Star Metric", placeholder: "The one metric that matters most" },
      { title: "Supporting KPIs", placeholder: "Metrics that drive the North Star" },
      { title: "Tracking Plan", placeholder: "Events, properties, and tools" },
      { title: "Dashboard Design", placeholder: "Key views and segments" },
    ],
    aiPrompt:
      "You are a data-driven Product Manager. Generate a comprehensive Analytics & Metrics Framework with: North Star Metric (with rationale), Input Metrics Tree (showing how metrics connect), Key Performance Indicators (acquisition, activation, retention, revenue, referral), Event Tracking Plan (key events with properties), Dashboard Blueprint (what charts, filters, segments), Experimentation Framework (A/B testing guidelines), and Review Cadence. Use markdown formatting.",
  },
  {
    id: "sprint-plan",
    name: "Sprint Planning Document",
    description:
      "Structured sprint plan with goals, user stories, capacity planning, and acceptance criteria.",
    category: "Planning",
    icon: "\uD83D\uDE80",
    sections: [
      { title: "Sprint Goal", placeholder: "What are we trying to achieve this sprint?" },
      { title: "User Stories", placeholder: "Prioritized list of stories for this sprint" },
      { title: "Capacity & Allocation", placeholder: "Team capacity and task assignments" },
      { title: "Acceptance Criteria", placeholder: "Definition of done for each story" },
      { title: "Risks & Dependencies", placeholder: "Blockers and cross-team dependencies" },
    ],
    aiPrompt:
      "You are an experienced Scrum Product Manager. Generate a detailed Sprint Planning Document with: Sprint Goal (one clear sentence), Sprint Backlog (5-8 user stories with story points), Acceptance Criteria for each story, Capacity Planning (team allocation), Dependencies & Risks, Definition of Done, and Sprint Ceremonies Schedule. Use markdown formatting.",
  },
  {
    id: "user-research",
    name: "User Research Plan",
    description:
      "Plan user research studies including objectives, methodology, participant criteria, and interview scripts.",
    category: "Documentation",
    icon: "\uD83D\uDD0D",
    sections: [
      { title: "Research Objectives", placeholder: "What questions do we want to answer?" },
      { title: "Methodology", placeholder: "Interviews, surveys, usability tests, etc." },
      { title: "Participant Criteria", placeholder: "Who should we talk to?" },
      { title: "Interview Guide", placeholder: "Key questions and discussion topics" },
      { title: "Analysis Plan", placeholder: "How will we synthesize findings?" },
    ],
    aiPrompt:
      "You are a UX Research expert working with product teams. Generate a comprehensive User Research Plan with: Research Objectives (3-5 key questions), Methodology Selection (with rationale), Participant Criteria & Recruitment Plan, Interview/Survey Script (10-15 questions), Usability Test Scenarios, Analysis Framework (affinity mapping, themes), Timeline & Resources, and Deliverables (findings report template). Use markdown formatting.",
  },
  {
    id: "competitive-analysis",
    name: "Competitive Analysis Report",
    description:
      "Deep-dive competitive analysis with feature comparison, SWOT, positioning, and strategic recommendations.",
    category: "Strategy",
    icon: "\u2694\uFE0F",
    sections: [
      { title: "Competitor Overview", placeholder: "Key competitors to analyze" },
      { title: "Feature Comparison", placeholder: "Feature-by-feature comparison matrix" },
      { title: "SWOT Analysis", placeholder: "Strengths, weaknesses, opportunities, threats" },
      { title: "Market Positioning", placeholder: "How competitors position themselves" },
      { title: "Strategic Recommendations", placeholder: "What should we do differently?" },
    ],
    aiPrompt:
      "You are a product strategy consultant. Generate a detailed Competitive Analysis Report with: Market Overview, Competitor Profiles (3-5 competitors with key stats), Feature Comparison Matrix, Pricing Comparison, SWOT Analysis for each competitor, Positioning Map Analysis, Gap Analysis (opportunities they're missing), and Strategic Recommendations (how to differentiate and win). Use markdown formatting.",
  },
  {
    id: "ai-integration-plan",
    name: "AI Integration Roadmap",
    description:
      "Plan for integrating AI capabilities into existing products, from quick wins to transformative features.",
    category: "AI/ML",
    icon: "\uD83E\uDDE0",
    sections: [
      { title: "Current State Assessment", placeholder: "Where is AI used today?" },
      { title: "AI Opportunities", placeholder: "Where can AI add the most value?" },
      { title: "Quick Wins", placeholder: "Low-effort, high-impact AI features" },
      { title: "Transformative Bets", placeholder: "Big AI bets for the long term" },
      { title: "Build vs Buy", placeholder: "What to build in-house vs use APIs?" },
    ],
    aiPrompt:
      "You are an AI strategy advisor for product teams. Generate a comprehensive AI Integration Roadmap with: Current State Assessment, AI Opportunity Matrix (impact vs effort), Quick Wins (0-3 months, using existing APIs), Medium-Term Integrations (3-6 months), Transformative AI Features (6-12 months), Build vs Buy Analysis, Data Infrastructure Requirements, Team Skills Gap Analysis, Risk Mitigation Plan, and Success Metrics for AI features. Use markdown formatting.",
  },
  {
    id: "okr-plan",
    name: "OKR Planning Template",
    description:
      "Set ambitious Objectives and Key Results with alignment mapping and scoring criteria.",
    category: "Planning",
    icon: "\uD83C\uDFF9",
    sections: [
      { title: "Company Objectives", placeholder: "Top-level company goals to align with" },
      { title: "Product Objectives", placeholder: "Product-level objectives (2-4)" },
      { title: "Key Results", placeholder: "Measurable outcomes for each objective" },
      { title: "Initiatives", placeholder: "Projects and features that drive key results" },
      { title: "Scoring Criteria", placeholder: "How will we score at end of quarter?" },
    ],
    aiPrompt:
      "You are an OKR coach for product teams. Generate a well-crafted OKR Plan with: Company-Level Context, 3 Product Objectives (ambitious but achievable), 3-4 Key Results per Objective (quantified, time-bound), Alignment Map showing how product OKRs connect to company OKRs, Initiative Mapping (what we'll build to drive each KR), Scoring Rubric (0.0-1.0 scale with examples), and Check-in Cadence. Make the OKRs specific and inspiring. Use markdown formatting.",
  },
  {
    id: "data-pipeline-spec",
    name: "Data Pipeline Specification",
    description:
      "Spec for product analytics data pipelines, event schemas, and data quality requirements.",
    category: "Analytics",
    icon: "\uD83D\uDD27",
    sections: [
      { title: "Data Sources", placeholder: "Where does the data come from?" },
      { title: "Event Schema", placeholder: "Event names, properties, and types" },
      { title: "Pipeline Architecture", placeholder: "How data flows and transforms" },
      { title: "Quality Requirements", placeholder: "Data freshness, accuracy, completeness" },
    ],
    aiPrompt:
      "You are a product analytics engineer. Generate a detailed Data Pipeline Specification with: Data Sources Inventory, Event Taxonomy (naming conventions), Core Event Schemas (with properties and types), Pipeline Architecture Diagram (described textually), Data Transformation Rules, Quality Assurance Framework (freshness, accuracy, completeness thresholds), Privacy & Compliance Requirements (GDPR, data retention), Monitoring & Alerting Plan, and Documentation Standards. Use markdown formatting.",
  },
  {
    id: "launch-plan",
    name: "Product Launch Playbook",
    description:
      "End-to-end launch plan from beta to GA, including marketing, comms, support, and rollback procedures.",
    category: "Planning",
    icon: "\uD83C\uDF1F",
    sections: [
      { title: "Launch Overview", placeholder: "What are we launching and when?" },
      { title: "Launch Phases", placeholder: "Beta, soft launch, GA timeline" },
      { title: "Marketing & Comms", placeholder: "Channels, messaging, and assets" },
      { title: "Support Readiness", placeholder: "FAQ, training, escalation paths" },
      { title: "Rollback Plan", placeholder: "What if things go wrong?" },
    ],
    aiPrompt:
      "You are a seasoned product launch manager. Generate a comprehensive Product Launch Playbook with: Launch Overview & Goals, Pre-Launch Checklist, Launch Phases (internal alpha, closed beta, open beta, GA), Marketing & Communications Plan (channels, messaging, timing), Sales Enablement Materials, Customer Support Readiness (FAQ, runbook), Technical Readiness Checklist, Launch Day War Room Plan, Post-Launch Monitoring Dashboard, Rollback Procedures, and Success Criteria (day 1, week 1, month 1). Use markdown formatting.",
  },
  {
    id: "api-product-spec",
    name: "API Product Specification",
    description:
      "Design developer-facing API products with endpoint design, auth, rate limits, and documentation plan.",
    category: "Documentation",
    icon: "\uD83D\uDD0C",
    sections: [
      { title: "API Overview", placeholder: "What does this API enable?" },
      { title: "Endpoint Design", placeholder: "Key endpoints and methods" },
      { title: "Authentication", placeholder: "Auth method and security model" },
      { title: "Rate Limiting", placeholder: "Quotas and throttling strategy" },
      { title: "Documentation Plan", placeholder: "SDK, guides, and reference docs" },
    ],
    aiPrompt:
      "You are an API product manager. Generate a detailed API Product Specification with: API Overview & Value Proposition, Target Developer Personas, Core Endpoints (RESTful design with examples), Authentication & Authorization (OAuth, API keys), Rate Limiting & Quotas, Error Handling Standards, Versioning Strategy, SDK & Developer Experience Plan, Documentation Structure, Pricing Tiers (if applicable), and Adoption Metrics. Use markdown formatting.",
  },
];
