"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { getProgress, getLevelProgress } from "@/lib/storage";
import type { UserProgress } from "@/lib/storage";
import { toPng } from "html-to-image";

export default function ScorecardPage() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  const handleDownloadImage = useCallback(async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = "katalyst-pm-scorecard.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate image:", err);
    } finally {
      setDownloading(false);
    }
  }, []);

  const handleCopyShareText = useCallback(() => {
    if (!progress) return;
    const levelInfo = getLevelProgress(progress.totalXP);
    const lines = [
      `\u{1F3C6} My PM Scorecard from Katalyst \u26A1`,
      `Level: ${levelInfo.current} | XP: ${progress.totalXP} | Streak: ${progress.streak} days`,
    ];
    if (progress.pmType) {
      lines.push(`PM Type: ${progress.pmType}`);
    }
    lines.push(`Sharpen your PM skills at Katalyst!`);

    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }, [progress]);

  if (!progress) {
    return <div className="shimmer h-96 rounded-xl" />;
  }

  const levelInfo = getLevelProgress(progress.totalXP);
  const hasProgress =
    progress.totalXP > 0 ||
    progress.challengesCompleted > 0 ||
    progress.interviewQsCompleted > 0 ||
    progress.lessonsCompleted.length > 0;

  const radarScores = progress.radarScores;
  const maxRadar = radarScores
    ? Math.max(...Object.values(radarScores), 5)
    : 5;

  const dateString = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // ---------- Empty state ----------
  if (!hasProgress) {
    return (
      <div className="fade-in max-w-2xl mx-auto text-center py-16">
        <span className="text-7xl block mb-6">🚀</span>
        <h1 className="text-3xl font-bold gradient-text mb-3">
          Your Scorecard Awaits
        </h1>
        <p className="text-muted text-lg mb-8 max-w-md mx-auto">
          Complete challenges, lessons, and assessments to build your PM
          scorecard. Every activity earns XP and unlocks new levels!
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
          <Link
            href="/daily-challenge"
            className="bg-white border border-border rounded-xl p-5 card-hover text-left block"
          >
            <span className="text-2xl block mb-2">⚡</span>
            <h3 className="font-semibold text-foreground mb-1">
              Daily Challenge
            </h3>
            <p className="text-sm text-muted">
              Answer one PM question to start your streak
            </p>
          </Link>
          <Link
            href="/skills-radar"
            className="bg-white border border-border rounded-xl p-5 card-hover text-left block"
          >
            <span className="text-2xl block mb-2">🎯</span>
            <h3 className="font-semibold text-foreground mb-1">
              Skills Radar
            </h3>
            <p className="text-sm text-muted">
              Take the assessment to map your strengths
            </p>
          </Link>
          <Link
            href="/ai-pm-module"
            className="bg-white border border-border rounded-xl p-5 card-hover text-left block"
          >
            <span className="text-2xl block mb-2">🤖</span>
            <h3 className="font-semibold text-foreground mb-1">
              AI PM Lessons
            </h3>
            <p className="text-sm text-muted">
              Master AI product management skills
            </p>
          </Link>
          <Link
            href="/pm-quiz"
            className="bg-white border border-border rounded-xl p-5 card-hover text-left block"
          >
            <span className="text-2xl block mb-2">🎭</span>
            <h3 className="font-semibold text-foreground mb-1">
              PM Type Quiz
            </h3>
            <p className="text-sm text-muted">
              Discover what kind of PM you are
            </p>
          </Link>
        </div>
      </div>
    );
  }

  // ---------- Scorecard ----------
  return (
    <div className="fade-in max-w-2xl mx-auto">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">
          PM Scorecard
        </h1>
        <p className="text-muted">
          Your shareable PM achievement certificate — download it or share with
          your network
        </p>
      </div>

      {/* ---------- Gradient border wrapper ---------- */}
      <div className="max-w-lg mx-auto rounded-2xl p-1 bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400">
        {/* ---------- White inner card ---------- */}
        <div
          id="scorecard-card"
          ref={cardRef}
          className="bg-white rounded-xl p-8 relative overflow-hidden"
        >
          {/* Subtle decorative dots */}
          <div className="absolute top-3 right-3 grid grid-cols-3 gap-1 opacity-10">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-indigo-500"
              />
            ))}
          </div>

          {/* Header */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">⚡</span>
            <h2 className="text-xl font-bold gradient-text">
              Katalyst PM Scorecard
            </h2>
          </div>

          {/* Level banner */}
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-xl px-5 py-4 mb-6 text-white text-center">
            <div className="text-xs uppercase tracking-widest text-white/70 mb-1">
              Current Level
            </div>
            <div className="text-2xl font-bold">{levelInfo.current}</div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl mb-1">✨</div>
              <div className="text-xl font-bold text-foreground">
                {progress.totalXP}
              </div>
              <div className="text-xs text-muted">Total XP</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">🔥</div>
              <div className="text-xl font-bold text-foreground">
                {progress.streak}
              </div>
              <div className="text-xs text-muted">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">⚡</div>
              <div className="text-xl font-bold text-foreground">
                {progress.challengesCompleted}
              </div>
              <div className="text-xs text-muted">Challenges</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">💼</div>
              <div className="text-xl font-bold text-foreground">
                {progress.interviewQsCompleted}
              </div>
              <div className="text-xs text-muted">Interview Qs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">🤖</div>
              <div className="text-xl font-bold text-foreground">
                {progress.lessonsCompleted.length}
              </div>
              <div className="text-xs text-muted">Lessons</div>
            </div>
            {progress.pmType ? (
              <div className="text-center">
                <div className="text-2xl mb-1">🎭</div>
                <div className="text-sm font-bold text-foreground leading-tight">
                  {progress.pmType}
                </div>
                <div className="text-xs text-muted">PM Type</div>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-2xl mb-1">🎭</div>
                <div className="text-sm font-bold text-muted leading-tight">
                  —
                </div>
                <div className="text-xs text-muted">PM Type</div>
              </div>
            )}
          </div>

          {/* Radar scores mini bars */}
          {radarScores && Object.keys(radarScores).length > 0 && (
            <div className="mb-6">
              <div className="text-xs uppercase tracking-widest text-muted mb-3 font-semibold">
                Skills Radar
              </div>
              <div className="space-y-2">
                {Object.entries(radarScores)
                  .sort(([, a], [, b]) => b - a)
                  .map(([category, score]) => (
                    <div key={category} className="flex items-center gap-3">
                      <span className="text-xs text-foreground font-medium w-28 truncate">
                        {category}
                      </span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                          style={{
                            width: `${(score / maxRadar) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-muted w-8 text-right">
                        {score.toFixed(1)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Footer divider + date */}
          <div className="border-t border-border pt-4 flex items-center justify-between">
            <span className="text-xs text-muted">{dateString}</span>
            <span className="text-xs text-muted font-medium">
              katalyst.dev ⚡
            </span>
          </div>
        </div>
      </div>

      {/* ---------- Action buttons ---------- */}
      <div className="flex flex-wrap justify-center gap-3 mt-8">
        <button
          onClick={handleDownloadImage}
          disabled={downloading}
          className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {downloading ? (
            <>
              <svg
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
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
            <>📥 Download as Image</>
          )}
        </button>

        <button
          onClick={handleCopyShareText}
          className="px-6 py-3 bg-white border border-border text-foreground rounded-lg font-semibold hover:bg-surface-hover transition-colors flex items-center gap-2"
        >
          {copied ? "✓ Copied!" : "📋 Copy Share Text"}
        </button>
      </div>

      {/* Tip */}
      <div className="mt-10 mb-4 bg-amber-50 border border-amber-200 rounded-xl p-5 max-w-lg mx-auto">
        <h3 className="font-semibold text-amber-800 mb-2">💡 Pro Tip</h3>
        <p className="text-amber-700 text-sm leading-relaxed">
          Complete more activities to level up your scorecard! Take the{" "}
          <Link href="/skills-radar" className="underline font-medium">
            Skills Radar
          </Link>{" "}
          assessment and{" "}
          <Link href="/pm-quiz" className="underline font-medium">
            PM Type Quiz
          </Link>{" "}
          for a more impressive card. Share it on LinkedIn or Twitter to
          showcase your PM growth.
        </p>
      </div>
    </div>
  );
}
