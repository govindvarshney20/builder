"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { interviewQuestions, companies } from "@/data/interview-questions";
import type { InterviewQuestion } from "@/data/interview-questions";
import { getProgress, saveProgress, addXP } from "@/lib/storage";
import { askGemini } from "@/lib/gemini";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const QUESTION_TYPES = [
  "Product Sense",
  "Execution",
  "Behavioral",
  "AI/ML",
  "Guesstimate",
  "Strategy",
] as const;

const DIFFICULTIES = ["Medium", "Hard"] as const;

const OPTION_LABELS = ["A", "B", "C", "D"];

const PAGE_SIZE = 10;

const TYPE_COLORS: Record<string, string> = {
  "Product Sense": "bg-blue-100 text-blue-700",
  Execution: "bg-amber-100 text-amber-700",
  Behavioral: "bg-purple-100 text-purple-700",
  "AI/ML": "bg-cyan-100 text-cyan-700",
  Guesstimate: "bg-pink-100 text-pink-700",
  Strategy: "bg-emerald-100 text-emerald-700",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  Medium: "bg-amber-100 text-amber-700",
  Hard: "bg-rose-100 text-rose-700",
};

const COMPANY_COLORS: Record<string, string> = {
  Google: "bg-blue-50 text-blue-700 border-blue-200",
  Meta: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Amazon: "bg-orange-50 text-orange-700 border-orange-200",
  Apple: "bg-gray-100 text-gray-700 border-gray-300",
  Microsoft: "bg-teal-50 text-teal-700 border-teal-200",
  Flipkart: "bg-yellow-50 text-yellow-700 border-yellow-200",
  Swiggy: "bg-orange-50 text-orange-600 border-orange-200",
  Razorpay: "bg-sky-50 text-sky-700 border-sky-200",
  CRED: "bg-slate-100 text-slate-700 border-slate-300",
  Spotify: "bg-green-50 text-green-700 border-green-200",
  Netflix: "bg-red-50 text-red-700 border-red-200",
  Stripe: "bg-violet-50 text-violet-700 border-violet-200",
};

function getCompanyColor(company: string): string {
  return COMPANY_COLORS[company] ?? "bg-gray-50 text-gray-700 border-gray-200";
}

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface AnswerState {
  selectedIndex: number;
  correct: boolean;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function InterviewPrepPage() {
  /* ---- state ---- */
  const [mounted, setMounted] = useState(false);
  const [answeredMap, setAnsweredMap] = useState<Record<string, AnswerState>>({});
  const [aiAnalysisMap, setAiAnalysisMap] = useState<Record<string, string>>({});
  const [aiLoadingMap, setAiLoadingMap] = useState<Record<string, boolean>>({});
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  // Filters
  const [companyFilter, setCompanyFilter] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("All");

  // Pagination
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  /* ---- load saved progress on mount ---- */
  useEffect(() => {
    const progress = getProgress();
    // Restore previously answered interview questions from localStorage
    const storedAnswers = typeof window !== "undefined"
      ? localStorage.getItem("katalyst_interview_answers")
      : null;
    if (storedAnswers) {
      try {
        setAnsweredMap(JSON.parse(storedAnswers));
      } catch {
        // ignore parse errors
      }
    }
    // Ensure progress is initialized
    saveProgress({});
    setMounted(true);
  }, []);

  /* ---- persist answers to localStorage ---- */
  const persistAnswers = useCallback((updated: Record<string, AnswerState>) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("katalyst_interview_answers", JSON.stringify(updated));
    }
  }, []);

  /* ---- filtered questions ---- */
  const filteredQuestions = useMemo(() => {
    return interviewQuestions.filter((q) => {
      if (companyFilter !== "All" && q.company !== companyFilter) return false;
      if (typeFilter !== "All" && q.type !== typeFilter) return false;
      if (difficultyFilter !== "All" && q.difficulty !== difficultyFilter) return false;
      return true;
    });
  }, [companyFilter, typeFilter, difficultyFilter]);

  /* ---- visible questions (pagination) ---- */
  const visibleQuestions = useMemo(
    () => filteredQuestions.slice(0, visibleCount),
    [filteredQuestions, visibleCount],
  );

  /* ---- reset pagination when filters change ---- */
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [companyFilter, typeFilter, difficultyFilter]);

  /* ---- stats ---- */
  const totalAnswered = Object.keys(answeredMap).length;
  const totalQuestions = interviewQuestions.length;

  const statsByType = useMemo(() => {
    const stats: Record<string, { total: number; correct: number }> = {};
    QUESTION_TYPES.forEach((t) => (stats[t] = { total: 0, correct: 0 }));

    for (const q of interviewQuestions) {
      if (answeredMap[q.id]) {
        stats[q.type].total++;
        if (answeredMap[q.id].correct) {
          stats[q.type].correct++;
        }
      }
    }
    return stats;
  }, [answeredMap]);

  /* ---- handlers ---- */
  const handleAnswer = useCallback(
    (question: InterviewQuestion, optionIndex: number) => {
      if (answeredMap[question.id]) return;

      const correct = optionIndex === question.correctIndex;
      const xpGain = correct ? 15 : 5;

      const newAnswer: AnswerState = { selectedIndex: optionIndex, correct };
      const updated = { ...answeredMap, [question.id]: newAnswer };

      setAnsweredMap(updated);
      persistAnswers(updated);

      // Expand card to show answer details
      setExpandedCards((prev) => new Set(prev).add(question.id));

      // Award XP and update progress
      addXP(xpGain);
      const newCount = Object.keys(updated).length;
      saveProgress({ interviewQsCompleted: newCount });
    },
    [answeredMap, persistAnswers],
  );

  const handleAiAnalysis = useCallback(
    async (question: InterviewQuestion) => {
      if (aiLoadingMap[question.id] || aiAnalysisMap[question.id]) return;

      setAiLoadingMap((prev) => ({ ...prev, [question.id]: true }));

      try {
        const userAnswer = answeredMap[question.id];
        const userSelection = userAnswer
          ? question.options[userAnswer.selectedIndex]
          : "Not answered yet";

        const prompt = `You are a senior PM interview coach. Analyze this interview question in depth.

Question: ${question.question}
Company: ${question.company}
Type: ${question.type}
Difficulty: ${question.difficulty}

Options:
${question.options.map((opt, i) => `${OPTION_LABELS[i]}. ${opt}`).join("\n")}

Correct Answer: ${OPTION_LABELS[question.correctIndex]}. ${question.options[question.correctIndex]}
User's Answer: ${userSelection}

Model Answer: ${question.modelAnswer}

Provide a structured analysis:
1. **Why the correct answer works** - Explain with a real-world PM example
2. **Common pitfalls** - Why candidates pick wrong answers
3. **Framework to use** - What PM framework applies here
4. **Interview tip** - How to articulate this answer in a real interview

Keep it concise but insightful. Use markdown formatting.`;

        const response = await askGemini(prompt);
        setAiAnalysisMap((prev) => ({ ...prev, [question.id]: response }));
      } catch {
        setAiAnalysisMap((prev) => ({
          ...prev,
          [question.id]:
            "Unable to generate AI analysis right now. Please try again later.",
        }));
      } finally {
        setAiLoadingMap((prev) => ({ ...prev, [question.id]: false }));
      }
    },
    [aiLoadingMap, aiAnalysisMap, answeredMap],
  );

  const toggleCard = useCallback((id: string) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setCompanyFilter("All");
    setTypeFilter("All");
    setDifficultyFilter("All");
  }, []);

  const hasActiveFilters =
    companyFilter !== "All" || typeFilter !== "All" || difficultyFilter !== "All";

  /* ---- loading state ---- */
  if (!mounted) {
    return (
      <div className="fade-in">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[#e2e8f0] rounded w-1/3" />
          <div className="h-4 bg-[#e2e8f0] rounded w-2/3" />
          <div className="h-12 bg-[#e2e8f0] rounded" />
          <div className="space-y-4 mt-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-48 bg-[#e2e8f0] rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ---- render ---- */
  return (
    <div className="fade-in">
      {/* ── Back link ── */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-primary mb-6 transition-colors"
      >
        <span>←</span> Back to Home
      </Link>

      {/* ── Header ── */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <span className="text-xl">💼</span>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Interview Prep
            </h1>
          </div>
        </div>
        <p className="text-muted mt-1">
          Practice 60+ real PM interview questions from top companies. Earn XP as you go.
        </p>
      </div>

      {/* ── Progress Tracker ── */}
      <div className="bg-white border border-border rounded-xl p-5 mb-6">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">📊</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {totalAnswered}/{totalQuestions}
              </div>
              <div className="text-xs text-muted">Questions Completed</div>
            </div>
          </div>

          <div className="hidden sm:block h-10 w-px bg-border" />

          <div className="flex-1 min-w-[200px]">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-sm font-medium text-muted">Overall Progress</span>
              <span className="text-sm font-bold text-primary">
                {totalQuestions > 0
                  ? Math.round((totalAnswered / totalQuestions) * 100)
                  : 0}
                %
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500"
                style={{
                  width: `${totalQuestions > 0 ? (totalAnswered / totalQuestions) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          <div className="hidden sm:block h-10 w-px bg-border" />

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">🎯</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {totalAnswered > 0
                  ? Math.round(
                      (Object.values(answeredMap).filter((a) => a.correct).length /
                        totalAnswered) *
                        100,
                    )
                  : 0}
                %
              </div>
              <div className="text-xs text-muted">Accuracy</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats: Accuracy by Category ── */}
      <div className="bg-white border border-border rounded-xl p-5 mb-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Accuracy by Category
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {QUESTION_TYPES.map((type) => {
            const stat = statsByType[type];
            const pct =
              stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
            return (
              <div key={type} className="flex items-center gap-3">
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${TYPE_COLORS[type]}`}
                >
                  {type}
                </span>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-foreground min-w-[3rem] text-right">
                  {stat.total > 0
                    ? `${stat.correct}/${stat.total}`
                    : "--"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className="bg-white border border-border rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Filters</h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs font-medium text-primary hover:text-primary-dark transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Company Filter */}
        <div className="mb-4">
          <label className="text-xs font-medium text-muted mb-2 block">Company</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCompanyFilter("All")}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-200 ${
                companyFilter === "All"
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-muted border-border hover:border-primary-light hover:text-foreground"
              }`}
            >
              All
            </button>
            {companies.map((company) => (
              <button
                key={company}
                onClick={() =>
                  setCompanyFilter(companyFilter === company ? "All" : company)
                }
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-200 ${
                  companyFilter === company
                    ? "bg-primary text-white border-primary"
                    : `${getCompanyColor(company)} hover:border-primary-light`
                }`}
              >
                {company}
              </button>
            ))}
          </div>
        </div>

        {/* Type Filter */}
        <div className="mb-4">
          <label className="text-xs font-medium text-muted mb-2 block">
            Question Type
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setTypeFilter("All")}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-200 ${
                typeFilter === "All"
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-muted border-border hover:border-primary-light hover:text-foreground"
              }`}
            >
              All
            </button>
            {QUESTION_TYPES.map((type) => (
              <button
                key={type}
                onClick={() =>
                  setTypeFilter(typeFilter === type ? "All" : type)
                }
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-200 ${
                  typeFilter === type
                    ? "bg-primary text-white border-primary"
                    : `${TYPE_COLORS[type]} border-transparent hover:border-primary-light`
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Filter */}
        <div>
          <label className="text-xs font-medium text-muted mb-2 block">
            Difficulty
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setDifficultyFilter("All")}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-200 ${
                difficultyFilter === "All"
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-muted border-border hover:border-primary-light hover:text-foreground"
              }`}
            >
              All
            </button>
            {DIFFICULTIES.map((diff) => (
              <button
                key={diff}
                onClick={() =>
                  setDifficultyFilter(difficultyFilter === diff ? "All" : diff)
                }
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-200 ${
                  difficultyFilter === diff
                    ? "bg-primary text-white border-primary"
                    : `${DIFFICULTY_COLORS[diff]} border-transparent hover:border-primary-light`
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Results Count ── */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted">
          Showing{" "}
          <span className="font-semibold text-foreground">
            {Math.min(visibleCount, filteredQuestions.length)}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-foreground">
            {filteredQuestions.length}
          </span>{" "}
          questions
        </p>
      </div>

      {/* ── Question Cards ── */}
      {filteredQuestions.length === 0 ? (
        <div className="bg-white border border-border rounded-xl p-12 text-center">
          <span className="text-4xl block mb-3">🔍</span>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            No questions found
          </h3>
          <p className="text-sm text-muted mb-4">
            Try adjusting your filters to see more questions.
          </p>
          <button
            onClick={clearFilters}
            className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {visibleQuestions.map((question, qIndex) => {
            const answer = answeredMap[question.id];
            const isExpanded = expandedCards.has(question.id);
            const aiAnalysis = aiAnalysisMap[question.id];
            const aiLoading = aiLoadingMap[question.id] ?? false;

            return (
              <div
                key={question.id}
                className="bg-white border border-border rounded-xl overflow-hidden transition-shadow duration-200 hover:shadow-md"
              >
                {/* ── Card Header ── */}
                <div className="px-5 py-4 border-b border-border/60">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono text-muted">
                      #{qIndex + 1}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getCompanyColor(question.company)}`}
                    >
                      {question.company}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${TYPE_COLORS[question.type]}`}
                    >
                      {question.type}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${DIFFICULTY_COLORS[question.difficulty]}`}
                    >
                      {question.difficulty}
                    </span>

                    {answer && (
                      <span
                        className={`ml-auto text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                          answer.correct
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {answer.correct ? "+15 XP" : "+5 XP"}
                      </span>
                    )}
                  </div>
                </div>

                {/* ── Question Text ── */}
                <div className="px-5 py-4">
                  <h3 className="text-base font-semibold text-foreground leading-relaxed">
                    {question.question}
                  </h3>
                </div>

                {/* ── Options ── */}
                <div className="px-5 pb-4 space-y-2.5">
                  {question.options.map((option, idx) => {
                    const isSelected = answer?.selectedIndex === idx;
                    const isCorrect = idx === question.correctIndex;
                    const isAnswered = !!answer;

                    let optionClasses =
                      "border-border bg-white hover:border-primary-light hover:bg-surface-hover cursor-pointer";

                    if (isAnswered) {
                      if (isCorrect) {
                        optionClasses =
                          "border-emerald-400 bg-emerald-50 ring-1 ring-emerald-400";
                      } else if (isSelected && !isCorrect) {
                        optionClasses =
                          "border-rose-400 bg-rose-50 ring-1 ring-rose-400";
                      } else {
                        optionClasses = "border-border bg-gray-50/50 opacity-50";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(question, idx)}
                        disabled={isAnswered}
                        className={`flex w-full items-center gap-3 rounded-lg border-2 px-4 py-3 text-left transition-all duration-200 ${optionClasses} disabled:cursor-default`}
                      >
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors duration-200 ${
                            isAnswered && isCorrect
                              ? "bg-emerald-500 text-white"
                              : isAnswered && isSelected && !isCorrect
                                ? "bg-rose-500 text-white"
                                : "bg-gray-100 text-muted"
                          }`}
                        >
                          {OPTION_LABELS[idx]}
                        </span>
                        <span className="text-sm text-foreground leading-relaxed">
                          {option}
                        </span>
                        {isAnswered && isCorrect && (
                          <svg
                            className="ml-auto h-5 w-5 shrink-0 text-emerald-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                          </svg>
                        )}
                        {isAnswered && isSelected && !isCorrect && (
                          <svg
                            className="ml-auto h-5 w-5 shrink-0 text-rose-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* ── Post-Answer Details ── */}
                {answer && (
                  <div className="border-t border-border">
                    {/* Toggle expand/collapse */}
                    <button
                      onClick={() => toggleCard(question.id)}
                      className="w-full px-5 py-3 flex items-center justify-between text-sm font-medium text-muted hover:text-primary transition-colors"
                    >
                      <span>
                        {isExpanded
                          ? "Hide answer details"
                          : "Show model answer & tip"}
                      </span>
                      <svg
                        className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m19.5 8.25-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 fade-in">
                        {/* Result banner */}
                        <div
                          className={`mb-4 flex items-center gap-2 rounded-lg px-4 py-2.5 ${
                            answer.correct
                              ? "bg-emerald-50 border border-emerald-200"
                              : "bg-amber-50 border border-amber-200"
                          }`}
                        >
                          <span className="text-base">
                            {answer.correct ? "🎉" : "💡"}
                          </span>
                          <span
                            className={`text-sm font-semibold ${
                              answer.correct
                                ? "text-emerald-700"
                                : "text-amber-700"
                            }`}
                          >
                            {answer.correct
                              ? "Correct! +15 XP earned"
                              : "Not quite right. +5 XP for trying"}
                          </span>
                        </div>

                        {/* Model Answer */}
                        <div className="mb-4 rounded-lg bg-surface-hover p-4">
                          <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                            <svg
                              className="h-4 w-4 text-primary"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342"
                              />
                            </svg>
                            Model Answer
                          </h4>
                          <p className="text-sm text-muted leading-relaxed">
                            {question.modelAnswer}
                          </p>
                        </div>

                        {/* Tip */}
                        <div className="mb-4 rounded-lg bg-indigo-50 border border-indigo-100 p-4">
                          <h4 className="text-sm font-semibold text-indigo-700 mb-1 flex items-center gap-2">
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
                                d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                              />
                            </svg>
                            Pro Tip
                          </h4>
                          <p className="text-sm text-indigo-600 leading-relaxed">
                            {question.tip}
                          </p>
                        </div>

                        {/* AI Analysis Button */}
                        {!aiAnalysis && (
                          <button
                            onClick={() => handleAiAnalysis(question)}
                            disabled={aiLoading}
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:opacity-60"
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
                                Analyzing...
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
                                Get AI Analysis
                              </>
                            )}
                          </button>
                        )}

                        {/* AI Analysis Content */}
                        {aiAnalysis && (
                          <div className="mt-3 rounded-lg border border-primary/20 bg-primary/5 p-4 fade-in">
                            <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
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
                              AI Analysis
                            </h4>
                            <div className="prose-content text-sm text-muted">
                              {aiAnalysis.split("\n").map((line, i) =>
                                line.trim() ? (
                                  <p key={i} className="mb-2 last:mb-0">
                                    {line}
                                  </p>
                                ) : null,
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Load More ── */}
      {visibleCount < filteredQuestions.length && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
            className="inline-flex items-center gap-2 bg-white border border-border text-foreground px-6 py-3 rounded-xl font-semibold text-sm hover:bg-surface-hover hover:border-primary-light transition-all duration-200"
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
                d="M12 4.5v15m0 0-6.75-6.75M12 19.5l6.75-6.75"
              />
            </svg>
            Load More ({Math.min(PAGE_SIZE, filteredQuestions.length - visibleCount)}{" "}
            more)
          </button>
          <p className="text-xs text-muted mt-2">
            {filteredQuestions.length - visibleCount} questions remaining
          </p>
        </div>
      )}

      {/* ── Footer ── */}
      <div className="mt-12 text-center text-sm text-muted pb-8">
        <p>
          Practice makes perfect. Keep going to build your PM interview muscle.
        </p>
      </div>
    </div>
  );
}
