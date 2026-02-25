"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { glossaryTerms } from "@/data/glossary";
import type { GlossaryTerm } from "@/data/glossary";
import { getProgress, saveProgress } from "@/lib/storage";
import { askGemini } from "@/lib/gemini";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const CATEGORIES = [
  "PM Core",
  "AI/ML",
  "Analytics",
  "Strategy",
  "Technical",
  "Growth",
  "Design",
] as const;

const CATEGORY_COLORS: Record<string, string> = {
  "PM Core": "bg-indigo-100 text-indigo-700",
  "AI/ML": "bg-purple-100 text-purple-700",
  Analytics: "bg-teal-100 text-teal-700",
  Strategy: "bg-blue-100 text-blue-700",
  Technical: "bg-slate-100 text-slate-700",
  Growth: "bg-amber-100 text-amber-700",
  Design: "bg-pink-100 text-pink-700",
};

const CATEGORY_BORDER_COLORS: Record<string, string> = {
  "PM Core": "border-indigo-200",
  "AI/ML": "border-purple-200",
  Analytics: "border-teal-200",
  Strategy: "border-blue-200",
  Technical: "border-slate-200",
  Growth: "border-amber-200",
  Design: "border-pink-200",
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Deterministic "Term of the Day" index based on today's date. */
function getTermOfTheDayIndex(total: number): number {
  const d = new Date();
  const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) | 0;
  }
  return ((hash % total) + total) % total;
}

/** Group terms alphabetically by first letter. */
function groupByLetter(terms: GlossaryTerm[]): Record<string, GlossaryTerm[]> {
  const groups: Record<string, GlossaryTerm[]> = {};
  for (const term of terms) {
    const letter = term.term[0].toUpperCase();
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(term);
  }
  // Sort terms within each group
  for (const letter of Object.keys(groups)) {
    groups[letter].sort((a, b) => a.term.localeCompare(b.term));
  }
  return groups;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function GlossaryPage() {
  /* ---- state ---- */
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [bookmarkedTerms, setBookmarkedTerms] = useState<string[]>([]);
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const [aiExplanations, setAiExplanations] = useState<Record<string, string>>({});
  const [aiLoadingMap, setAiLoadingMap] = useState<Record<string, boolean>>({});

  const letterRefs = useRef<Record<string, HTMLDivElement | null>>({});

  /* ---- load progress ---- */
  useEffect(() => {
    const progress = getProgress();
    setBookmarkedTerms(progress.bookmarkedTerms || []);
    setMounted(true);
  }, []);

  /* ---- derived values ---- */
  const termOfTheDay = useMemo(() => {
    if (glossaryTerms.length === 0) return null;
    return glossaryTerms[getTermOfTheDayIndex(glossaryTerms.length)];
  }, []);

  const filteredTerms = useMemo(() => {
    return glossaryTerms.filter((term) => {
      // Search filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          term.term.toLowerCase().includes(q) ||
          term.definition.toLowerCase().includes(q) ||
          term.category.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }
      // Category filter
      if (activeCategory !== "All" && term.category !== activeCategory) return false;
      // Bookmarked filter
      if (showBookmarkedOnly && !bookmarkedTerms.includes(term.id)) return false;
      return true;
    });
  }, [searchQuery, activeCategory, showBookmarkedOnly, bookmarkedTerms]);

  const groupedTerms = useMemo(() => groupByLetter(filteredTerms), [filteredTerms]);

  const sortedLetters = useMemo(
    () => Object.keys(groupedTerms).sort(),
    [groupedTerms],
  );

  /* ---- handlers ---- */
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

  const toggleBookmark = useCallback(
    (termId: string) => {
      setBookmarkedTerms((prev) => {
        const updated = prev.includes(termId)
          ? prev.filter((id) => id !== termId)
          : [...prev, termId];
        saveProgress({ bookmarkedTerms: updated });
        return updated;
      });
    },
    [],
  );

  const handleAiExplain = useCallback(
    async (term: GlossaryTerm) => {
      if (aiLoadingMap[term.id] || aiExplanations[term.id]) return;

      setAiLoadingMap((prev) => ({ ...prev, [term.id]: true }));

      try {
        const prompt = `You are a Product Management expert and coach. A PM student wants to understand the term "${term.term}" more deeply.

Current definition: ${term.definition}
Category: ${term.category}
Example: ${term.example}
Why PMs Care: ${term.whyPMsCare}

Provide a deeper explanation that includes:
1. A simple analogy to make the concept click
2. How this applies in day-to-day PM work with a concrete scenario
3. Common mistakes or misconceptions about this term
4. How it relates to other PM concepts

Keep it concise (3-4 short paragraphs), conversational, and actionable. Use markdown formatting.`;

        const response = await askGemini(prompt);
        setAiExplanations((prev) => ({ ...prev, [term.id]: response }));
      } catch {
        setAiExplanations((prev) => ({
          ...prev,
          [term.id]: "Unable to generate AI explanation right now. Please try again later.",
        }));
      } finally {
        setAiLoadingMap((prev) => ({ ...prev, [term.id]: false }));
      }
    },
    [aiLoadingMap, aiExplanations],
  );

  const scrollToLetter = useCallback((letter: string) => {
    const el = letterRefs.current[letter];
    if (el) {
      const offset = 140; // account for sticky header
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  /* ---- loading state ---- */
  if (!mounted) {
    return (
      <div className="fade-in">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[#e2e8f0] rounded w-1/3" />
          <div className="h-4 bg-[#e2e8f0] rounded w-2/3" />
          <div className="h-12 bg-[#e2e8f0] rounded" />
          <div className="space-y-4 mt-6">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="h-20 bg-[#e2e8f0] rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ---- render ---- */
  return (
    <div className="fade-in">
      {/* ── Header ── */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
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
                d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              PM Glossary
            </h1>
          </div>
        </div>
        <p className="text-muted mt-1">
          Master the language of Product Management. Search, explore, and bookmark key terms.
        </p>
      </div>

      {/* ── Stats Bar ── */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2 bg-white border border-border rounded-lg px-4 py-2">
          <svg
            className="h-4 w-4 text-indigo-500"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
            />
          </svg>
          <span className="text-sm font-semibold text-foreground">
            {glossaryTerms.length}+ terms
          </span>
        </div>

        <div className="flex items-center gap-2 bg-white border border-border rounded-lg px-4 py-2">
          <svg
            className="h-4 w-4 text-amber-500"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
            />
          </svg>
          <span className="text-sm font-semibold text-foreground">
            {bookmarkedTerms.length} bookmarked
          </span>
        </div>

        {/* Bookmarked toggle */}
        <button
          onClick={() => setShowBookmarkedOnly((prev) => !prev)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
            showBookmarkedOnly
              ? "bg-amber-50 border-amber-300 text-amber-700"
              : "bg-white border-border text-muted hover:border-primary-light hover:text-foreground"
          }`}
        >
          <svg
            className="h-4 w-4"
            fill={showBookmarkedOnly ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
            />
          </svg>
          {showBookmarkedOnly ? "Show All" : "Bookmarked Only"}
        </button>
      </div>

      {/* ── Sticky Search Bar ── */}
      <div className="sticky top-0 z-20 bg-[#f8fafc] pb-3 pt-1 -mx-1 px-1">
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted"
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
            placeholder="Search terms, definitions, or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-border rounded-xl text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary-light transition-all duration-200 shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
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
      </div>

      {/* ── Category Filter Chips ── */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setActiveCategory("All")}
          className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-200 ${
            activeCategory === "All"
              ? "bg-primary text-white border-primary"
              : "bg-white text-muted border-border hover:border-primary-light hover:text-foreground"
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(activeCategory === cat ? "All" : cat)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-200 ${
              activeCategory === cat
                ? "bg-primary text-white border-primary"
                : `${CATEGORY_COLORS[cat]} ${CATEGORY_BORDER_COLORS[cat]} hover:border-primary-light`
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Alphabet Quick-Jump Bar ── */}
      <div className="flex flex-wrap gap-1 mb-6 bg-white border border-border rounded-xl p-2">
        {ALPHABET.map((letter) => {
          const hasTerms = !!groupedTerms[letter];
          return (
            <button
              key={letter}
              onClick={() => hasTerms && scrollToLetter(letter)}
              disabled={!hasTerms}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-all duration-150 ${
                hasTerms
                  ? "text-foreground hover:bg-primary hover:text-white cursor-pointer"
                  : "text-muted/30 cursor-default"
              }`}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {/* ── Term of the Day ── */}
      {termOfTheDay && !searchQuery && activeCategory === "All" && !showBookmarkedOnly && (
        <div className="mb-8 rounded-xl border-2 border-primary/30 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <svg
              className="h-5 w-5 text-primary"
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
            <span className="text-sm font-bold text-primary">Term of the Day</span>
            <span
              className={`ml-auto text-xs font-semibold px-2.5 py-0.5 rounded-full ${CATEGORY_COLORS[termOfTheDay.category]}`}
            >
              {termOfTheDay.category}
            </span>
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            {termOfTheDay.term}
          </h3>
          <p className="text-sm text-muted leading-relaxed mb-3">
            {termOfTheDay.definition}
          </p>
          <div className="rounded-lg bg-white/70 border border-border/50 p-3 mb-3">
            <h4 className="text-xs font-semibold text-foreground mb-1">Example</h4>
            <p className="text-sm text-muted leading-relaxed">
              {termOfTheDay.example}
            </p>
          </div>
          <div className="rounded-lg bg-primary/5 border border-primary/10 p-3">
            <h4 className="text-xs font-semibold text-primary mb-1">
              Why PMs Care
            </h4>
            <p className="text-sm text-primary/80 leading-relaxed">
              {termOfTheDay.whyPMsCare}
            </p>
          </div>
        </div>
      )}

      {/* ── Terms List (Grouped Alphabetically) ── */}
      {filteredTerms.length === 0 ? (
        <div className="bg-white border border-border rounded-xl p-12 text-center">
          <svg
            className="h-12 w-12 text-muted/30 mx-auto mb-3"
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
          <h3 className="text-lg font-semibold text-foreground mb-1">
            No terms found
          </h3>
          <p className="text-sm text-muted mb-4">
            Try adjusting your search or filters to find what you&apos;re looking for.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("All");
              setShowBookmarkedOnly(false);
            }}
            className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {sortedLetters.map((letter) => (
            <div
              key={letter}
              ref={(el) => {
                letterRefs.current[letter] = el;
              }}
            >
              {/* Letter heading */}
              <div className="flex items-center gap-3 mb-3">
                <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 text-primary font-bold text-lg">
                  {letter}
                </span>
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted">
                  {groupedTerms[letter].length} term{groupedTerms[letter].length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Term cards */}
              <div className="space-y-3">
                {groupedTerms[letter].map((term) => {
                  const isExpanded = expandedCards.has(term.id);
                  const isBookmarked = bookmarkedTerms.includes(term.id);
                  const aiExplanation = aiExplanations[term.id];
                  const aiLoading = aiLoadingMap[term.id] ?? false;

                  return (
                    <div
                      key={term.id}
                      className="bg-white border border-border rounded-xl overflow-hidden transition-shadow duration-200 hover:shadow-md"
                    >
                      {/* Collapsed header */}
                      <button
                        onClick={() => toggleCard(term.id)}
                        className="w-full px-5 py-4 flex items-center gap-3 text-left"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm font-semibold text-foreground">
                              {term.term}
                            </h3>
                            <span
                              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${CATEGORY_COLORS[term.category]}`}
                            >
                              {term.category}
                            </span>
                          </div>
                        </div>

                        {/* Bookmark button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(term.id);
                          }}
                          className={`flex-shrink-0 p-1.5 rounded-lg transition-all duration-200 ${
                            isBookmarked
                              ? "text-amber-500 hover:text-amber-600"
                              : "text-muted/40 hover:text-muted"
                          }`}
                          title={isBookmarked ? "Remove bookmark" : "Bookmark term"}
                        >
                          <svg
                            className="h-5 w-5"
                            fill={isBookmarked ? "currentColor" : "none"}
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                            />
                          </svg>
                        </button>

                        {/* Expand/collapse chevron */}
                        <svg
                          className={`h-4 w-4 flex-shrink-0 text-muted transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
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

                      {/* Expanded content */}
                      {isExpanded && (
                        <div className="px-5 pb-5 border-t border-border/60 pt-4 fade-in">
                          {/* Definition */}
                          <div className="mb-4">
                            <h4 className="text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wider">
                              Definition
                            </h4>
                            <p className="text-sm text-muted leading-relaxed">
                              {term.definition}
                            </p>
                          </div>

                          {/* Example */}
                          <div className="mb-4 rounded-lg bg-surface-hover p-4">
                            <h4 className="text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                              <svg
                                className="h-3.5 w-3.5 text-primary"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.671 1.09-.085 2.17-.207 3.238-.364 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                                />
                              </svg>
                              Example
                            </h4>
                            <p className="text-sm text-muted leading-relaxed">
                              {term.example}
                            </p>
                          </div>

                          {/* Why PMs Care */}
                          <div className="mb-4 rounded-lg bg-indigo-50 border border-indigo-100 p-4">
                            <h4 className="text-xs font-semibold text-indigo-700 mb-1.5 flex items-center gap-1.5">
                              <svg
                                className="h-3.5 w-3.5"
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
                              Why PMs Care
                            </h4>
                            <p className="text-sm text-indigo-600 leading-relaxed">
                              {term.whyPMsCare}
                            </p>
                          </div>

                          {/* AI Explain Button */}
                          {!aiExplanation && (
                            <button
                              onClick={() => handleAiExplain(term)}
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
                                  Explaining...
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
                                  Explain more with AI
                                </>
                              )}
                            </button>
                          )}

                          {/* AI Explanation Content */}
                          {aiExplanation && (
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
                                AI Explanation
                              </h4>
                              <div className="prose-content text-sm text-muted">
                                {aiExplanation.split("\n").map((line, i) =>
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
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Footer ── */}
      <div className="mt-12 text-center text-sm text-muted pb-8">
        <p>
          Knowledge is your PM superpower. Keep exploring and bookmarking terms.
        </p>
      </div>
    </div>
  );
}
