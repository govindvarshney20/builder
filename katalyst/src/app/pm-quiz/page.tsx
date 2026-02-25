"use client";

import { useState, useEffect, useCallback } from "react";
import { quizQuestions, pmTypes } from "@/data/pm-quiz";
import type { QuizQuestion, PMType } from "@/data/pm-quiz";
import { getProgress, saveProgress, addXP } from "@/lib/storage";

/* ------------------------------------------------------------------ */
/*  Result Screen                                                      */
/* ------------------------------------------------------------------ */

function ResultCard({
  result,
  onRetake,
  copied,
  onShare,
}: {
  result: PMType;
  onRetake: () => void;
  copied: boolean;
  onShare: () => void;
}) {
  return (
    <div className="fade-in mx-auto max-w-2xl px-4 py-10 sm:px-6">
      {/* Result Card */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-transparent bg-white shadow-lg"
        style={{
          borderImage: "linear-gradient(135deg, #6366f1, #06b6d4, #f59e0b, #ef4444) 1",
        }}
      >
        {/* Gradient header band */}
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-8 text-center text-white">
          <div className="mb-3 text-7xl leading-none">{result.emoji}</div>
          <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-white/80">
            You are
          </p>
          <h1 className="text-3xl font-extrabold sm:text-4xl">
            The {result.title}!
          </h1>
        </div>

        {/* Body */}
        <div className="px-6 py-8 sm:px-8">
          {/* Description */}
          <p className="mb-8 text-center text-base leading-relaxed text-[#64748b]">
            {result.description}
          </p>

          {/* Strengths */}
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-900">
              Strengths
            </h3>
            <ul className="space-y-2">
              {result.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-xs">
                    &#10003;
                  </span>
                  <span className="text-sm text-gray-700">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Growth Areas */}
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-900">
              Growth Areas
            </h3>
            <ul className="space-y-2">
              {result.growthAreas.map((g, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600 text-xs">
                    &#8599;
                  </span>
                  <span className="text-sm text-gray-700">{g}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Ideal Roles */}
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-900">
              Ideal Roles
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.idealRoles.map((role, i) => (
                <span
                  key={i}
                  className="rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 px-3.5 py-1.5 text-xs font-semibold text-indigo-700"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>

          {/* Famous PMs */}
          <div className="mb-8">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-900">
              Famous PMs Like You
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.famousPMs.map((pm, i) => (
                <span
                  key={i}
                  className="rounded-full bg-gray-100 px-3.5 py-1.5 text-xs font-semibold text-gray-700"
                >
                  {pm}
                </span>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={onShare}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-3 text-sm font-bold text-white shadow-md transition-all duration-200 hover:shadow-lg hover:brightness-110"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
              </svg>
              {copied ? "Copied!" : "Share Result"}
            </button>
            <button
              onClick={onRetake}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-[#e2e8f0] bg-white px-5 py-3 text-sm font-bold text-gray-700 transition-all duration-200 hover:border-indigo-300 hover:bg-indigo-50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
              </svg>
              Retake Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page Component                                                */
/* ------------------------------------------------------------------ */

export default function PMQuizPage() {
  const [mounted, setMounted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [result, setResult] = useState<PMType | null>(null);
  const [copied, setCopied] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(false);

  const totalQuestions = quizQuestions.length;

  /* ---- Load saved result on mount ---- */
  useEffect(() => {
    const progress = getProgress();
    if (progress.pmType) {
      const savedResult = pmTypes.find((t) => t.type === progress.pmType);
      if (savedResult) {
        setResult(savedResult);
        setQuizComplete(true);
        setXpAwarded(true);
      }
    }
    setMounted(true);
  }, []);

  /* ---- Calculate result from scores ---- */
  const calculateResult = useCallback(
    (finalScores: Record<string, number>): PMType => {
      let maxType = pmTypes[0];
      let maxScore = -1;

      for (const pmType of pmTypes) {
        const score = finalScores[pmType.type] || 0;
        if (score > maxScore) {
          maxScore = score;
          maxType = pmType;
        }
      }

      return maxType;
    },
    [],
  );

  /* ---- Handle option selection ---- */
  const handleSelect = useCallback(
    (optionIndex: number) => {
      if (selectedOption !== null || isTransitioning) return;

      setSelectedOption(optionIndex);
      setIsTransitioning(true);

      const question: QuizQuestion = quizQuestions[currentQuestion];
      const optionScores = question.options[optionIndex].scores;

      const updatedScores = { ...scores };
      for (const [type, value] of Object.entries(optionScores)) {
        updatedScores[type] = (updatedScores[type] || 0) + value;
      }
      setScores(updatedScores);

      // Transition to next question or results
      setTimeout(() => {
        if (currentQuestion + 1 < totalQuestions) {
          setCurrentQuestion((prev) => prev + 1);
          setSelectedOption(null);
          setIsTransitioning(false);
        } else {
          // Quiz finished - calculate result
          const finalResult = calculateResult(updatedScores);
          setResult(finalResult);
          setQuizComplete(true);

          // Save to storage and award XP
          saveProgress({ pmType: finalResult.type });
          addXP(30);
          setXpAwarded(true);

          setSelectedOption(null);
          setIsTransitioning(false);
        }
      }, 600);
    },
    [selectedOption, isTransitioning, currentQuestion, scores, totalQuestions, calculateResult],
  );

  /* ---- Share result ---- */
  const handleShare = useCallback(() => {
    if (!result) return;
    const shareText = `I'm a ${result.title} PM! Take the quiz at Katalyst to find yours.`;
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [result]);

  /* ---- Retake quiz ---- */
  const handleRetake = useCallback(() => {
    setCurrentQuestion(0);
    setScores({});
    setSelectedOption(null);
    setIsTransitioning(false);
    setQuizComplete(false);
    setResult(null);
    setCopied(false);
    setXpAwarded(false);

    // Clear saved result
    saveProgress({ pmType: null });
  }, []);

  /* ---- Loading skeleton ---- */
  if (!mounted) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-pulse space-y-4 w-full max-w-2xl px-4">
          <div className="h-8 bg-[#e2e8f0] rounded w-1/3 mx-auto" />
          <div className="h-4 bg-[#e2e8f0] rounded w-1/2 mx-auto" />
          <div className="h-2 bg-[#e2e8f0] rounded-full mt-6" />
          <div className="h-64 bg-[#e2e8f0] rounded-xl mt-6" />
          <div className="space-y-3 mt-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-16 bg-[#e2e8f0] rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ---- Result screen ---- */
  if (quizComplete && result) {
    return (
      <ResultCard
        result={result}
        onRetake={handleRetake}
        copied={copied}
        onShare={handleShare}
      />
    );
  }

  /* ---- Quiz flow ---- */
  const question: QuizQuestion = quizQuestions[currentQuestion];
  const progressPercent = ((currentQuestion) / totalQuestions) * 100;

  return (
    <div className="fade-in mx-auto max-w-2xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          What Type of PM Are You?
        </h1>
        <p className="mt-2 text-[#64748b]">
          Answer 12 questions to discover your PM personality
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-xs font-semibold">
          <span className="text-[#6366f1]">
            Question {currentQuestion + 1} of {totalQuestions}
          </span>
          <span className="text-[#64748b]">
            {Math.round(progressPercent)}% complete
          </span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div
        className="relative mb-6 overflow-hidden rounded-2xl bg-white shadow-md border border-[#e2e8f0]"
        style={{
          opacity: isTransitioning ? 0 : 1,
          transform: isTransitioning ? "translateY(8px)" : "translateY(0)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
        }}
      >
        {/* Gradient accent bar */}
        <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        <div className="px-6 py-8 sm:px-8 sm:py-10">
          <p className="text-lg font-semibold leading-relaxed text-gray-900 sm:text-xl text-center">
            {question.question}
          </p>
        </div>
      </div>

      {/* Option cards */}
      <div
        className="space-y-3"
        style={{
          opacity: isTransitioning ? 0 : 1,
          transform: isTransitioning ? "translateY(12px)" : "translateY(0)",
          transition: "opacity 0.3s ease 0.05s, transform 0.3s ease 0.05s",
        }}
      >
        {question.options.map((option, idx) => {
          const isSelected = selectedOption === idx;

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={selectedOption !== null}
              className={`
                group flex w-full items-center gap-4 rounded-xl border-2 px-5 py-4 text-left
                transition-all duration-200 disabled:cursor-default
                ${
                  isSelected
                    ? "border-[#6366f1] bg-[#6366f1]/10 shadow-md ring-1 ring-[#6366f1]/30"
                    : "border-[#e2e8f0] bg-white hover:border-[#6366f1]/50 hover:bg-[#6366f1]/5 hover:shadow-sm cursor-pointer"
                }
              `}
            >
              {/* Letter badge */}
              <span
                className={`
                  flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold
                  transition-all duration-200
                  ${
                    isSelected
                      ? "bg-[#6366f1] text-white scale-110"
                      : "bg-gray-100 text-[#64748b] group-hover:bg-[#6366f1]/20 group-hover:text-[#6366f1]"
                  }
                `}
              >
                {String.fromCharCode(65 + idx)}
              </span>

              {/* Option text */}
              <span
                className={`
                  text-sm font-medium leading-snug sm:text-base
                  ${isSelected ? "text-[#6366f1]" : "text-gray-700 group-hover:text-gray-900"}
                `}
              >
                {option.text}
              </span>

              {/* Selection indicator */}
              {isSelected && (
                <span className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#6366f1] text-white">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom hint */}
      <p className="mt-6 text-center text-xs text-[#94a3b8]">
        Pick the answer that feels most like you. There are no wrong answers!
      </p>
    </div>
  );
}
