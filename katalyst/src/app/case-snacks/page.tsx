"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { caseSnacks } from "@/data/case-snacks";
import type { CaseSnack } from "@/data/case-snacks";
import { getProgress, saveProgress, addXP } from "@/lib/storage";
import { askGemini } from "@/lib/gemini";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const CATEGORY_COLORS: Record<CaseSnack["category"], string> = {
  "AI Decision": "bg-purple-100 text-purple-700 border-purple-200",
  Growth: "bg-green-100 text-green-700 border-green-200",
  Pricing: "bg-amber-100 text-amber-700 border-amber-200",
  "Launch Strategy": "bg-blue-100 text-blue-700 border-blue-200",
  Pivot: "bg-red-100 text-red-700 border-red-200",
  "Feature Kill": "bg-slate-100 text-slate-700 border-slate-200",
};

const CATEGORY_CHIP_COLORS: Record<CaseSnack["category"], string> = {
  "AI Decision": "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
  Growth: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
  Pricing: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
  "Launch Strategy": "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
  Pivot: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
  "Feature Kill": "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100",
};

const CATEGORY_CHIP_ACTIVE: Record<CaseSnack["category"], string> = {
  "AI Decision": "bg-purple-600 text-white border-purple-600",
  Growth: "bg-green-600 text-white border-green-600",
  Pricing: "bg-amber-600 text-white border-amber-600",
  "Launch Strategy": "bg-blue-600 text-white border-blue-600",
  Pivot: "bg-red-600 text-white border-red-600",
  "Feature Kill": "bg-slate-600 text-white border-slate-600",
};

const OPTION_LABELS = ["A", "B", "C", "D"];

const XP_PER_SNACK = 15;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function CaseSnacksPage() {
  /* ---- state ---- */
  const [mounted, setMounted] = useState(false);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CaseSnack["category"] | null>(null);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  /* ---- derived: filtered cases ---- */
  const filteredCases = useMemo(() => {
    if (!activeCategory) return caseSnacks;
    return caseSnacks.filter((c) => c.category === activeCategory);
  }, [activeCategory]);

  const currentCase: CaseSnack | undefined = filteredCases[currentIndex];

  /* ---- all unique categories ---- */
  const categories = useMemo(() => {
    const cats = new Set(caseSnacks.map((c) => c.category));
    return Array.from(cats) as CaseSnack["category"][];
  }, []);

  /* ---- load progress ---- */
  useEffect(() => {
    const progress = getProgress();
    setCompletedIds(progress.caseSnacksCompleted ?? []);
    setMounted(true);
  }, []);

  /* ---- check if all cases are completed ---- */
  useEffect(() => {
    if (mounted && completedIds.length >= caseSnacks.length && caseSnacks.length > 0) {
      setShowSummary(true);
    }
  }, [mounted, completedIds]);

  /* ---- when current case changes, restore answered state ---- */
  useEffect(() => {
    if (!currentCase) return;
    if (completedIds.includes(currentCase.id)) {
      setHasAnswered(true);
      setSelectedIndex(null);
    } else {
      setHasAnswered(false);
      setSelectedIndex(null);
    }
    setAiExplanation(null);
    setAiLoading(false);
  }, [currentCase, completedIds]);

  /* ---- reset index when category filter changes ---- */
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeCategory]);

  /* ---- answer handler ---- */
  const handleSelect = useCallback(
    (index: number) => {
      if (hasAnswered || !currentCase) return;

      setSelectedIndex(index);
      setHasAnswered(true);

      // Mark completed if not already
      if (!completedIds.includes(currentCase.id)) {
        const updatedIds = [...completedIds, currentCase.id];
        setCompletedIds(updatedIds);
        addXP(XP_PER_SNACK);
        saveProgress({ caseSnacksCompleted: updatedIds });

        // Show summary if all done
        if (updatedIds.length >= caseSnacks.length) {
          setTimeout(() => setShowSummary(true), 800);
        }
      }
    },
    [hasAnswered, currentCase, completedIds],
  );

  /* ---- navigation ---- */
  const goNext = useCallback(() => {
    if (currentIndex < filteredCases.length - 1) {
      setDirection("left");
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setDirection(null);
      }, 150);
    }
  }, [currentIndex, filteredCases.length]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection("right");
      setTimeout(() => {
        setCurrentIndex((prev) => prev - 1);
        setDirection(null);
      }, 150);
    }
  }, [currentIndex]);

  /* ---- AI deep dive ---- */
  const handleAiDeepDive = useCallback(async () => {
    if (aiLoading || aiExplanation || !currentCase) return;
    setAiLoading(true);
    try {
      const prompt = `You are a senior product management coach. A PM trainee just completed this case snack:

Title: ${currentCase.title}
Category: ${currentCase.category}
Situation: ${currentCase.situation}
Correct Answer: ${currentCase.options[currentCase.correctIndex]}
What Actually Happened: ${currentCase.whatHappened}
PM Lesson: ${currentCase.pmLesson}

Provide a short, insightful "deep dive" (3-4 paragraphs) that:
1. Expands on why this decision mattered from a product strategy perspective
2. Gives a real-world parallel or similar situation from another company
3. Provides a concrete framework or mental model the PM can use in similar situations
4. Ends with a practical takeaway they can apply immediately

Keep the tone professional yet conversational. Be specific, not generic.`;
      const response = await askGemini(prompt);
      setAiExplanation(response);
    } catch {
      setAiExplanation(
        "Unable to load AI explanation right now. Please try again later.",
      );
    } finally {
      setAiLoading(false);
    }
  }, [aiLoading, aiExplanation, currentCase]);

  /* ---- skeleton / loading ---- */
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-2xl px-4">
          <div className="h-8 bg-[#e2e8f0] rounded w-1/3" />
          <div className="h-64 bg-[#e2e8f0] rounded-xl" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-12 bg-[#e2e8f0] rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ---- summary view when all cases completed ---- */
  if (showSummary && completedIds.length >= caseSnacks.length) {
    const totalXpEarned = completedIds.length * XP_PER_SNACK;
    const categoryCounts: Record<string, number> = {};
    for (const c of caseSnacks) {
      categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
    }

    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <div className="fade-in mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-[#e2e8f0] bg-white shadow-lg p-8 text-center">
            <div className="mb-6">
              <span className="text-7xl">🎉</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Congratulations!
            </h1>
            <p className="text-xl font-semibold text-[#6366f1] mb-2">
              You&apos;ve completed {completedIds.length}/{caseSnacks.length} cases!
            </p>
            <p className="text-[#64748b] mb-8">
              You&apos;ve worked through every case snack and earned a total of{" "}
              <span className="font-bold text-amber-600">{totalXpEarned} XP</span>.
            </p>

            {/* Category Breakdown */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#94a3b8] mb-4">
                Categories Mastered
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                {Object.entries(categoryCounts).map(([cat, count]) => (
                  <span
                    key={cat}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                      CATEGORY_COLORS[cat as CaseSnack["category"]] ?? "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {cat}
                    <span className="rounded-full bg-white/60 px-1.5 py-0.5 text-xs">
                      {count}
                    </span>
                  </span>
                ))}
              </div>
            </div>

            {/* Progress Bar - Full */}
            <div className="mb-8">
              <div className="h-3 w-full rounded-full bg-[#e2e8f0]">
                <div className="h-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500 w-full" />
              </div>
              <p className="mt-2 text-xs text-[#64748b]">100% Complete</p>
            </div>

            <button
              onClick={() => {
                setShowSummary(false);
                setCurrentIndex(0);
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-[#6366f1] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#4f46e5] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 focus:ring-offset-2"
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
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182"
                />
              </svg>
              Review Cases Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ---- no cases for current filter ---- */
  if (!currentCase) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🍿</p>
          <p className="text-lg font-semibold text-gray-900">No case snacks found</p>
          <p className="text-sm text-[#64748b] mt-1">Try removing the category filter.</p>
          {activeCategory && (
            <button
              onClick={() => setActiveCategory(null)}
              className="mt-4 rounded-lg bg-[#6366f1] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4f46e5] transition-colors"
            >
              Show All Cases
            </button>
          )}
        </div>
      </div>
    );
  }

  const totalCases = caseSnacks.length;
  const completedCount = completedIds.length;
  const isCurrentCompleted = completedIds.includes(currentCase.id);

  /* ---- render ---- */
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="fade-in mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        {/* -- Header -- */}
        <header className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-3xl">🍿</span>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Case Snacks
            </h1>
          </div>
          <p className="mt-1 text-[#64748b]">
            Bite-sized product cases you can solve in 2 minutes.
          </p>
        </header>

        {/* -- Stats Bar -- */}
        <div className="mb-6 flex items-center gap-4 rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
            <svg
              className="h-6 w-6 text-amber-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-[#64748b]">Progress</p>
            <p className="text-2xl font-bold text-gray-900">
              {completedCount}/{totalCases}{" "}
              <span className="text-base font-medium text-[#64748b]">snacks completed</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-[#64748b]">XP Earned</p>
            <p className="text-lg font-bold text-amber-600">
              +{completedCount * XP_PER_SNACK} XP
            </p>
          </div>
        </div>

        {/* -- Progress Bar -- */}
        <div className="mb-6">
          <div className="h-2 w-full rounded-full bg-[#e2e8f0]">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
              style={{ width: `${totalCases > 0 ? (completedCount / totalCases) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* -- Progress Dots -- */}
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {filteredCases.map((c, idx) => {
            const isCompleted = completedIds.includes(c.id);
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setDirection(idx > currentIndex ? "left" : "right");
                  setTimeout(() => {
                    setCurrentIndex(idx);
                    setDirection(null);
                  }, 150);
                }}
                className={`h-3 w-3 rounded-full transition-all duration-200 ${
                  isCurrent
                    ? "bg-[#6366f1] scale-125 ring-2 ring-[#6366f1]/30"
                    : isCompleted
                      ? "bg-emerald-400 hover:bg-emerald-500"
                      : "bg-[#e2e8f0] hover:bg-[#cbd5e1]"
                }`}
                title={`${c.title}${isCompleted ? " (completed)" : ""}`}
              />
            );
          })}
        </div>

        {/* -- Category Filter Chips -- */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
              activeCategory === null
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-600 border-[#e2e8f0] hover:bg-gray-50"
            }`}
          >
            All ({caseSnacks.length})
          </button>
          {categories.map((cat) => {
            const count = caseSnacks.filter((c) => c.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  activeCategory === cat
                    ? CATEGORY_CHIP_ACTIVE[cat]
                    : CATEGORY_CHIP_COLORS[cat]
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* -- Case Snack Card -- */}
        <section
          className={`card-hover rounded-2xl border border-[#e2e8f0] bg-white shadow-lg transition-all duration-300 ${
            direction === "left"
              ? "opacity-0 -translate-x-4"
              : direction === "right"
                ? "opacity-0 translate-x-4"
                : "opacity-100 translate-x-0"
          }`}
        >
          {/* Emoji + Title Header */}
          <div className="px-6 pt-8 pb-4 text-center">
            <div className="mb-4">
              <span className="text-6xl">{currentCase.emoji}</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              {currentCase.title}
            </h2>
            <span
              className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold ${CATEGORY_COLORS[currentCase.category]}`}
            >
              {currentCase.category}
            </span>
          </div>

          {/* Situation */}
          <div className="px-6 pb-4">
            <div className="rounded-lg bg-[#f8fafc] p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-2">
                The Situation
              </h3>
              <p className="text-sm leading-relaxed text-gray-700">
                {currentCase.situation}
              </p>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3 px-6 pb-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
              What would you do?
            </h3>
            {currentCase.options.map((option, idx) => {
              const isSelected = selectedIndex === idx;
              const isCorrect = idx === currentCase.correctIndex;

              let optionStyle =
                "border-[#e2e8f0] bg-white hover:border-[#6366f1] hover:bg-[#6366f1]/5 cursor-pointer";

              if (hasAnswered) {
                if (isCorrect) {
                  optionStyle =
                    "border-emerald-400 bg-emerald-50 ring-1 ring-emerald-400";
                } else if (isSelected && !isCorrect) {
                  optionStyle =
                    "border-rose-400 bg-rose-50 ring-1 ring-rose-400";
                } else {
                  optionStyle = "border-[#e2e8f0] bg-gray-50 opacity-60";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={hasAnswered}
                  className={`flex w-full items-center gap-3 rounded-lg border-2 px-4 py-3 text-left transition-all duration-200 ${optionStyle} disabled:cursor-default`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors duration-200 ${
                      hasAnswered && isCorrect
                        ? "bg-emerald-500 text-white"
                        : hasAnswered && isSelected && !isCorrect
                          ? "bg-rose-500 text-white"
                          : isSelected
                            ? "bg-[#6366f1] text-white"
                            : "bg-[#f1f5f9] text-[#64748b]"
                    }`}
                  >
                    {OPTION_LABELS[idx]}
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {option}
                  </span>

                  {/* Feedback icons */}
                  {hasAnswered && isCorrect && (
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
                  {hasAnswered && isSelected && !isCorrect && (
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

          {/* -- Post-Answer Section -- */}
          {hasAnswered && (
            <div className="border-t border-[#e2e8f0] px-6 py-6 fade-in">
              {/* XP Award (only for freshly answered, not previously completed) */}
              {selectedIndex !== null && (
                <div className="mb-4 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${
                      selectedIndex === currentCase.correctIndex
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
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
                        d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                      />
                    </svg>
                    {selectedIndex === currentCase.correctIndex
                      ? `+${XP_PER_SNACK} XP  --  Correct!`
                      : `+${XP_PER_SNACK} XP  --  Nice try!`}
                  </span>
                </div>
              )}

              {/* Already completed badge */}
              {selectedIndex === null && isCurrentCompleted && (
                <div className="mb-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#6366f1]/10 px-3 py-1 text-sm font-semibold text-[#6366f1]">
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
                        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                    Already Completed
                  </span>
                </div>
              )}

              {/* What Actually Happened */}
              <div className="rounded-lg bg-[#f8fafc] p-4 mb-4">
                <h3 className="mb-2 text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-[#64748b]"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  What Actually Happened
                </h3>
                <p className="text-sm leading-relaxed text-[#64748b]">
                  {currentCase.whatHappened}
                </p>
              </div>

              {/* PM Lesson */}
              <div className="rounded-lg border border-[#6366f1]/20 bg-[#6366f1]/5 p-4 mb-4">
                <h3 className="mb-2 text-sm font-semibold text-[#6366f1] flex items-center gap-2">
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
                  PM Lesson
                </h3>
                <p className="text-sm leading-relaxed text-[#6366f1]/80 font-medium">
                  {currentCase.pmLesson}
                </p>
              </div>

              {/* AI Deep Dive + Next Case */}
              <div className="flex flex-wrap items-center gap-3">
                {!aiExplanation && (
                  <button
                    onClick={handleAiDeepDive}
                    disabled={aiLoading}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#6366f1] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#4f46e5] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 focus:ring-offset-2 disabled:opacity-60"
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
                        Generating Deep Dive...
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
                        Get AI Deep Dive
                      </>
                    )}
                  </button>
                )}

                {currentIndex < filteredCases.length - 1 && (
                  <button
                    onClick={goNext}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#e2e8f0] bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50"
                  >
                    Next Case
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
                        d="m8.25 4.5 7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {aiExplanation && (
                <div className="mt-4 rounded-lg border border-[#6366f1]/20 bg-[#6366f1]/5 p-4 fade-in">
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#6366f1]">
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
                    AI Deep Dive
                  </h3>
                  <div className="prose prose-sm max-w-none text-[#64748b]">
                    {aiExplanation.split("\n").map((paragraph, i) =>
                      paragraph.trim() ? (
                        <p key={i} className="mb-2 last:mb-0">
                          {paragraph}
                        </p>
                      ) : null,
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* -- Navigation -- */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="inline-flex items-center gap-2 rounded-lg border border-[#e2e8f0] bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
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
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
            Previous
          </button>

          <span className="text-sm font-medium text-[#64748b]">
            {currentIndex + 1} / {filteredCases.length}
          </span>

          <button
            onClick={goNext}
            disabled={currentIndex >= filteredCases.length - 1}
            className="inline-flex items-center gap-2 rounded-lg border border-[#e2e8f0] bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
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
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </div>

        {/* -- Footer spacing -- */}
        <div className="h-16" />
      </div>
    </div>
  );
}
