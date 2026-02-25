"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getProgress, saveProgress, getLevelProgress } from "@/lib/storage";

const features = [
  {
    href: "/daily-challenge",
    icon: "⚡",
    title: "Daily Challenge",
    desc: "One PM question a day keeps mediocrity away",
    color: "from-yellow-400 to-orange-500",
    tag: "Daily",
  },
  {
    href: "/ai-pm-module",
    icon: "🤖",
    title: "AI PM Mastery",
    desc: "Master AI product management from zero to expert",
    color: "from-purple-500 to-indigo-600",
    tag: "10 Lessons",
  },
  {
    href: "/skills-radar",
    icon: "🎯",
    title: "Skills Radar",
    desc: "Discover your PM strengths and growth areas",
    color: "from-blue-500 to-cyan-500",
    tag: "Assessment",
  },
  {
    href: "/interview-prep",
    icon: "💼",
    title: "Interview Prep",
    desc: "60+ questions from Google, Meta, Flipkart & more",
    color: "from-green-500 to-emerald-600",
    tag: "60+ Qs",
  },
  {
    href: "/teardowns",
    icon: "🔍",
    title: "Product Teardowns",
    desc: "Deep dives into ChatGPT, CRED, Spotify & more",
    color: "from-pink-500 to-rose-600",
    tag: "12 Products",
  },
  {
    href: "/case-snacks",
    icon: "🍿",
    title: "Case Snacks",
    desc: "Bite-sized product cases you can solve in 2 min",
    color: "from-amber-500 to-yellow-600",
    tag: "15 Cases",
  },
  {
    href: "/frameworks",
    icon: "🧩",
    title: "PM Frameworks",
    desc: "20 essential frameworks with AI applications",
    color: "from-violet-500 to-purple-600",
    tag: "Interactive",
  },
  {
    href: "/glossary",
    icon: "📖",
    title: "PM + AI Glossary",
    desc: "120+ terms every modern PM must know",
    color: "from-teal-500 to-green-600",
    tag: "120+ Terms",
  },
  {
    href: "/templates",
    icon: "📝",
    title: "Templates Hub",
    desc: "AI-generated PRDs, specs, and strategy docs",
    color: "from-sky-500 to-blue-600",
    tag: "AI-Powered",
  },
  {
    href: "/learning-path",
    icon: "🗺️",
    title: "Learning Path",
    desc: "Personalized roadmap based on your skill gaps",
    color: "from-indigo-500 to-violet-600",
    tag: "Personalized",
  },
  {
    href: "/news",
    icon: "📰",
    title: "News & Trends",
    desc: "AI-summarized product and tech news feed",
    color: "from-red-500 to-pink-600",
    tag: "AI Summary",
  },
  {
    href: "/pm-quiz",
    icon: "🎭",
    title: "PM Type Quiz",
    desc: "Discover what kind of PM you really are",
    color: "from-fuchsia-500 to-pink-600",
    tag: "Fun Quiz",
  },
  {
    href: "/scorecard",
    icon: "🏆",
    title: "PM Scorecard",
    desc: "Generate & share your PM achievement card",
    color: "from-yellow-500 to-amber-600",
    tag: "Shareable",
  },
  {
    href: "/dashboard",
    icon: "📊",
    title: "Progress Dashboard",
    desc: "Track streaks, XP, and your PM growth journey",
    color: "from-cyan-500 to-teal-600",
    tag: "Analytics",
  },
  {
    href: "/mentor",
    icon: "💬",
    title: "AI PM Mentor",
    desc: "Ask anything about product management to AI",
    color: "from-emerald-500 to-teal-600",
    tag: "Chat",
  },
];

export default function Home() {
  const [progress, setProgress] = useState<ReturnType<typeof getProgress> | null>(null);

  useEffect(() => {
    const p = saveProgress({});
    setProgress(p);
  }, []);

  const levelInfo = progress ? getLevelProgress(progress.totalXP) : null;

  return (
    <div className="fade-in">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-500 p-8 sm:p-12 mb-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-3xl">⚡</span>
            <span className="text-3xl sm:text-4xl font-bold">Katalyst</span>
          </div>
          <p className="text-lg sm:text-xl text-white/90 mb-6 max-w-2xl">
            Your AI-powered platform to become a world-class Product Manager.
            Practice daily, master AI PM skills, and accelerate your career.
          </p>
          <div className="flex flex-wrap gap-3">
            {progress && (
              <>
                <div className="bg-white/15 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2">
                  <span>🔥</span>
                  <span className="font-semibold">{progress.streak} Day Streak</span>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2">
                  <span>✨</span>
                  <span className="font-semibold">{progress.totalXP} XP</span>
                </div>
                {levelInfo && (
                  <div className="bg-white/15 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2">
                    <span>🎖️</span>
                    <span className="font-semibold">{levelInfo.current}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Link
          href="/daily-challenge"
          className="bg-primary text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          ⚡ Today&apos;s Challenge
        </Link>
        <Link
          href="/mentor"
          className="bg-white border border-border text-foreground px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-surface-hover transition-colors flex items-center gap-2"
        >
          💬 Ask AI Mentor
        </Link>
        <Link
          href="/pm-quiz"
          className="bg-white border border-border text-foreground px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-surface-hover transition-colors flex items-center gap-2"
        >
          🎭 Take PM Quiz
        </Link>
      </div>

      {/* Feature Grid */}
      <h2 className="text-xl font-bold text-foreground mb-4">Explore All Features</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f) => (
          <Link
            key={f.href}
            href={f.href}
            className="group bg-white border border-border rounded-xl p-5 card-hover block"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">{f.icon}</span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-gradient-to-r ${f.color} text-white`}>
                {f.tag}
              </span>
            </div>
            <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
              {f.title}
            </h3>
            <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-sm text-muted pb-8">
        <p>Built to help you become a world-class PM, one day at a time.</p>
        <p className="mt-1">Powered by AI. Designed for ambition.</p>
      </div>
    </div>
  );
}
