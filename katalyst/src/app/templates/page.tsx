"use client";

import { useState, useCallback } from "react";
import { pmTemplates } from "@/data/templates";
import type { PMTemplate } from "@/data/templates";
import { askGemini } from "@/lib/gemini";
import { addXP } from "@/lib/storage";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const CATEGORIES = ["All", "Documentation", "Strategy", "AI/ML", "Analytics", "Planning"] as const;

const CATEGORY_COLORS: Record<string, string> = {
  Documentation: "bg-blue-100 text-blue-700",
  Strategy: "bg-purple-100 text-purple-700",
  "AI/ML": "bg-pink-100 text-pink-700",
  Analytics: "bg-teal-100 text-teal-700",
  Planning: "bg-green-100 text-green-700",
};

const POPULAR_IDS = new Set(
  pmTemplates.slice(0, Math.min(3, pmTemplates.length)).map((t) => t.id),
);

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Very light markdown-ish formatting: **bold**, headings, lists. */
function formatContent(raw: string): string {
  return raw
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-4 mb-1">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold mt-5 mb-2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-6 mb-2">$1</h1>')
    .replace(/^[-*] (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul class="list-disc pl-5 mb-3">${match}</ul>`)
    .replace(/\n{2,}/g, "</p><p>")
    .replace(/\n/g, "<br/>");
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function TemplatesHubPage() {
  /* ---- state ---- */
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedTemplate, setSelectedTemplate] = useState<PMTemplate | null>(null);
  const [userInput, setUserInput] = useState("");
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  /* ---- derived ---- */
  const filteredTemplates =
    activeCategory === "All"
      ? pmTemplates
      : pmTemplates.filter((t) => t.category === activeCategory);

  /* ---- handlers ---- */
  const handleSelectTemplate = useCallback((template: PMTemplate) => {
    setSelectedTemplate(template);
    setUserInput("");
    setGeneratedContent(null);
    setCopied(false);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedTemplate(null);
    setUserInput("");
    setGeneratedContent(null);
    setCopied(false);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!selectedTemplate || !userInput.trim() || loading) return;

    setLoading(true);
    setGeneratedContent(null);
    setCopied(false);

    try {
      const prompt = `${selectedTemplate.aiPrompt}\n\nUser's product/feature: ${userInput.trim()}\n\nGenerate a comprehensive, well-structured document. Use markdown formatting with headings (##), bullet points, and bold text for emphasis.`;
      const response = await askGemini(prompt);
      setGeneratedContent(response);
      addXP(20);
    } catch {
      setGeneratedContent(
        "Unable to generate the document right now. Please try again later.",
      );
    } finally {
      setLoading(false);
    }
  }, [selectedTemplate, userInput, loading]);

  const handleCopy = useCallback(async () => {
    if (!generatedContent) return;
    try {
      await navigator.clipboard.writeText(generatedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard API might not be available */
    }
  }, [generatedContent]);

  const handleGenerateAnother = useCallback(() => {
    setUserInput("");
    setGeneratedContent(null);
    setCopied(false);
  }, []);

  /* ---- Generator View ---- */
  if (selectedTemplate) {
    return (
      <div className="fade-in">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground transition-colors mb-6"
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
          Back to Templates
        </button>

        {/* Template Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{selectedTemplate.icon}</span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                {selectedTemplate.name}
              </h1>
              <span
                className={`inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${CATEGORY_COLORS[selectedTemplate.category] ?? "bg-gray-100 text-gray-700"}`}
              >
                {selectedTemplate.category}
              </span>
            </div>
          </div>
          <p className="text-muted mt-2 leading-relaxed max-w-2xl">
            {selectedTemplate.description}
          </p>
        </div>

        {/* Input Section */}
        {!generatedContent && !loading && (
          <div className="bg-white border border-border rounded-xl p-6 shadow-sm max-w-2xl">
            <label
              htmlFor="product-input"
              className="block text-sm font-semibold text-foreground mb-2"
            >
              Describe your product/feature in one line
            </label>
            <input
              id="product-input"
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleGenerate();
              }}
              placeholder="e.g., An AI-powered meal planning app for busy professionals"
              className="w-full border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
            <button
              onClick={handleGenerate}
              disabled={!userInput.trim()}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#6366f1] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#4f46e5] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
              Generate with AI
            </button>
          </div>
        )}

        {/* Loading Shimmer */}
        {loading && (
          <div className="bg-white border border-border rounded-xl p-6 shadow-sm max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <svg
                className="h-5 w-5 animate-spin text-[#6366f1]"
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
              <span className="text-sm font-medium text-[#6366f1]">
                Generating your {selectedTemplate.name}...
              </span>
            </div>
            <div className="space-y-4">
              <div className="h-6 shimmer rounded w-3/4" />
              <div className="h-4 shimmer rounded w-full" />
              <div className="h-4 shimmer rounded w-5/6" />
              <div className="h-4 shimmer rounded w-full" />
              <div className="h-6 shimmer rounded w-1/2 mt-6" />
              <div className="h-4 shimmer rounded w-full" />
              <div className="h-4 shimmer rounded w-4/5" />
              <div className="h-4 shimmer rounded w-full" />
              <div className="h-4 shimmer rounded w-3/4" />
              <div className="h-6 shimmer rounded w-2/3 mt-6" />
              <div className="h-4 shimmer rounded w-full" />
              <div className="h-4 shimmer rounded w-5/6" />
            </div>
          </div>
        )}

        {/* Generated Content */}
        {generatedContent && !loading && (
          <div className="fade-in max-w-3xl">
            {/* XP Banner */}
            <div className="mb-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
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
                +20 XP earned!
              </span>
            </div>

            {/* Document Card */}
            <div className="bg-white border border-border rounded-xl shadow-sm">
              {/* Document Header */}
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Generated {selectedTemplate.name}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                      copied
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-[#f1f5f9] text-muted hover:bg-[#e2e8f0] hover:text-foreground"
                    }`}
                  >
                    {copied ? (
                      <>
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
                            d="m4.5 12.75 6 6 9-13.5"
                          />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
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
                            d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
                          />
                        </svg>
                        Copy to Clipboard
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Document Body */}
              <div
                className="prose-content px-6 py-6 text-sm text-foreground leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: formatContent(generatedContent),
                }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-6">
              <button
                onClick={handleGenerateAnother}
                className="inline-flex items-center gap-2 rounded-lg bg-[#6366f1] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#4f46e5] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 focus:ring-offset-2"
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
                Generate Another
              </button>
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-all duration-200 hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 focus:ring-offset-2"
              >
                Browse Templates
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ---- Grid View ---- */
  return (
    <div className="fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">📝</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            PM Templates Hub
          </h1>
        </div>
        <p className="text-muted leading-relaxed max-w-2xl">
          AI-powered templates for PRDs, strategy docs, specs, and more.
          Describe your product and let AI generate professional documents in seconds.
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeCategory === cat
                ? "bg-[#6366f1] text-white shadow-sm"
                : "bg-white border border-border text-muted hover:text-foreground hover:bg-surface-hover"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <button
            key={template.id}
            onClick={() => handleSelectTemplate(template)}
            className="group bg-white border border-border rounded-xl p-5 card-hover text-left relative"
          >
            {/* Popular Badge */}
            {POPULAR_IDS.has(template.id) && (
              <span className="absolute top-3 right-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                Popular
              </span>
            )}

            {/* Icon */}
            <div className="flex items-start mb-3">
              <span className="text-3xl">{template.icon}</span>
            </div>

            {/* Name */}
            <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
              {template.name}
            </h3>

            {/* Category Badge */}
            <span
              className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2 ${CATEGORY_COLORS[template.category] ?? "bg-gray-100 text-gray-700"}`}
            >
              {template.category}
            </span>

            {/* Description */}
            <p className="text-sm text-muted leading-relaxed">
              {template.description}
            </p>

            {/* Hover hint */}
            <div className="mt-3 flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
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
                  d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z"
                />
              </svg>
              Generate with AI
            </div>
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-16">
          <span className="text-5xl block mb-4">🔍</span>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            No templates found
          </h3>
          <p className="text-sm text-muted">
            Try selecting a different category.
          </p>
        </div>
      )}
    </div>
  );
}
