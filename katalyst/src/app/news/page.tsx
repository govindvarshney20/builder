"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { askGemini } from "@/lib/gemini";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const SYSTEM_PROMPT =
  "You are a product management news analyst. Generate 5 current, insightful bullet points about the requested topic that would help a product manager. Include specific company examples and actionable takeaways. Format with clear headers and bullet points.";

const THOUGHT_SYSTEM_PROMPT =
  "You are a senior product management mentor. Generate one inspiring and tactical PM insight or quote for the day. Keep it to 2-3 sentences max. Make it actionable and thought-provoking. Do not use quotation marks around the entire response.";

interface TopicButton {
  label: string;
  color: string;
  hoverColor: string;
  bgColor: string;
}

const TOPIC_BUTTONS: TopicButton[] = [
  {
    label: "AI Product Trends 2025",
    color: "text-violet-700",
    hoverColor: "hover:bg-violet-100",
    bgColor: "bg-violet-50 border-violet-200",
  },
  {
    label: "India Startup Ecosystem",
    color: "text-orange-700",
    hoverColor: "hover:bg-orange-100",
    bgColor: "bg-orange-50 border-orange-200",
  },
  {
    label: "Product-Led Growth Tactics",
    color: "text-emerald-700",
    hoverColor: "hover:bg-emerald-100",
    bgColor: "bg-emerald-50 border-emerald-200",
  },
  {
    label: "AI PM Career Outlook",
    color: "text-blue-700",
    hoverColor: "hover:bg-blue-100",
    bgColor: "bg-blue-50 border-blue-200",
  },
  {
    label: "Latest in LLMs & GenAI",
    color: "text-pink-700",
    hoverColor: "hover:bg-pink-100",
    bgColor: "bg-pink-50 border-pink-200",
  },
  {
    label: "PM Interview Trends",
    color: "text-cyan-700",
    hoverColor: "hover:bg-cyan-100",
    bgColor: "bg-cyan-50 border-cyan-200",
  },
  {
    label: "B2B vs B2C Product Strategy",
    color: "text-amber-700",
    hoverColor: "hover:bg-amber-100",
    bgColor: "bg-amber-50 border-amber-200",
  },
  {
    label: "Growth Metrics That Matter",
    color: "text-teal-700",
    hoverColor: "hover:bg-teal-100",
    bgColor: "bg-teal-50 border-teal-200",
  },
];

interface QueryHistoryItem {
  topic: string;
  timestamp: number;
  content: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function NewsPage() {
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [thoughtOfDay, setThoughtOfDay] = useState<string | null>(null);
  const [thoughtLoading, setThoughtLoading] = useState(true);
  const [customTopic, setCustomTopic] = useState("");
  const [queryHistory, setQueryHistory] = useState<QueryHistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  /* ---- Generate PM Thought of the Day on page load ---- */
  useEffect(() => {
    let cancelled = false;
    async function fetchThought() {
      try {
        const response = await askGemini(
          "Give me a PM thought of the day for today.",
          THOUGHT_SYSTEM_PROMPT,
        );
        if (!cancelled) setThoughtOfDay(response);
      } catch {
        if (!cancelled)
          setThoughtOfDay(
            "Great PMs don't just ship features -- they ship outcomes. Focus on the problem worth solving, measure what matters, and iterate relentlessly.",
          );
      } finally {
        if (!cancelled) setThoughtLoading(false);
      }
    }
    fetchThought();
    return () => {
      cancelled = true;
    };
  }, []);

  /* ---- Generate insights for a topic ---- */
  const generateInsights = useCallback(
    async (topic: string) => {
      if (loading) return;
      setLoading(true);
      setActiveTopic(topic);
      setGeneratedContent(null);
      setError(null);

      try {
        const response = await askGemini(topic, SYSTEM_PROMPT);
        setGeneratedContent(response);

        // Add to history
        setQueryHistory((prev) => {
          const updated = [
            { topic, timestamp: Date.now(), content: response },
            ...prev.filter((item) => item.topic !== topic),
          ];
          return updated.slice(0, 10); // Keep last 10 queries
        });

        // Scroll to content
        setTimeout(() => {
          contentRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      } catch {
        setError("Failed to generate insights. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [loading],
  );

  /* ---- Handle custom topic submission ---- */
  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customTopic.trim();
    if (trimmed) {
      generateInsights(trimmed);
      setCustomTopic("");
    }
  };

  /* ---- Load a past query from history ---- */
  const loadFromHistory = (item: QueryHistoryItem) => {
    setActiveTopic(item.topic);
    setGeneratedContent(item.content);
    setError(null);
    setTimeout(() => {
      contentRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  /* ---- Format timestamp ---- */
  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  /* ---- Render ---- */
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="fade-in mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* ── Purple Gradient Header ── */}
        <header className="mb-8 rounded-2xl bg-gradient-to-r from-[#6366f1] via-[#7c3aed] to-[#a855f7] p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
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
                d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6V7.5Z"
              />
            </svg>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Product News & Trends
            </h1>
          </div>
          <p className="text-white/80 text-sm sm:text-base max-w-2xl">
            AI-powered insights on product management trends, startup
            ecosystems, and career strategies -- generated fresh on demand.
          </p>
        </header>

        {/* ── PM Thought of the Day ── */}
        <section className="mb-8">
          <div className="rounded-xl border border-[#e2e8f0] bg-white shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 border-b border-[#e2e8f0] bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-3">
              <svg
                className="h-5 w-5 text-amber-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                />
              </svg>
              <h2 className="text-sm font-semibold text-amber-700">
                PM Thought of the Day
              </h2>
            </div>
            <div className="px-6 py-4">
              {thoughtLoading ? (
                <div className="space-y-2">
                  <div className="shimmer h-4 w-full rounded" />
                  <div className="shimmer h-4 w-3/4 rounded" />
                </div>
              ) : (
                <p className="text-sm leading-relaxed text-gray-700 italic">
                  {thoughtOfDay}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ── AI-Powered PM Insights Header ── */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <svg
              className="h-5 w-5 text-[#6366f1]"
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
            <h2 className="text-xl font-bold text-gray-900">
              AI-Powered PM Insights
            </h2>
          </div>
          <p className="text-sm text-[#64748b] mb-5">
            Pick a topic or type your own to get AI-generated insights tailored
            for product managers.
          </p>

          {/* ── Topic Buttons Grid ── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {TOPIC_BUTTONS.map((topic) => (
              <button
                key={topic.label}
                onClick={() => generateInsights(topic.label)}
                disabled={loading}
                className={`rounded-full border px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 ${topic.bgColor} ${topic.color} ${topic.hoverColor} disabled:opacity-50 disabled:cursor-not-allowed ${
                  activeTopic === topic.label
                    ? "ring-2 ring-offset-1 ring-[#6366f1]"
                    : ""
                }`}
              >
                {topic.label}
              </button>
            ))}
          </div>
        </section>

        {/* ── Custom Topic Input ── */}
        <section className="mb-8">
          <form onSubmit={handleCustomSubmit} className="flex gap-3">
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748b]"
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
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="Type any PM topic for AI analysis..."
                className="w-full rounded-xl border border-[#e2e8f0] bg-white py-3 pl-10 pr-4 text-sm text-gray-900 placeholder-[#94a3b8] shadow-sm transition-all duration-200 focus:border-[#6366f1] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/20"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !customTopic.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-[#6366f1] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#4f46e5] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z"
                />
              </svg>
              Analyze
            </button>
          </form>
        </section>

        {/* ── Generated Content Area ── */}
        <div ref={contentRef}>
          {loading && (
            <section className="mb-8 rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="shimmer h-6 w-6 rounded-full" />
                <div className="shimmer h-5 w-48 rounded" />
              </div>
              <div className="space-y-4">
                <div className="shimmer h-4 w-full rounded" />
                <div className="shimmer h-4 w-11/12 rounded" />
                <div className="shimmer h-4 w-full rounded" />
                <div className="shimmer h-4 w-5/6 rounded" />
                <div className="shimmer h-4 w-full rounded" />
                <div className="shimmer h-4 w-3/4 rounded" />
                <div className="shimmer h-4 w-full rounded" />
                <div className="shimmer h-4 w-10/12 rounded" />
                <div className="shimmer h-4 w-full rounded" />
                <div className="shimmer h-4 w-2/3 rounded" />
              </div>
            </section>
          )}

          {error && !loading && (
            <section className="mb-8 rounded-xl border border-rose-200 bg-rose-50 p-6 shadow-sm fade-in">
              <div className="flex items-center gap-3">
                <svg
                  className="h-5 w-5 text-rose-500 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                  />
                </svg>
                <p className="text-sm text-rose-700">{error}</p>
                <button
                  onClick={() => activeTopic && generateInsights(activeTopic)}
                  className="ml-auto rounded-lg bg-rose-100 px-3 py-1.5 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-200"
                >
                  Retry
                </button>
              </div>
            </section>
          )}

          {generatedContent && !loading && (
            <section className="mb-8 rounded-xl border border-[#e2e8f0] bg-white shadow-sm overflow-hidden fade-in">
              {/* Content header */}
              <div className="flex items-center justify-between border-b border-[#e2e8f0] bg-gradient-to-r from-[#6366f1]/5 to-[#a855f7]/5 px-6 py-4">
                <div className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-[#6366f1]"
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
                  <h3 className="font-semibold text-gray-900">{activeTopic}</h3>
                </div>
                <span className="text-xs text-[#64748b]">
                  Generated by Gemini AI
                </span>
              </div>

              {/* Content body */}
              <div className="px-6 py-5">
                <div className="prose-content text-sm leading-relaxed text-gray-700">
                  {generatedContent.split("\n").map((line, i) => {
                    if (!line.trim()) return <br key={i} />;
                    // Render markdown-style headers
                    if (line.startsWith("### "))
                      return (
                        <h3 key={i}>{line.replace("### ", "")}</h3>
                      );
                    if (line.startsWith("## "))
                      return (
                        <h2 key={i}>{line.replace("## ", "")}</h2>
                      );
                    if (line.startsWith("# "))
                      return (
                        <h1 key={i}>{line.replace("# ", "")}</h1>
                      );
                    // Render bullet points
                    if (line.startsWith("- ") || line.startsWith("* "))
                      return (
                        <li key={i} className="ml-4 mb-1 list-disc">
                          {renderBoldText(line.slice(2))}
                        </li>
                      );
                    // Render numbered items
                    if (/^\d+\.\s/.test(line))
                      return (
                        <li key={i} className="ml-4 mb-1 list-decimal">
                          {renderBoldText(line.replace(/^\d+\.\s/, ""))}
                        </li>
                      );
                    return (
                      <p key={i}>{renderBoldText(line)}</p>
                    );
                  })}
                </div>
              </div>
            </section>
          )}
        </div>

        {/* ── Recent Queries History ── */}
        {queryHistory.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <svg
                className="h-5 w-5 text-[#64748b]"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              <h2 className="text-lg font-bold text-gray-900">
                Recent Queries
              </h2>
            </div>
            <div className="space-y-2">
              {queryHistory.map((item, i) => (
                <button
                  key={`${item.topic}-${item.timestamp}-${i}`}
                  onClick={() => loadFromHistory(item)}
                  className="flex w-full items-center gap-3 rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-left shadow-sm transition-all duration-200 hover:shadow-md hover:border-[#6366f1]/30"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#6366f1]/10">
                    <svg
                      className="h-4 w-4 text-[#6366f1]"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {item.topic}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-[#64748b]">
                    {formatTime(item.timestamp)}
                  </span>
                  <svg
                    className="h-4 w-4 shrink-0 text-[#94a3b8]"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m8.25 4.5 7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ── Footer spacing ── */}
        <div className="h-16" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Helper: Render **bold** text within a line                         */
/* ------------------------------------------------------------------ */

function renderBoldText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i}>{part.slice(2, -2)}</strong>
      );
    }
    return part;
  });
}
