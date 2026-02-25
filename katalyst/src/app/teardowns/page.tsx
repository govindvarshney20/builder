"use client";

import { useState, useEffect, useCallback } from "react";
import { teardowns } from "@/data/teardowns";
import type { Teardown } from "@/data/teardowns";
import { getProgress, saveProgress, addXP } from "@/lib/storage";
import { askGemini } from "@/lib/gemini";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const CATEGORIES: Teardown["category"][] = [
  "AI Product",
  "Fintech",
  "E-commerce",
  "SaaS",
  "Consumer",
  "Platform",
];

const CATEGORY_GRADIENT: Record<Teardown["category"], string> = {
  "AI Product": "from-purple-500 to-indigo-600",
  Fintech: "from-emerald-500 to-teal-600",
  "E-commerce": "from-amber-500 to-orange-600",
  SaaS: "from-blue-500 to-cyan-600",
  Consumer: "from-pink-500 to-rose-600",
  Platform: "from-violet-500 to-fuchsia-600",
};

const CATEGORY_BG: Record<Teardown["category"], string> = {
  "AI Product": "bg-purple-100 text-purple-700",
  Fintech: "bg-emerald-100 text-emerald-700",
  "E-commerce": "bg-amber-100 text-amber-700",
  SaaS: "bg-blue-100 text-blue-700",
  Consumer: "bg-pink-100 text-pink-700",
  Platform: "bg-violet-100 text-violet-700",
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function TeardownsPage() {
  /* ---- state ---- */
  const [mounted, setMounted] = useState(false);
  const [activeFilter, setActiveFilter] = useState<Teardown["category"] | "All">("All");
  const [selectedTeardown, setSelectedTeardown] = useState<Teardown | null>(null);
  const [readIds, setReadIds] = useState<string[]>([]);

  // Decision point answers: teardownId -> questionIndex -> selectedOptionIndex
  const [answers, setAnswers] = useState<Record<string, Record<number, number>>>({});

  // AI What-If
  const [whatIfInput, setWhatIfInput] = useState("");
  const [whatIfResponse, setWhatIfResponse] = useState<string | null>(null);
  const [whatIfLoading, setWhatIfLoading] = useState(false);

  /* ---- load progress ---- */
  useEffect(() => {
    const progress = getProgress();
    setReadIds(progress.teardownsRead ?? []);
    setMounted(true);
  }, []);

  /* ---- mark teardown as read ---- */
  const openTeardown = useCallback(
    (teardown: Teardown) => {
      setSelectedTeardown(teardown);
      setWhatIfInput("");
      setWhatIfResponse(null);
      setWhatIfLoading(false);

      if (!readIds.includes(teardown.id)) {
        const updatedIds = [...readIds, teardown.id];
        setReadIds(updatedIds);
        saveProgress({ teardownsRead: updatedIds });
        addXP(15);
      }

      // Scroll to top when opening teardown detail
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [readIds],
  );

  /* ---- go back to grid ---- */
  const goBack = useCallback(() => {
    setSelectedTeardown(null);
    setWhatIfInput("");
    setWhatIfResponse(null);
    setWhatIfLoading(false);
  }, []);

  /* ---- answer a decision point MCQ ---- */
  const handleAnswer = useCallback(
    (teardownId: string, questionIndex: number, optionIndex: number) => {
      setAnswers((prev) => ({
        ...prev,
        [teardownId]: {
          ...prev[teardownId],
          [questionIndex]: optionIndex,
        },
      }));
    },
    [],
  );

  /* ---- AI What-If ---- */
  const handleWhatIf = useCallback(async () => {
    if (!selectedTeardown || whatIfLoading || !whatIfInput.trim()) return;
    setWhatIfLoading(true);
    setWhatIfResponse(null);
    try {
      const prompt = `You are a senior product management analyst. The user is studying a product teardown and wants to explore an alternate scenario.

Product: ${selectedTeardown.product} by ${selectedTeardown.company}
What they built: ${selectedTeardown.whatTheyBuilt}
Why it worked: ${selectedTeardown.whyItWorked.join("; ")}
AI Angle: ${selectedTeardown.aiAngle}

The user asks: "${whatIfInput}"

Provide a thoughtful, concise analysis (3-4 paragraphs) of this alternate scenario. Consider market dynamics, user behavior, competitive landscape, and product strategy. Be specific and insightful.`;

      const response = await askGemini(prompt);
      setWhatIfResponse(response);
    } catch {
      setWhatIfResponse("Unable to generate analysis right now. Please try again later.");
    } finally {
      setWhatIfLoading(false);
    }
  }, [selectedTeardown, whatIfLoading, whatIfInput]);

  /* ---- filtering ---- */
  const filteredTeardowns =
    activeFilter === "All"
      ? teardowns
      : teardowns.filter((t) => t.category === activeFilter);

  /* ---- skeleton / loading ---- */
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-4xl px-4">
          <div className="h-8 bg-[#e2e8f0] rounded w-1/3" />
          <div className="h-4 bg-[#e2e8f0] rounded w-1/2" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 bg-[#e2e8f0] rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ================================================================ */
  /*  DETAIL VIEW                                                      */
  /* ================================================================ */

  if (selectedTeardown) {
    const td = selectedTeardown;
    const tdAnswers = answers[td.id] ?? {};

    return (
      <div className="fade-in">
        {/* Back button */}
        <button
          onClick={goBack}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#64748b] hover:text-[#6366f1] transition-colors"
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
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
          Back to Teardowns
        </button>

        {/* ── Header ── */}
        <div className="rounded-2xl bg-white border border-[#e2e8f0] shadow-sm overflow-hidden mb-8">
          <div className={`bg-gradient-to-r ${CATEGORY_GRADIENT[td.category]} px-8 py-10 text-white`}>
            <div className="flex items-center gap-5">
              <span className="text-6xl">{td.logo}</span>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-3xl font-bold">{td.product}</h1>
                  <span className="rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-semibold">
                    {td.category}
                  </span>
                </div>
                <p className="text-lg text-white/90">{td.company}</p>
                <p className="mt-1 text-white/75 text-sm">{td.tagline}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── What They Built ── */}
        <section className="mb-8 rounded-xl bg-white border border-[#e2e8f0] shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <svg className="h-5 w-5 text-[#6366f1]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21" />
            </svg>
            What They Built
          </h2>
          <p className="text-[#64748b] leading-relaxed">{td.whatTheyBuilt}</p>
        </section>

        {/* ── Why It Worked ── */}
        <section className="mb-8 rounded-xl bg-white border border-[#e2e8f0] shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            Why It Worked
          </h2>
          <ul className="space-y-3">
            {td.whyItWorked.map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold">
                  {i + 1}
                </span>
                <span className="text-[#64748b] leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── PM Lessons ── */}
        <section className="mb-8 rounded-xl bg-white border border-[#e2e8f0] shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
            </svg>
            PM Lessons
          </h2>
          <div className="space-y-3">
            {td.pmLessons.map((lesson, i) => (
              <div
                key={i}
                className="flex items-start gap-4 border-l-4 border-[#6366f1] bg-[#6366f1]/5 rounded-r-lg px-4 py-3"
              >
                <span className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-[#6366f1] text-white text-xs font-bold">
                  {i + 1}
                </span>
                <p className="text-gray-700 leading-relaxed text-sm">{lesson}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── AI Angle ── */}
        <section className="mb-8 rounded-xl bg-gradient-to-br from-[#6366f1]/5 to-[#06b6d4]/5 border border-[#6366f1]/20 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <svg className="h-5 w-5 text-[#6366f1]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
            AI Angle
          </h2>
          <p className="text-[#64748b] leading-relaxed">{td.aiAngle}</p>
        </section>

        {/* ── Metrics ── */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="h-5 w-5 text-cyan-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
            </svg>
            Key Metrics
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {td.metrics.map((metric, i) => (
              <div
                key={i}
                className="rounded-xl bg-white border border-[#e2e8f0] shadow-sm p-4 text-center card-hover"
              >
                <p className="text-2xl font-bold text-[#6366f1]">{metric.value}</p>
                <p className="text-xs text-[#64748b] mt-1 font-medium">{metric.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Decision Points ── */}
        {td.decisionPoints.length > 0 && (
          <section className="mb-8 rounded-xl bg-white border border-[#e2e8f0] shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
              <svg className="h-5 w-5 text-rose-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
              </svg>
              Decision Points
            </h2>
            <div className="space-y-6">
              {td.decisionPoints.map((dp, qIdx) => {
                const selectedOption = tdAnswers[qIdx];
                const hasAnswered = selectedOption !== undefined;
                const isCorrect = selectedOption === dp.correctIndex;

                return (
                  <div key={qIdx} className="rounded-lg border border-[#e2e8f0] p-5">
                    <p className="font-semibold text-gray-900 mb-3">{dp.question}</p>
                    <div className="space-y-2">
                      {dp.options.map((option, oIdx) => {
                        let optionStyle =
                          "border-[#e2e8f0] bg-white hover:border-[#6366f1] hover:bg-[#6366f1]/5 cursor-pointer";

                        if (hasAnswered) {
                          if (oIdx === dp.correctIndex) {
                            optionStyle = "border-emerald-400 bg-emerald-50 ring-1 ring-emerald-400";
                          } else if (oIdx === selectedOption && !isCorrect) {
                            optionStyle = "border-rose-400 bg-rose-50 ring-1 ring-rose-400";
                          } else {
                            optionStyle = "border-[#e2e8f0] bg-gray-50 opacity-60";
                          }
                        }

                        return (
                          <button
                            key={oIdx}
                            onClick={() => !hasAnswered && handleAnswer(td.id, qIdx, oIdx)}
                            disabled={hasAnswered}
                            className={`flex w-full items-center gap-3 rounded-lg border-2 px-4 py-3 text-left text-sm transition-all duration-200 ${optionStyle} disabled:cursor-default`}
                          >
                            <span
                              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                                hasAnswered && oIdx === dp.correctIndex
                                  ? "bg-emerald-500 text-white"
                                  : hasAnswered && oIdx === selectedOption && !isCorrect
                                    ? "bg-rose-500 text-white"
                                    : "bg-[#f1f5f9] text-[#64748b]"
                              }`}
                            >
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span className="text-gray-800 font-medium">{option}</span>

                            {hasAnswered && oIdx === dp.correctIndex && (
                              <svg className="ml-auto h-5 w-5 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                              </svg>
                            )}
                            {hasAnswered && oIdx === selectedOption && !isCorrect && (
                              <svg className="ml-auto h-5 w-5 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                              </svg>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation after answering */}
                    {hasAnswered && (
                      <div className="mt-3 rounded-lg bg-[#f8fafc] p-4 fade-in">
                        <p className="text-sm leading-relaxed text-[#64748b]">
                          <span className="font-semibold text-gray-900">Explanation: </span>
                          {dp.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Ask AI: What if... ── */}
        <section className="mb-8 rounded-xl bg-gradient-to-br from-[#6366f1]/5 to-[#06b6d4]/5 border border-[#6366f1]/20 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <svg className="h-5 w-5 text-[#6366f1]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
            </svg>
            Ask AI: What if...
          </h2>
          <p className="text-sm text-[#64748b] mb-4">
            Explore alternate scenarios for {td.product}. What if they had made different decisions?
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              value={whatIfInput}
              onChange={(e) => setWhatIfInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleWhatIf()}
              placeholder={`e.g. "What if ${td.product} had launched in India first?"`}
              className="flex-1 rounded-lg border border-[#e2e8f0] bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-[#94a3b8] focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20 transition-all"
            />
            <button
              onClick={handleWhatIf}
              disabled={whatIfLoading || !whatIfInput.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-[#6366f1] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#4f46e5] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 focus:ring-offset-2 disabled:opacity-60 shrink-0"
            >
              {whatIfLoading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Thinking...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
                  </svg>
                  Explore
                </>
              )}
            </button>
          </div>

          {whatIfResponse && (
            <div className="mt-4 rounded-lg border border-[#6366f1]/20 bg-white p-5 fade-in">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#6366f1]">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
                </svg>
                AI Analysis
              </h3>
              <div className="text-sm text-[#64748b] leading-relaxed">
                {whatIfResponse.split("\n").map((paragraph, i) =>
                  paragraph.trim() ? (
                    <p key={i} className="mb-2 last:mb-0">
                      {paragraph}
                    </p>
                  ) : null,
                )}
              </div>
            </div>
          )}
        </section>

        {/* Footer spacing */}
        <div className="h-16" />
      </div>
    );
  }

  /* ================================================================ */
  /*  GRID VIEW                                                        */
  /* ================================================================ */

  return (
    <div className="fade-in">
      {/* ── Header ── */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Product Teardowns
        </h1>
        <p className="mt-1 text-[#64748b]">
          Deep-dive into how top products are built and the PM decisions behind them.
        </p>
      </header>

      {/* ── Progress ── */}
      <div className="mb-6 flex items-center gap-4 rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#6366f1]/10">
          <svg className="h-6 w-6 text-[#6366f1]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-[#64748b]">Teardowns Explored</p>
          <p className="text-2xl font-bold text-gray-900">
            {readIds.length}<span className="text-lg text-[#64748b] font-normal">/12</span>
          </p>
        </div>
        <div className="hidden sm:block w-32">
          <div className="h-2 rounded-full bg-[#e2e8f0]">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-[#6366f1] to-[#06b6d4] transition-all duration-500"
              style={{ width: `${(readIds.length / 12) * 100}%` }}
            />
          </div>
          <p className="text-xs text-[#64748b] mt-1 text-right">
            {Math.round((readIds.length / 12) * 100)}%
          </p>
        </div>
      </div>

      {/* ── Filter Chips ── */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveFilter("All")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
            activeFilter === "All"
              ? "bg-[#6366f1] text-white shadow-sm"
              : "bg-white text-[#64748b] border border-[#e2e8f0] hover:border-[#6366f1] hover:text-[#6366f1]"
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
              activeFilter === cat
                ? "bg-[#6366f1] text-white shadow-sm"
                : "bg-white text-[#64748b] border border-[#e2e8f0] hover:border-[#6366f1] hover:text-[#6366f1]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Product Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeardowns.map((td) => {
          const isRead = readIds.includes(td.id);

          return (
            <button
              key={td.id}
              onClick={() => openTeardown(td)}
              className="group bg-white border border-[#e2e8f0] rounded-xl p-5 text-left card-hover block relative overflow-hidden"
            >
              {/* Read indicator */}
              {isRead && (
                <div className="absolute top-3 right-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  </span>
                </div>
              )}

              {/* Logo emoji */}
              <span className="text-5xl block mb-3">{td.logo}</span>

              {/* Category badge */}
              <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold mb-2 ${CATEGORY_BG[td.category]}`}>
                {td.category}
              </span>

              {/* Product & company */}
              <h3 className="font-semibold text-gray-900 group-hover:text-[#6366f1] transition-colors text-lg">
                {td.product}
              </h3>
              <p className="text-sm text-[#64748b] mb-1">{td.company}</p>

              {/* Tagline */}
              <p className="text-xs text-[#94a3b8] leading-relaxed line-clamp-2 mt-1">
                {td.tagline}
              </p>

              {/* Bottom gradient accent */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${CATEGORY_GRADIENT[td.category]} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            </button>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredTeardowns.length === 0 && (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-[#64748b] font-medium">No teardowns found for this category.</p>
          <button
            onClick={() => setActiveFilter("All")}
            className="mt-3 text-sm font-semibold text-[#6366f1] hover:text-[#4f46e5] transition-colors"
          >
            Show all teardowns
          </button>
        </div>
      )}

      {/* Footer spacing */}
      <div className="h-16" />
    </div>
  );
}
