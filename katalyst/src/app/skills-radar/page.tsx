"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getProgress, saveProgress, addXP } from "@/lib/storage";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

/* ─────────────────────────────────────────────
   Skill categories
   ───────────────────────────────────────────── */
const CATEGORIES = [
  "Strategy",
  "Product Discovery",
  "AI/ML",
  "Analytics",
  "Execution",
  "Leadership",
  "Technical",
] as const;

type Category = (typeof CATEGORIES)[number];

/* ─────────────────────────────────────────────
   Question type
   ───────────────────────────────────────────── */
interface Question {
  id: number;
  category: Category;
  text: string;
  options: { label: string; score: number }[];
}

/* ─────────────────────────────────────────────
   21 hard-coded MCQ questions (3 per category)
   ───────────────────────────────────────────── */
const QUESTIONS: Question[] = [
  // ── Strategy (3) ──────────────────────────
  {
    id: 1,
    category: "Strategy",
    text: "Your CEO wants to enter an adjacent market with uncertain TAM. How do you approach the go/no-go decision?",
    options: [
      { label: "Follow the CEO's instinct — they know the business best", score: 1 },
      { label: "Run a competitive analysis and present findings to leadership", score: 2 },
      { label: "Size the market with top-down estimates, validate with 10+ customer interviews, then model unit economics under pessimistic assumptions", score: 4 },
      { label: "Build a quick prototype and launch in the new market to see what happens", score: 3 },
    ],
  },
  {
    id: 2,
    category: "Strategy",
    text: "You need to decide between investing in a new growth initiative vs. optimizing the existing cash-cow product. What framework guides your decision?",
    options: [
      { label: "Always invest in new growth — staying still means falling behind", score: 1 },
      { label: "Use a cost-benefit analysis comparing short-term revenue impact", score: 2 },
      { label: "Apply a portfolio approach (e.g., McKinsey three horizons) balancing core, adjacent, and transformational bets relative to company stage and runway", score: 4 },
      { label: "Let the data from last quarter's performance decide", score: 3 },
    ],
  },
  {
    id: 3,
    category: "Strategy",
    text: "A well-funded competitor just launched a feature that overlaps with your core value proposition. What is your first move?",
    options: [
      { label: "Immediately build a better version of the same feature", score: 2 },
      { label: "Ignore it — focus on your own roadmap and don't be reactive", score: 1 },
      { label: "Assess actual user switching behavior and churn data, identify defensible differentiators, and double down on your unique value with a clear counter-positioning narrative", score: 4 },
      { label: "Schedule a war-room session with engineering to plan a rapid response", score: 3 },
    ],
  },

  // ── Product Discovery (3) ─────────────────
  {
    id: 4,
    category: "Product Discovery",
    text: "You have a hypothesis that users abandon onboarding because the setup flow is too long. How do you validate this?",
    options: [
      { label: "Shorten the onboarding flow and measure if retention improves", score: 2 },
      { label: "Look at funnel analytics to see where drop-off happens", score: 3 },
      { label: "Triangulate: analyze funnel drop-off data, run 5-second usability tests on each step, interview recent churned users, then test a streamlined prototype against the control", score: 4 },
      { label: "Ask the design team to make the onboarding screens more visually engaging", score: 1 },
    ],
  },
  {
    id: 5,
    category: "Product Discovery",
    text: "Stakeholders are pushing for a feature based on one large enterprise client's request. How do you handle this?",
    options: [
      { label: "Build it — large clients pay the bills and their feedback matters most", score: 1 },
      { label: "Say no and protect the roadmap from one-off requests", score: 2 },
      { label: "Investigate the underlying problem, check if it generalizes across your ICP, assess opportunity size vs. build cost, and propose a scoped solution that serves broader needs", score: 4 },
      { label: "Add it to the backlog and prioritize based on effort-impact scoring", score: 3 },
    ],
  },
  {
    id: 6,
    category: "Product Discovery",
    text: "You're exploring a brand-new problem space with no existing user data. What's your discovery approach?",
    options: [
      { label: "Build an MVP quickly and learn from real usage", score: 3 },
      { label: "Conduct desk research and analyze competitor offerings", score: 2 },
      { label: "Run generative research (contextual inquiries, diary studies) to map the problem space, create opportunity-solution trees, then test riskiest assumptions with low-fidelity prototypes", score: 4 },
      { label: "Survey a large sample of potential users to quantify demand", score: 1 },
    ],
  },

  // ── AI/ML (3) ─────────────────────────────
  {
    id: 7,
    category: "AI/ML",
    text: "Your team proposes using a large language model to auto-generate product descriptions. What concerns do you prioritize?",
    options: [
      { label: "Cost of API calls at scale", score: 2 },
      { label: "Whether it will save time for the content team", score: 1 },
      { label: "Hallucination risk, brand-voice consistency, legal liability for generated content, and building a human-in-the-loop review workflow with quality metrics", score: 4 },
      { label: "Model accuracy measured against a test set of existing descriptions", score: 3 },
    ],
  },
  {
    id: 8,
    category: "AI/ML",
    text: "A data scientist presents a recommendation model with 92% offline accuracy. What questions do you ask before shipping?",
    options: [
      { label: "How long until we can deploy it to production?", score: 1 },
      { label: "What dataset was it trained on and how recent is the data?", score: 3 },
      { label: "What is the false-positive/negative distribution? How does it perform across user segments (cold-start, power users)? What's the A/B test plan, success metric, and rollback strategy?", score: 4 },
      { label: "Can we improve it to 95% before launch?", score: 2 },
    ],
  },
  {
    id: 9,
    category: "AI/ML",
    text: "Leadership asks you to add 'AI features' to the product for competitive positioning. How do you respond?",
    options: [
      { label: "Brainstorm AI feature ideas with the team and pick the most exciting one", score: 2 },
      { label: "Survey users asking if they want AI-powered features", score: 1 },
      { label: "Identify user pain points where ML can uniquely reduce friction or unlock value, validate willingness-to-pay, prototype the highest-signal opportunity, and define clear success criteria before committing engineering resources", score: 4 },
      { label: "Research what AI features competitors have launched and build something similar", score: 3 },
    ],
  },

  // ── Analytics (3) ─────────────────────────
  {
    id: 10,
    category: "Analytics",
    text: "A key conversion metric dropped 15% week-over-week. Walk through your investigation approach.",
    options: [
      { label: "Alert engineering — it might be a bug", score: 2 },
      { label: "Check if there was a recent deploy or external event (holiday, outage), then segment the drop by user cohort, device, geography, and traffic source to isolate the root cause before forming hypotheses", score: 4 },
      { label: "Look at the overall funnel to see which step declined most", score: 3 },
      { label: "Wait another week to see if it recovers on its own", score: 1 },
    ],
  },
  {
    id: 11,
    category: "Analytics",
    text: "You ran an A/B test and the variant shows +3% conversion with p-value 0.08. What do you do?",
    options: [
      { label: "Ship it — 3% lift is meaningful for the business", score: 1 },
      { label: "Extend the test to reach statistical significance, evaluate practical significance of a 3% lift against implementation cost, and check for novelty effects or segment-level differences before deciding", score: 4 },
      { label: "Discard the result since it's not significant at p < 0.05", score: 2 },
      { label: "Run a follow-up qualitative study to understand why the variant performed better", score: 3 },
    ],
  },
  {
    id: 12,
    category: "Analytics",
    text: "The team wants to define a North Star Metric for a B2B SaaS collaboration tool. How do you approach this?",
    options: [
      { label: "Use monthly active users — it's the standard metric", score: 1 },
      { label: "Pick revenue (MRR) since it directly measures business success", score: 2 },
      { label: "Identify the core value-delivery moment (e.g., 'collaborative sessions per team per week'), validate it correlates with retention and expansion revenue, and ensure it's actionable by product and growth teams", score: 4 },
      { label: "Survey customers asking which metric matters most to them", score: 3 },
    ],
  },

  // ── Execution (3) ─────────────────────────
  {
    id: 13,
    category: "Execution",
    text: "Mid-sprint, a P0 bug is filed that conflicts with the current sprint commitment. How do you handle it?",
    options: [
      { label: "Push the sprint deadline to accommodate the bug fix", score: 1 },
      { label: "Ask the engineering manager to handle it — it's their call", score: 2 },
      { label: "Triage the bug's user impact and urgency, swap out the lowest-priority sprint item, communicate the trade-off to stakeholders, and update the sprint scope transparently", score: 4 },
      { label: "Have one engineer context-switch to fix the bug while the rest continue", score: 3 },
    ],
  },
  {
    id: 14,
    category: "Execution",
    text: "Your cross-functional launch involves eng, design, marketing, legal, and support. How do you keep it on track?",
    options: [
      { label: "Create a detailed Gantt chart and send weekly status emails", score: 2 },
      { label: "Trust each team to manage their own deliverables and sync at standup", score: 1 },
      { label: "Build a shared launch checklist with DRIs, hard deadlines, and dependency flags; run a weekly cross-functional sync focused only on blockers; and define go/no-go criteria for launch readiness", score: 4 },
      { label: "Set up a Slack channel and encourage async updates from all teams", score: 3 },
    ],
  },
  {
    id: 15,
    category: "Execution",
    text: "You have 5 feature requests competing for the next quarter. How do you decide what to build?",
    options: [
      { label: "Let the highest-paying customer's request win", score: 1 },
      { label: "Use a simple effort-vs-impact 2x2 matrix", score: 3 },
      { label: "Score each against strategic alignment, user impact (reach, intensity, confidence), effort, and opportunity cost; pressure-test with stakeholders; then commit to a sequenced roadmap with clear rationale", score: 4 },
      { label: "Have the team vote on what they're most excited to build", score: 2 },
    ],
  },

  // ── Leadership (3) ────────────────────────
  {
    id: 16,
    category: "Leadership",
    text: "An engineer on your team consistently pushes back on product decisions during planning. How do you approach this?",
    options: [
      { label: "Escalate to their engineering manager to align them", score: 1 },
      { label: "Include more data and context in your specs to preempt objections", score: 3 },
      { label: "Have a 1:1 to understand their perspective, find legitimate concerns to incorporate, co-create solutions where possible, and establish a shared decision-making framework the team agrees on", score: 4 },
      { label: "Accept their pushback and adjust your plans accordingly", score: 2 },
    ],
  },
  {
    id: 17,
    category: "Leadership",
    text: "You're presenting a risky product bet to the executive team. How do you build alignment?",
    options: [
      { label: "Lead with the exciting vision and let the data speak for itself in the appendix", score: 2 },
      { label: "Frame the proposal around the strategic problem, present evidence, quantify upside and downside scenarios, propose a time-boxed experiment with kill criteria, and pre-align key executives individually before the meeting", score: 4 },
      { label: "Present a comprehensive 30-slide deck covering every angle", score: 1 },
      { label: "Share the proposal in advance and ask for written feedback before the meeting", score: 3 },
    ],
  },
  {
    id: 18,
    category: "Leadership",
    text: "Your team is demoralized after a product launch that underperformed expectations. What do you do?",
    options: [
      { label: "Move on quickly to the next project to rebuild momentum", score: 1 },
      { label: "Conduct a blame-free retrospective focused on what the team learned, celebrate the effort and specific wins, share a clear narrative of what the data says and what you'll try differently, and protect the team from external criticism", score: 4 },
      { label: "Acknowledge the disappointment in a team meeting and express confidence in the next sprint", score: 3 },
      { label: "Write a post-mortem document analyzing what went wrong and share it company-wide", score: 2 },
    ],
  },

  // ── Technical (3) ─────────────────────────
  {
    id: 19,
    category: "Technical",
    text: "Engineering proposes rewriting a core service from a monolith to microservices. As PM, how do you evaluate this?",
    options: [
      { label: "Defer entirely to engineering — architecture is their domain", score: 1 },
      { label: "Ask how long it will take and whether it will delay the roadmap", score: 2 },
      { label: "Understand the current pain points (deploy frequency, incident rate, scaling bottlenecks), quantify the product velocity improvement, negotiate an incremental strangler-fig approach, and align on measurable outcomes at each milestone", score: 4 },
      { label: "Approve it if the tech lead is confident it's the right approach", score: 3 },
    ],
  },
  {
    id: 20,
    category: "Technical",
    text: "Your feature requires real-time data syncing across web and mobile. How do you participate in the technical design?",
    options: [
      { label: "Write detailed requirements and let engineering figure out the 'how'", score: 2 },
      { label: "Ask for an ETA and focus on the launch plan", score: 1 },
      { label: "Define the user-facing latency and consistency requirements, discuss trade-offs between WebSockets vs. polling vs. CRDTs with the team, understand failure modes and degraded-experience fallbacks, and co-author the technical spec", score: 4 },
      { label: "Research how competitors handle real-time sync and share findings with engineering", score: 3 },
    ],
  },
  {
    id: 21,
    category: "Technical",
    text: "A critical API integration partner is deprecating v2 of their API in 6 months. How do you manage the migration?",
    options: [
      { label: "Add it to the backlog and plan it for next quarter", score: 1 },
      { label: "Ask engineering to estimate the migration effort and schedule it", score: 2 },
      { label: "Audit all v2 dependencies, assess breaking changes against your use cases, create a phased migration plan with feature-flag rollouts, negotiate timeline extensions if needed, and ensure automated tests cover critical integration paths", score: 4 },
      { label: "Set up a meeting with the API partner to understand the changes", score: 3 },
    ],
  },
];

/* ─────────────────────────────────────────────
   Helpers
   ───────────────────────────────────────────── */
function computeScores(answers: Record<number, number>): Record<string, number> {
  const totals: Record<string, number[]> = {};
  CATEGORIES.forEach((c) => (totals[c] = []));

  QUESTIONS.forEach((q) => {
    if (answers[q.id] !== undefined) {
      totals[q.category].push(answers[q.id]);
    }
  });

  const scores: Record<string, number> = {};
  CATEGORIES.forEach((c) => {
    const vals = totals[c];
    if (vals.length === 0) {
      scores[c] = 0;
    } else {
      // Average of raw scores (1-4) mapped to 1-5 scale
      const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
      scores[c] = Math.round(((avg - 1) / 3) * 4 * 10 + 10) / 10; // maps 1->1, 4->5
    }
  });
  return scores;
}

function getChartData(scores: Record<string, number>) {
  return CATEGORIES.map((c) => ({
    category: c,
    score: scores[c] ?? 0,
    fullMark: 5,
  }));
}

function getRanked(scores: Record<string, number>) {
  const sorted = [...CATEGORIES].sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0));
  return { strengths: sorted.slice(0, 2), growthAreas: sorted.slice(-2).reverse() };
}

/* ─────────────────────────────────────────────
   Component
   ───────────────────────────────────────────── */
export default function SkillsRadarPage() {
  const [step, setStep] = useState<"loading" | "intro" | "quiz" | "results">("loading");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [scores, setScores] = useState<Record<string, number> | null>(null);
  const [copied, setCopied] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // On mount: check if user already has radar scores
  useEffect(() => {
    const progress = getProgress();
    if (progress.radarScores) {
      setScores(progress.radarScores);
      setStep("results");
    } else {
      setStep("intro");
    }
  }, []);

  const handleAnswer = useCallback(
    (questionId: number, score: number, optionIndex: number) => {
      setSelectedOption(optionIndex);

      // Small delay so the user sees their selection highlighted
      setTimeout(() => {
        const updated = { ...answers, [questionId]: score };
        setAnswers(updated);
        setSelectedOption(null);

        if (currentQ < QUESTIONS.length - 1) {
          setCurrentQ(currentQ + 1);
        } else {
          // All questions answered
          const computed = computeScores(updated);
          setScores(computed);
          saveProgress({ radarScores: computed });
          addXP(50);
          setStep("results");
        }
      }, 350);
    },
    [answers, currentQ],
  );

  const handleRetake = () => {
    setAnswers({});
    setCurrentQ(0);
    setScores(null);
    setSelectedOption(null);
    setStep("quiz");
  };

  const handleShareResults = async () => {
    if (!scores) return;
    const lines = CATEGORIES.map((c) => `${c}: ${(scores[c] ?? 0).toFixed(1)}/5`);
    const { strengths, growthAreas } = getRanked(scores);
    const text = [
      "My Katalyst PM Skills Radar Results",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      ...lines,
      "",
      `Top Strengths: ${strengths.join(", ")}`,
      `Growth Areas: ${growthAreas.join(", ")}`,
      "",
      "Assess your PM skills at Katalyst!",
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  /* ── Loading state ─────────────────────── */
  if (step === "loading") {
    return (
      <div className="fade-in flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  /* ── Intro screen ──────────────────────── */
  if (step === "intro") {
    return (
      <div className="fade-in max-w-2xl mx-auto">
        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted hover:text-primary mb-6 transition-colors">
          <span>←</span> Back to Home
        </Link>

        <div className="bg-white border border-border rounded-2xl p-8 sm:p-10 text-center">
          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <span className="text-3xl">🎯</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">PM Skills Radar</h1>
          <p className="text-muted leading-relaxed mb-6 max-w-lg mx-auto">
            Discover your strengths and growth areas across 7 critical PM competencies. Answer 21
            scenario-based questions to generate your personalized skills radar.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { icon: "📊", label: "21 Questions" },
              { icon: "🧠", label: "7 Skill Areas" },
              { icon: "⏱️", label: "~10 Minutes" },
              { icon: "✨", label: "+50 XP" },
            ].map((item) => (
              <div key={item.label} className="bg-surface-hover rounded-xl p-3 text-center">
                <span className="text-xl block mb-1">{item.icon}</span>
                <span className="text-xs font-medium text-muted">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {CATEGORIES.map((c) => (
              <span
                key={c}
                className="text-xs font-medium px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full"
              >
                {c}
              </span>
            ))}
          </div>

          <button
            onClick={() => setStep("quiz")}
            className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3 rounded-xl transition-colors text-base"
          >
            Start Assessment
          </button>
        </div>
      </div>
    );
  }

  /* ── Quiz wizard ───────────────────────── */
  if (step === "quiz") {
    const question = QUESTIONS[currentQ];
    const progress = ((currentQ) / QUESTIONS.length) * 100;
    const categoryIndex = CATEGORIES.indexOf(question.category) + 1;

    return (
      <div className="fade-in max-w-2xl mx-auto">
        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted hover:text-primary mb-6 transition-colors">
          <span>←</span> Back to Home
        </Link>

        <div className="bg-white border border-border rounded-2xl p-6 sm:p-8">
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-muted">
                Question {currentQ + 1} of {QUESTIONS.length}
              </span>
              <span className="text-sm font-medium text-primary">
                {Math.round(progress)}% complete
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Category badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-semibold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full">
              {question.category}
            </span>
            <span className="text-xs text-muted">
              Area {categoryIndex} of {CATEGORIES.length}
            </span>
          </div>

          {/* Question */}
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-6 leading-relaxed">
            {question.text}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(question.id, opt.score, idx)}
                  disabled={selectedOption !== null}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                    isSelected
                      ? "border-primary bg-indigo-50 shadow-sm"
                      : "border-border hover:border-primary-light hover:bg-surface-hover"
                  } ${selectedOption !== null && !isSelected ? "opacity-50" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${
                        isSelected
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-muted"
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-sm leading-relaxed text-foreground">{opt.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation hint */}
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={() => {
                if (currentQ > 0) {
                  setCurrentQ(currentQ - 1);
                  setSelectedOption(null);
                }
              }}
              disabled={currentQ === 0}
              className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                currentQ === 0
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-muted hover:text-primary hover:bg-surface-hover"
              }`}
            >
              ← Previous
            </button>
            <div className="flex gap-1.5">
              {QUESTIONS.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === currentQ
                      ? "bg-primary"
                      : answers[QUESTIONS[i].id] !== undefined
                        ? "bg-primary-light"
                        : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Results screen ────────────────────── */
  if (step === "results" && scores) {
    const chartData = getChartData(scores);
    const { strengths, growthAreas } = getRanked(scores);
    const overall =
      Math.round(
        (CATEGORIES.reduce((sum, c) => sum + (scores[c] ?? 0), 0) / CATEGORIES.length) * 10,
      ) / 10;

    return (
      <div className="fade-in max-w-3xl mx-auto">
        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted hover:text-primary mb-6 transition-colors">
          <span>←</span> Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🎯</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Your PM Skills Radar</h1>
          <p className="text-muted">
            Overall Score:{" "}
            <span className="font-bold text-primary text-lg">{overall.toFixed(1)}</span>
            <span className="text-muted">/5</span>
          </p>
        </div>

        {/* Radar Chart */}
        <div className="bg-white border border-border rounded-2xl p-4 sm:p-8 mb-6">
          <div className="w-full" style={{ height: 380 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="75%">
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis
                  dataKey="category"
                  tick={{ fontSize: 12, fill: "#64748b", fontWeight: 500 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 5]}
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  tickCount={6}
                />
                <Radar
                  name="PM Skills"
                  dataKey="score"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Score breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Strengths */}
          <div className="bg-white border border-border rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">💪</span>
              <h3 className="font-bold text-foreground">Top Strengths</h3>
            </div>
            <div className="space-y-3">
              {strengths.map((s) => (
                <div key={s} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{s}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-100 rounded-full h-2">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full"
                        style={{ width: `${((scores[s] ?? 0) / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-success min-w-[2.5rem] text-right">
                      {(scores[s] ?? 0).toFixed(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Growth Areas */}
          <div className="bg-white border border-border rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🌱</span>
              <h3 className="font-bold text-foreground">Growth Areas</h3>
            </div>
            <div className="space-y-3">
              {growthAreas.map((g) => (
                <div key={g} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{g}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-100 rounded-full h-2">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                        style={{ width: `${((scores[g] ?? 0) / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-warning min-w-[2.5rem] text-right">
                      {(scores[g] ?? 0).toFixed(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* All Scores */}
        <div className="bg-white border border-border rounded-2xl p-6 mb-6">
          <h3 className="font-bold text-foreground mb-4">Detailed Scores</h3>
          <div className="space-y-3">
            {CATEGORIES.map((c) => {
              const val = scores[c] ?? 0;
              const pct = (val / 5) * 100;
              return (
                <div key={c} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground w-36 flex-shrink-0">
                    {c}
                  </span>
                  <div className="flex-1 bg-gray-100 rounded-full h-3">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-foreground min-w-[2.5rem] text-right">
                    {val.toFixed(1)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          <button
            onClick={handleRetake}
            className="bg-white border border-border text-foreground px-6 py-3 rounded-xl font-semibold text-sm hover:bg-surface-hover transition-colors"
          >
            Retake Assessment
          </button>
          <button
            onClick={handleShareResults}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors flex items-center gap-2"
          >
            {copied ? (
              <>
                <span>✓</span> Copied to Clipboard!
              </>
            ) : (
              <>
                <span>📋</span> Share Results
              </>
            )}
          </button>
          <Link
            href="/learning-path"
            className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2"
          >
            <span>🗺️</span> View Learning Path
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
