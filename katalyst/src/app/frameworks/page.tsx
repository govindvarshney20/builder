"use client";

import { useState, useEffect, useCallback } from "react";
import { frameworks } from "@/data/frameworks";
import type { Framework } from "@/data/frameworks";
import { getProgress, saveProgress, addXP } from "@/lib/storage";
import { askGemini } from "@/lib/gemini";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const CATEGORIES = [
  "All",
  "Prioritization",
  "Discovery",
  "Strategy",
  "Analytics",
  "AI/ML",
  "Execution",
  "Growth",
] as const;

type Category = (typeof CATEGORIES)[number];

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  Prioritization: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    badge: "bg-purple-100 text-purple-700",
  },
  Discovery: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    badge: "bg-blue-100 text-blue-700",
  },
  Strategy: {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200",
    badge: "bg-indigo-100 text-indigo-700",
  },
  Analytics: {
    bg: "bg-teal-50",
    text: "text-teal-700",
    border: "border-teal-200",
    badge: "bg-teal-100 text-teal-700",
  },
  "AI/ML": {
    bg: "bg-pink-50",
    text: "text-pink-700",
    border: "border-pink-200",
    badge: "bg-pink-100 text-pink-700",
  },
  Execution: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    badge: "bg-green-100 text-green-700",
  },
  Growth: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    badge: "bg-amber-100 text-amber-700",
  },
};

const CATEGORY_CHIP_COLORS: Record<string, { active: string; inactive: string }> = {
  All: {
    active: "bg-gray-900 text-white",
    inactive: "bg-white text-gray-600 border-gray-200",
  },
  Prioritization: {
    active: "bg-purple-600 text-white",
    inactive: "bg-white text-purple-600 border-purple-200",
  },
  Discovery: {
    active: "bg-blue-600 text-white",
    inactive: "bg-white text-blue-600 border-blue-200",
  },
  Strategy: {
    active: "bg-indigo-600 text-white",
    inactive: "bg-white text-indigo-600 border-indigo-200",
  },
  Analytics: {
    active: "bg-teal-600 text-white",
    inactive: "bg-white text-teal-600 border-teal-200",
  },
  "AI/ML": {
    active: "bg-pink-600 text-white",
    inactive: "bg-white text-pink-600 border-pink-200",
  },
  Execution: {
    active: "bg-green-600 text-white",
    inactive: "bg-white text-green-600 border-green-200",
  },
  Growth: {
    active: "bg-amber-600 text-white",
    inactive: "bg-white text-amber-600 border-amber-200",
  },
};

const TOTAL_FRAMEWORKS = 20;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function FrameworksPage() {
  /* ---- state ---- */
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [exploredIds, setExploredIds] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  // "Apply this framework" state per framework
  const [applyInputs, setApplyInputs] = useState<Record<string, string>>({});
  const [applyResults, setApplyResults] = useState<Record<string, string>>({});
  const [applyLoading, setApplyLoading] = useState<Record<string, boolean>>({});

  /* ---- load progress ---- */
  useEffect(() => {
    const progress = getProgress();
    setExploredIds(progress.frameworksExplored || []);
    setMounted(true);
  }, []);

  /* ---- track exploration ---- */
  const markExplored = useCallback(
    (frameworkId: string) => {
      if (exploredIds.includes(frameworkId)) return;

      const updated = [...exploredIds, frameworkId];
      setExploredIds(updated);
      saveProgress({ frameworksExplored: updated });
      addXP(10);
    },
    [exploredIds],
  );

  /* ---- toggle expand ---- */
  const toggleExpand = useCallback(
    (framework: Framework) => {
      if (expandedId === framework.id) {
        setExpandedId(null);
      } else {
        setExpandedId(framework.id);
        markExplored(framework.id);
      }
    },
    [expandedId, markExplored],
  );

  /* ---- apply framework ---- */
  const handleApply = useCallback(
    async (framework: Framework) => {
      const productName = applyInputs[framework.id]?.trim();
      if (!productName || applyLoading[framework.id]) return;

      setApplyLoading((prev) => ({ ...prev, [framework.id]: true }));

      try {
        const prompt = `You are an expert product management coach. Apply the "${framework.name}" framework to the product "${productName}".

Framework description: ${framework.description}
Steps: ${framework.steps.join(" | ")}

Provide a practical, specific application of this framework to "${productName}". For each step of the framework, give a concrete example of how it would apply. Keep it concise but actionable (about 3-5 paragraphs). Use real-world context about the product if you know it, otherwise make reasonable assumptions.`;

        const response = await askGemini(prompt);
        setApplyResults((prev) => ({ ...prev, [framework.id]: response }));
      } catch {
        setApplyResults((prev) => ({
          ...prev,
          [framework.id]:
            "Unable to generate the framework application right now. Please try again later.",
        }));
      } finally {
        setApplyLoading((prev) => ({ ...prev, [framework.id]: false }));
      }
    },
    [applyInputs, applyLoading],
  );

  /* ---- filtering ---- */
  const filteredFrameworks = frameworks.filter((f) => {
    const matchesCategory =
      activeCategory === "All" || f.category === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  /* ---- loading skeleton ---- */
  if (!mounted) {
    return (
      <div className="fade-in">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[#e2e8f0] rounded w-1/3" />
          <div className="h-4 bg-[#e2e8f0] rounded w-2/3" />
          <div className="flex gap-2 mt-6">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="h-9 w-24 bg-[#e2e8f0] rounded-full" />
            ))}
          </div>
          <div className="h-11 bg-[#e2e8f0] rounded-lg mt-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-40 bg-[#e2e8f0] rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const exploredCount = exploredIds.length;

  return (
    <div className="fade-in">
      {/* ── Header ── */}
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              PM Framework Library
            </h1>
            <p className="mt-1 text-[#64748b]">
              20 essential frameworks with AI applications. Explore, learn, and
              apply.
            </p>
          </div>
          {/* Progress badge */}
          <div className="flex items-center gap-2 bg-white border border-border rounded-lg px-4 py-2.5 shadow-sm shrink-0">
            <svg
              className="h-5 w-5 text-[#6366f1]"
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
            <span className="text-sm font-semibold text-foreground">
              {exploredCount}/{TOTAL_FRAMEWORKS} frameworks explored
            </span>
            <div className="w-24 h-2 bg-gray-100 rounded-full ml-2">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-[#6366f1] to-[#06b6d4] transition-all duration-500"
                style={{
                  width: `${Math.min((exploredCount / TOTAL_FRAMEWORKS) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* ── Category Filters ── */}
      <div className="flex flex-wrap gap-2 mb-4">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          const colors = CATEGORY_CHIP_COLORS[cat];
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                isActive ? colors.active : colors.inactive
              } hover:shadow-sm`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* ── Search Bar ── */}
      <div className="relative mb-6">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94a3b8]"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search frameworks by name or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#e2e8f0] bg-white text-sm text-gray-900 placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/30 focus:border-[#6366f1] transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-gray-600 transition-colors"
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
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* ── Results Count ── */}
      {(activeCategory !== "All" || searchQuery) && (
        <p className="text-sm text-[#64748b] mb-4">
          Showing {filteredFrameworks.length} framework
          {filteredFrameworks.length !== 1 ? "s" : ""}
          {activeCategory !== "All" && (
            <span> in <span className="font-medium">{activeCategory}</span></span>
          )}
          {searchQuery && (
            <span>
              {" "}
              matching &ldquo;<span className="font-medium">{searchQuery}</span>&rdquo;
            </span>
          )}
        </p>
      )}

      {/* ── Framework Grid / Accordion ── */}
      {filteredFrameworks.length === 0 ? (
        <div className="text-center py-16">
          <svg
            className="mx-auto h-12 w-12 text-[#cbd5e1]"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <p className="mt-4 text-[#64748b] font-medium">
            No frameworks found matching your filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("All");
            }}
            className="mt-2 text-sm text-[#6366f1] hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFrameworks.map((framework) => {
            const isExpanded = expandedId === framework.id;
            const isExplored = exploredIds.includes(framework.id);
            const colors = CATEGORY_COLORS[framework.category];

            return (
              <div
                key={framework.id}
                className={`${
                  isExpanded
                    ? "sm:col-span-2 lg:col-span-3"
                    : ""
                } transition-all duration-300`}
              >
                <div
                  className={`bg-white border rounded-xl shadow-sm transition-all duration-300 ${
                    isExpanded
                      ? `${colors.border} ring-1 ring-opacity-50 ${colors.border}`
                      : "border-[#e2e8f0] card-hover"
                  }`}
                >
                  {/* Card Header (always visible) */}
                  <button
                    onClick={() => toggleExpand(framework)}
                    className="w-full text-left p-5 focus:outline-none"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors.badge}`}
                          >
                            {framework.category}
                          </span>
                          {isExplored && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600">
                              <svg
                                className="h-3 w-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2.5}
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m4.5 12.75 6 6 9-13.5"
                                />
                              </svg>
                              Explored
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {framework.name}
                        </h3>
                        <p className="text-sm text-[#64748b] leading-relaxed line-clamp-2">
                          {framework.description}
                        </p>
                      </div>
                      <svg
                        className={`h-5 w-5 text-[#94a3b8] shrink-0 mt-1 transition-transform duration-300 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
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
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="border-t border-[#e2e8f0] px-5 pb-6 pt-5 fade-in">
                      {/* Full Description */}
                      <p className="text-sm text-gray-700 leading-relaxed mb-6">
                        {framework.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {/* When to Use */}
                        <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <svg
                              className="h-5 w-5 text-emerald-600"
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
                            <h4 className="text-sm font-semibold text-emerald-800">
                              When to Use
                            </h4>
                          </div>
                          <p className="text-sm text-emerald-700 leading-relaxed">
                            {framework.whenToUse}
                          </p>
                        </div>

                        {/* When NOT to Use */}
                        <div className="rounded-lg bg-rose-50 border border-rose-100 p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <svg
                              className="h-5 w-5 text-rose-600"
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
                            <h4 className="text-sm font-semibold text-rose-800">
                              When NOT to Use
                            </h4>
                          </div>
                          <p className="text-sm text-rose-700 leading-relaxed">
                            {framework.whenNotToUse}
                          </p>
                        </div>
                      </div>

                      {/* Steps */}
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">
                          Steps
                        </h4>
                        <div className="relative pl-4 border-l-[3px] border-gradient">
                          <div
                            className="absolute left-0 top-0 bottom-0 w-[3px] -ml-[3px] rounded-full"
                            style={{
                              background:
                                "linear-gradient(to bottom, #6366f1, #06b6d4)",
                            }}
                          />
                          <ol className="space-y-3">
                            {framework.steps.map((step, idx) => (
                              <li key={idx} className="flex gap-3">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#6366f1]/10 text-xs font-bold text-[#6366f1]">
                                  {idx + 1}
                                </span>
                                <span className="text-sm text-gray-700 leading-relaxed pt-0.5">
                                  {step}
                                </span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>

                      {/* Real-World Example */}
                      <div className="mb-6 rounded-lg bg-amber-50 border border-amber-100 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <svg
                            className="h-5 w-5 text-amber-600"
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
                          <h4 className="text-sm font-semibold text-amber-800">
                            Real-World Example
                          </h4>
                        </div>
                        <p className="text-sm text-amber-800 leading-relaxed">
                          {framework.example}
                        </p>
                      </div>

                      {/* AI Application */}
                      <div className="mb-6 rounded-lg bg-[#6366f1]/5 border border-[#6366f1]/15 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <svg
                            className="h-5 w-5 text-[#6366f1]"
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
                          <h4 className="text-sm font-semibold text-[#6366f1]">
                            AI Application
                          </h4>
                        </div>
                        <p className="text-sm text-[#4f46e5] leading-relaxed">
                          {framework.aiAngle}
                        </p>
                      </div>

                      {/* Apply This Framework */}
                      <div className="rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">
                          Apply This Framework
                        </h4>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            placeholder="Enter a product name (e.g., Spotify, ChatGPT)"
                            value={applyInputs[framework.id] || ""}
                            onChange={(e) =>
                              setApplyInputs((prev) => ({
                                ...prev,
                                [framework.id]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleApply(framework);
                            }}
                            className="flex-1 px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white text-sm text-gray-900 placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/30 focus:border-[#6366f1] transition-all"
                          />
                          <button
                            onClick={() => handleApply(framework)}
                            disabled={
                              applyLoading[framework.id] ||
                              !applyInputs[framework.id]?.trim()
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#6366f1] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#4f46e5] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                          >
                            {applyLoading[framework.id] ? (
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
                                Generating...
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
                                Apply
                              </>
                            )}
                          </button>
                        </div>

                        {/* AI-generated result */}
                        {applyResults[framework.id] && (
                          <div className="mt-4 rounded-lg border border-[#6366f1]/20 bg-white p-4 fade-in">
                            <h5 className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#6366f1]">
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
                              {framework.name} applied to{" "}
                              {applyInputs[framework.id]}
                            </h5>
                            <div className="prose-content text-sm text-[#64748b]">
                              {applyResults[framework.id]
                                .split("\n")
                                .map((paragraph, i) =>
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
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Footer spacing ── */}
      <div className="h-16" />
    </div>
  );
}
