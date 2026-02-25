"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getProgress, saveProgress } from "@/lib/storage";
import { askGemini } from "@/lib/gemini";

/* ------------------------------------------------------------------ */
/*  Skill area definitions                                             */
/* ------------------------------------------------------------------ */

const SKILL_AREAS = [
  "Strategy",
  "Product Discovery",
  "AI/ML",
  "Analytics",
  "Execution",
  "Leadership",
  "Technical",
] as const;

type SkillArea = (typeof SKILL_AREAS)[number];

/* ------------------------------------------------------------------ */
/*  Hardcoded learning actions per skill area                          */
/* ------------------------------------------------------------------ */

const LEARNING_ACTIONS: Record<SkillArea, { action: string; type: string }[]> = {
  Strategy: [
    { action: "Complete the Product Strategy deep-dive lesson", type: "Lesson" },
    { action: "Practice 5 strategy interview questions", type: "Practice" },
    { action: "Read the Spotify product teardown", type: "Teardown" },
    { action: "Apply the Three Horizons framework to a real product", type: "Framework" },
  ],
  "Product Discovery": [
    { action: "Complete the User Research & Discovery module", type: "Lesson" },
    { action: "Run a mock customer interview exercise", type: "Practice" },
    { action: "Study the CRED product teardown for discovery insights", type: "Teardown" },
    { action: "Practice opportunity-solution tree mapping", type: "Framework" },
  ],
  "AI/ML": [
    { action: "Complete all 10 AI PM Mastery lessons", type: "Lesson" },
    { action: "Practice AI/ML interview questions", type: "Practice" },
    { action: "Read the ChatGPT product teardown", type: "Teardown" },
    { action: "Build an AI product spec using the Templates Hub", type: "Project" },
  ],
  Analytics: [
    { action: "Complete the Metrics & Analytics lesson module", type: "Lesson" },
    { action: "Practice 5 analytics-focused interview questions", type: "Practice" },
    { action: "Define North Star Metrics for 3 different products", type: "Exercise" },
    { action: "Study the metrics framework in PM Frameworks", type: "Framework" },
  ],
  Execution: [
    { action: "Complete the Roadmapping & Execution lesson", type: "Lesson" },
    { action: "Practice sprint planning case snacks", type: "Practice" },
    { action: "Write a PRD using the AI Templates Hub", type: "Project" },
    { action: "Study the RICE and MoSCoW prioritization frameworks", type: "Framework" },
  ],
  Leadership: [
    { action: "Complete the Stakeholder Management lesson", type: "Lesson" },
    { action: "Practice leadership & influence interview questions", type: "Practice" },
    { action: "Role-play a difficult stakeholder conversation with AI Mentor", type: "Exercise" },
    { action: "Study the RACI and Decision-Making frameworks", type: "Framework" },
  ],
  Technical: [
    { action: "Complete the Technical PM Skills lesson module", type: "Lesson" },
    { action: "Practice system design interview questions", type: "Practice" },
    { action: "Read a technical architecture teardown", type: "Teardown" },
    { action: "Learn to write technical specs using the Templates Hub", type: "Project" },
  ],
};

/* ------------------------------------------------------------------ */
/*  Weekly goal suggestions                                            */
/* ------------------------------------------------------------------ */

const WEEKLY_GOALS = [
  { goal: "Complete 5 daily challenges", icon: "lightning", xp: 100 },
  { goal: "Finish 2 AI PM Mastery lessons", icon: "book", xp: 60 },
  { goal: "Practice 10 interview questions", icon: "briefcase", xp: 80 },
  { goal: "Read 1 product teardown", icon: "search", xp: 30 },
  { goal: "Explore 3 PM frameworks", icon: "puzzle", xp: 45 },
  { goal: "Solve 3 case snacks", icon: "snack", xp: 45 },
];

/* ------------------------------------------------------------------ */
/*  Helper functions                                                    */
/* ------------------------------------------------------------------ */

function getWeakestAreas(
  scores: Record<string, number>,
  count: number
): { area: string; score: number }[] {
  return Object.entries(scores)
    .sort(([, a], [, b]) => a - b)
    .slice(0, count)
    .map(([area, score]) => ({ area, score }));
}

function getStatusLabel(score: number): { label: string; color: string } {
  if (score >= 4.0) return { label: "Strong", color: "bg-emerald-100 text-emerald-700" };
  if (score >= 3.0) return { label: "Good", color: "bg-blue-100 text-blue-700" };
  if (score >= 2.0) return { label: "Needs Work", color: "bg-amber-100 text-amber-700" };
  return { label: "Priority", color: "bg-rose-100 text-rose-700" };
}

function getGoalIcon(icon: string): string {
  const map: Record<string, string> = {
    lightning: "svg-lightning",
    book: "svg-book",
    briefcase: "svg-briefcase",
    search: "svg-search",
    puzzle: "svg-puzzle",
    snack: "svg-snack",
  };
  return map[icon] || "svg-lightning";
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function LearningPathPage() {
  const [radarScores, setRadarScores] = useState<Record<string, number> | null>(null);
  const [mounted, setMounted] = useState(false);
  const [aiPlan, setAiPlan] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    const progress = getProgress();
    if (progress.radarScores) {
      setRadarScores(progress.radarScores);
    }
    setMounted(true);
  }, []);

  const handleGeneratePlan = useCallback(async () => {
    if (aiLoading || !radarScores) return;
    setAiLoading(true);
    setAiError(null);

    const scoresText = Object.entries(radarScores)
      .map(([area, score]) => `${area}: ${score.toFixed(1)}/5`)
      .join(", ");

    const weakAreas = getWeakestAreas(radarScores, 3)
      .map((w) => w.area)
      .join(", ");

    try {
      const prompt = `You are a PM career coach creating a personalized 30-day learning plan.

The user's PM Skills Radar scores are: ${scoresText}
Their weakest areas are: ${weakAreas}

Create a detailed, actionable 30-day learning plan that:
1. Focuses on improving the weakest areas first
2. Includes specific weekly milestones (Week 1-4)
3. Mixes different learning activities (reading, practicing, building)
4. Includes daily time estimates (30-60 min/day)
5. Builds progressively from fundamentals to advanced topics
6. Includes real-world project suggestions

Format with clear headers, bullet points, and bold key actions. Keep it practical and motivating.`;

      const response = await askGemini(prompt);
      setAiPlan(response);
      saveProgress({});
    } catch {
      setAiError("Failed to generate your learning plan. Please try again.");
    } finally {
      setAiLoading(false);
    }
  }, [aiLoading, radarScores]);

  /* ── Loading state ── */
  if (!mounted) {
    return (
      <div className="fade-in flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  /* ── No radar scores: prompt user ── */
  if (!radarScores) {
    return (
      <div className="fade-in max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted hover:text-primary mb-6 transition-colors"
        >
          <span>&larr;</span> Back to Home
        </Link>

        <div className="bg-white border border-border rounded-2xl p-8 sm:p-10 text-center">
          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <svg
              className="h-8 w-8 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
              />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Personalized Learning Path
          </h1>
          <p className="text-muted leading-relaxed mb-6 max-w-lg mx-auto">
            Take the Skills Radar assessment first to get your personalized
            learning path. We will analyze your strengths and weaknesses to
            create a custom roadmap just for you.
          </p>
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 mb-6 max-w-md mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🎯</span>
              <h3 className="font-semibold text-indigo-900">Skills Radar Assessment</h3>
            </div>
            <p className="text-sm text-indigo-700 mb-4">
              21 scenario-based questions across 7 PM skill areas. Takes about 10 minutes.
            </p>
            <Link
              href="/skills-radar"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
              Take Skills Radar
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Main learning path view ── */
  const weakestAreas = getWeakestAreas(radarScores, 3);

  return (
    <div className="fade-in">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-primary mb-6 transition-colors"
      >
        <span>&larr;</span> Back to Home
      </Link>

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-8 sm:p-10 mb-8 text-white">
        <div className="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <svg
              className="h-8 w-8 text-white/90"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
              />
            </svg>
            <h1 className="text-2xl sm:text-3xl font-bold">Your Learning Path</h1>
          </div>
          <p className="text-white/80 max-w-2xl">
            A personalized roadmap based on your Skills Radar results. Focus on
            your weakest areas to accelerate your PM growth.
          </p>
        </div>
      </div>

      {/* Priority Focus Areas */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-5">
          <svg
            className="h-5 w-5 text-rose-500"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
          <h2 className="text-xl font-bold text-foreground">Priority Focus Areas</h2>
        </div>
        <p className="text-sm text-muted mb-6">
          These are your 3 weakest skill areas. Prioritize learning in these
          domains for the fastest growth.
        </p>

        <div className="space-y-5">
          {weakestAreas.map((weak, index) => {
            const area = weak.area as SkillArea;
            const actions = LEARNING_ACTIONS[area] || [];
            return (
              <div
                key={weak.area}
                className="bg-white border border-border rounded-xl overflow-hidden"
              >
                {/* Module header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-gradient-to-r from-rose-50 to-orange-50">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-100 text-rose-700 text-sm font-bold">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold text-foreground">{weak.area}</h3>
                      <p className="text-xs text-muted">
                        Current score:{" "}
                        <span className="font-bold text-rose-600">
                          {weak.score.toFixed(1)}
                        </span>
                        /5
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-100 rounded-full h-2">
                      <div
                        className="h-full bg-gradient-to-r from-rose-400 to-orange-500 rounded-full transition-all duration-500"
                        style={{ width: `${(weak.score / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-rose-600 min-w-[2rem] text-right">
                      {weak.score.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Recommended actions */}
                <div className="px-6 py-4">
                  <p className="text-xs text-muted uppercase tracking-wide font-semibold mb-3">
                    Recommended Actions
                  </p>
                  <div className="space-y-2.5">
                    {actions.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-indigo-50 transition-colors"
                      >
                        <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-gray-300 flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-transparent" />
                        </div>
                        <span className="text-sm text-foreground flex-1">
                          {item.action}
                        </span>
                        <span className="text-xs font-medium px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-full flex-shrink-0">
                          {item.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* AI Learning Plan Generator */}
      <section className="mb-10">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <svg
              className="h-6 w-6 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z"
              />
            </svg>
            <h2 className="text-lg font-bold text-indigo-900">
              AI-Powered 30-Day Learning Plan
            </h2>
          </div>
          <p className="text-sm text-indigo-700 mb-5">
            Get a detailed, personalized 30-day learning plan generated by AI
            based on your skill scores and growth areas.
          </p>

          {!aiPlan && (
            <button
              onClick={handleGeneratePlan}
              disabled={aiLoading}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm disabled:opacity-60"
            >
              {aiLoading ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Generating Your Plan...
                </>
              ) : (
                <>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z"
                    />
                  </svg>
                  Generate AI Learning Plan
                </>
              )}
            </button>
          )}

          {aiError && (
            <div className="mt-4 p-4 rounded-lg bg-rose-50 border border-rose-200 text-sm text-rose-700">
              {aiError}
            </div>
          )}

          {aiPlan && (
            <div className="mt-5 bg-white rounded-xl border border-indigo-200 p-6 fade-in">
              <div className="flex items-center gap-2 mb-4">
                <svg
                  className="h-5 w-5 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z"
                  />
                </svg>
                <h3 className="font-semibold text-indigo-900">
                  Your Personalized 30-Day Plan
                </h3>
              </div>
              <div className="prose-content text-sm text-gray-700 leading-relaxed">
                {aiPlan.split("\n").map((line, i) => {
                  if (!line.trim()) return <br key={i} />;
                  if (line.startsWith("### "))
                    return <h3 key={i}>{renderBold(line.replace("### ", ""))}</h3>;
                  if (line.startsWith("## "))
                    return <h2 key={i}>{renderBold(line.replace("## ", ""))}</h2>;
                  if (line.startsWith("# "))
                    return <h1 key={i}>{renderBold(line.replace("# ", ""))}</h1>;
                  if (line.startsWith("- ") || line.startsWith("* "))
                    return (
                      <li key={i} className="ml-4 mb-1 list-disc">
                        {renderBold(line.slice(2))}
                      </li>
                    );
                  if (/^\d+\.\s/.test(line))
                    return (
                      <li key={i} className="ml-4 mb-1 list-decimal">
                        {renderBold(line.replace(/^\d+\.\s/, ""))}
                      </li>
                    );
                  return <p key={i}>{renderBold(line)}</p>;
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* All 7 Skill Areas Grid */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-foreground mb-5">All Skill Areas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SKILL_AREAS.map((area) => {
            const score = radarScores[area] ?? 0;
            const status = getStatusLabel(score);
            const pct = (score / 5) * 100;

            return (
              <div
                key={area}
                className="bg-white border border-border rounded-xl p-5 card-hover"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground text-sm">{area}</h3>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.color}`}
                  >
                    {status.label}
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        score >= 4.0
                          ? "bg-gradient-to-r from-emerald-400 to-green-500"
                          : score >= 3.0
                            ? "bg-gradient-to-r from-blue-400 to-indigo-500"
                            : score >= 2.0
                              ? "bg-gradient-to-r from-amber-400 to-orange-500"
                              : "bg-gradient-to-r from-rose-400 to-red-500"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-foreground min-w-[2.5rem] text-right">
                    {score.toFixed(1)}/5
                  </span>
                </div>
                <div className="text-xs text-muted">
                  {score >= 4.0
                    ? "Keep sharpening this strength"
                    : score >= 3.0
                      ? "Solid foundation, room to grow"
                      : "Focus area for improvement"}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Weekly Goal Suggestions */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-foreground mb-5">
          Weekly Goal Suggestions
        </h2>
        <div className="bg-white border border-border rounded-xl p-6">
          <p className="text-sm text-muted mb-4">
            Set weekly goals to maintain consistent progress. Aim for 3-4 goals
            per week.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {WEEKLY_GOALS.map((goal, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-indigo-50 transition-colors"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex-shrink-0">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{goal.goal}</p>
                  <p className="text-xs text-muted">+{goal.xp} XP potential</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="mb-8">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/skills-radar"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-border rounded-lg text-sm font-semibold text-foreground hover:bg-surface-hover transition-colors"
          >
            <span>🎯</span> Retake Assessment
          </Link>
          <Link
            href="/ai-pm-module"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-border rounded-lg text-sm font-semibold text-foreground hover:bg-surface-hover transition-colors"
          >
            <span>🤖</span> AI PM Lessons
          </Link>
          <Link
            href="/daily-challenge"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors"
          >
            <span>&#9889;</span> Daily Challenge
          </Link>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Helper: Render **bold** text                                        */
/* ------------------------------------------------------------------ */

function renderBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}
