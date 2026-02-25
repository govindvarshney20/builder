"use client";

import { useState, useEffect, useCallback } from "react";
import { challenges } from "@/data/challenges";
import type { Challenge } from "@/data/challenges";
import { getProgress, saveProgress, addXP } from "@/lib/storage";
import { askGemini } from "@/lib/gemini";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ChallengeAttempt {
  challengeId: string;
  date: string;
  selectedIndex: number;
  correct: boolean;
}

interface Progress {
  xp: number;
  dailyChallengeHistory: ChallengeAttempt[];
  streak: number;
  lastChallengeDate: string | null;
  [key: string]: unknown;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Return today's date as YYYY-MM-DD in the local timezone. */
function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Deterministic challenge index for a given date string. */
function getChallengeIndex(dateStr: string, total: number): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) | 0;
  }
  return ((hash % total) + total) % total; // always positive
}

/** Calculate the current streak from the history. */
function calculateStreak(history: ChallengeAttempt[]): number {
  if (history.length === 0) return 0;

  const sorted = [...history]
    .sort((a, b) => b.date.localeCompare(a.date));

  // De-duplicate by date
  const uniqueDates = Array.from(new Set(sorted.map((h) => h.date)));

  const today = getTodayString();
  const yesterday = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  })();

  // Streak must include today or yesterday to be active
  if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const prev = new Date(uniqueDates[i - 1] + "T00:00:00");
    const curr = new Date(uniqueDates[i] + "T00:00:00");
    const diffDays = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

const OPTION_LABELS = ["A", "B", "C", "D"];

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  hard: "bg-rose-100 text-rose-700",
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function DailyChallengePage() {
  /* ---- state ---- */
  const [progress, setProgress] = useState<Progress | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const today = getTodayString();
  const challengeIdx = getChallengeIndex(today, challenges.length);
  const challenge: Challenge = challenges[challengeIdx];

  /* ---- load progress ---- */
  useEffect(() => {
    const userProgress = getProgress();

    // Convert Record-based history back to ChallengeAttempt[]
    let history: ChallengeAttempt[] = [];
    const rawHistory = userProgress.dailyChallengeHistory;
    if (rawHistory && typeof rawHistory === "object" && !Array.isArray(rawHistory)) {
      // Stored as Record<string, { answered, correct, questionId }>
      // Keys are "date_challengeId"
      history = Object.entries(rawHistory).map(([key, val]) => {
        const separatorIdx = key.indexOf("_");
        const date = separatorIdx > -1 ? key.substring(0, separatorIdx) : key;
        return {
          challengeId: val.questionId,
          date,
          selectedIndex: -1, // Not stored in Record format
          correct: val.correct,
        };
      });
    } else if (Array.isArray(rawHistory)) {
      history = rawHistory as unknown as ChallengeAttempt[];
    }

    const initial: Progress = {
      xp: userProgress.totalXP ?? 0,
      dailyChallengeHistory: history,
      streak: userProgress.streak ?? 0,
      lastChallengeDate: userProgress.lastActiveDate || null,
    };

    // Ensure history array exists
    if (!initial.dailyChallengeHistory) {
      initial.dailyChallengeHistory = [];
    }

    // Check if already answered today
    const todayAttempt = initial.dailyChallengeHistory.find(
      (a) => a.date === today && a.challengeId === challenge.id,
    );
    if (todayAttempt) {
      setSelectedIndex(todayAttempt.selectedIndex);
      setHasAnswered(true);
    }

    setProgress(initial);
    setMounted(true);
  }, [today, challenge.id]);

  /* ---- answer handler ---- */
  const handleSelect = useCallback(
    (index: number) => {
      if (hasAnswered || !progress) return;

      const correct = index === challenge.correctIndex;
      const xpGain = correct ? 20 : 5;

      const attempt: ChallengeAttempt = {
        challengeId: challenge.id,
        date: today,
        selectedIndex: index,
        correct,
      };

      const updatedHistory = [...progress.dailyChallengeHistory, attempt];
      const updatedProgress: Progress = {
        ...progress,
        dailyChallengeHistory: updatedHistory,
        lastChallengeDate: today,
        streak: calculateStreak(updatedHistory),
      };

      setSelectedIndex(index);
      setHasAnswered(true);
      setProgress(updatedProgress);

      addXP(xpGain);
      // Convert local Progress to UserProgress shape for persistence
      const historyRecord: Record<string, { answered: boolean; correct: boolean; questionId: string }> = {};
      for (const a of updatedHistory) {
        historyRecord[a.date + "_" + a.challengeId] = {
          answered: true,
          correct: a.correct,
          questionId: a.challengeId,
        };
      }
      saveProgress({
        challengesCompleted: updatedHistory.filter((a) => a.correct).length,
        dailyChallengeHistory: historyRecord,
      });
    },
    [hasAnswered, progress, challenge, today],
  );

  /* ---- AI deep dive ---- */
  const handleAiDeepDive = useCallback(async () => {
    if (aiLoading || aiExplanation) return;
    setAiLoading(true);
    try {
      const prompt = `You are a product management coach. A user just answered the following challenge question.\n\nQuestion: ${challenge.question}\nCorrect Answer: ${challenge.options[challenge.correctIndex]}\nExplanation: ${challenge.explanation}\n\nProvide a short, insightful "deep dive" (3-5 paragraphs) that:\n1. Explains why the correct answer is right with a real-world PM example\n2. Explains why each wrong answer is incorrect or less ideal\n3. Gives a practical tip the user can apply in their PM career\n\nKeep the tone professional yet conversational.`;
      const response = await askGemini(prompt);
      setAiExplanation(response);
    } catch {
      setAiExplanation(
        "Unable to load AI explanation right now. Please try again later.",
      );
    } finally {
      setAiLoading(false);
    }
  }, [aiLoading, aiExplanation, challenge]);

  /* ---- derived values ---- */
  const streak = progress ? calculateStreak(progress.dailyChallengeHistory) : 0;
  const previousAttempts = progress
    ? [...progress.dailyChallengeHistory]
        .sort((a, b) => b.date.localeCompare(a.date))
        .filter((a) => !(a.date === today && a.challengeId === challenge.id))
        .slice(0, 5)
    : [];

  /* ---- skeleton / loading ---- */
  if (!mounted || !progress) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-2xl px-4">
          <div className="h-8 bg-[#e2e8f0] rounded w-1/3" />
          <div className="h-48 bg-[#e2e8f0] rounded" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-14 bg-[#e2e8f0] rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ---- render ---- */
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="fade-in mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Daily Challenge
          </h1>
          <p className="mt-1 text-[#64748b]">
            Sharpen your PM skills with a new question every day.
          </p>
        </header>

        {/* ── Streak Banner ── */}
        <div className="mb-6 flex items-center gap-4 rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#6366f1]/10">
            <svg
              className="h-6 w-6 text-[#6366f1]"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-[#64748b]">Current Streak</p>
            <p className="text-2xl font-bold text-gray-900">
              {streak} day{streak !== 1 ? "s" : ""}
            </p>
          </div>
          {streak >= 7 && (
            <span className="ml-auto rounded-full bg-[#6366f1] px-3 py-1 text-xs font-semibold text-white">
              On Fire!
            </span>
          )}
        </div>

        {/* ── Challenge Card ── */}
        <section className="rounded-xl border border-[#e2e8f0] bg-white shadow-sm">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 border-b border-[#e2e8f0] px-6 py-4">
            <span className="rounded-full bg-[#6366f1]/10 px-3 py-1 text-xs font-semibold text-[#6366f1]">
              {challenge.category}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${DIFFICULTY_COLORS[challenge.difficulty] ?? "bg-gray-100 text-gray-700"}`}
            >
              {challenge.difficulty}
            </span>
            <span className="ml-auto text-xs text-[#64748b]">{today}</span>
          </div>

          {/* Question */}
          <div className="px-6 py-6">
            <h2 className="text-lg font-semibold leading-relaxed text-gray-900">
              {challenge.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3 px-6 pb-6">
            {challenge.options.map((option, idx) => {
              const isSelected = selectedIndex === idx;
              const isCorrect = idx === challenge.correctIndex;

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
                  className={`flex w-full items-center gap-4 rounded-lg border-2 px-4 py-3.5 text-left transition-all duration-200 ${optionStyle} disabled:cursor-default`}
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

          {/* ── Post-Answer Section ── */}
          {hasAnswered && (
            <div className="border-t border-[#e2e8f0] px-6 py-6 fade-in">
              {/* XP Award */}
              <div className="mb-4 flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${
                    selectedIndex === challenge.correctIndex
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
                  {selectedIndex === challenge.correctIndex
                    ? "+20 XP  --  Correct!"
                    : "+5 XP  --  Nice try!"}
                </span>
              </div>

              {/* Explanation */}
              <div className="rounded-lg bg-[#f8fafc] p-4">
                <h3 className="mb-2 text-sm font-semibold text-gray-900">
                  Explanation
                </h3>
                <p className="text-sm leading-relaxed text-[#64748b]">
                  {challenge.explanation}
                </p>
              </div>

              {/* AI Deep Dive */}
              <div className="mt-4">
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

                {aiExplanation && (
                  <div className="mt-3 rounded-lg border border-[#6366f1]/20 bg-[#6366f1]/5 p-4 fade-in">
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
            </div>
          )}
        </section>

        {/* ── Previous Challenges ── */}
        {previousAttempts.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              Previous Challenges
            </h2>
            <div className="space-y-3">
              {previousAttempts.map((attempt, i) => {
                const pastChallenge = challenges.find(
                  (c) => c.id === attempt.challengeId,
                );
                if (!pastChallenge) return null;

                return (
                  <div
                    key={`${attempt.date}-${attempt.challengeId}-${i}`}
                    className="flex items-center gap-4 rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                  >
                    {/* Result indicator */}
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        attempt.correct
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-rose-100 text-rose-600"
                      }`}
                    >
                      {attempt.correct ? (
                        <svg
                          className="h-5 w-5"
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
                      ) : (
                        <svg
                          className="h-5 w-5"
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
                      )}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {pastChallenge.question}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs text-[#64748b]">
                          {attempt.date}
                        </span>
                        <span className="rounded-full bg-[#6366f1]/10 px-2 py-0.5 text-xs font-medium text-[#6366f1]">
                          {pastChallenge.category}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${DIFFICULTY_COLORS[pastChallenge.difficulty] ?? "bg-gray-100 text-gray-700"}`}
                        >
                          {pastChallenge.difficulty}
                        </span>
                      </div>
                    </div>

                    {/* XP earned */}
                    <span
                      className={`shrink-0 text-sm font-semibold ${
                        attempt.correct ? "text-emerald-600" : "text-amber-600"
                      }`}
                    >
                      {attempt.correct ? "+20" : "+5"} XP
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Footer spacing ── */}
        <div className="h-16" />
      </div>
    </div>
  );
}
