"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProgress, getLevelProgress } from "@/lib/storage";
import type { UserProgress } from "@/lib/storage";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

const PM_SKILLS = [
  "Strategy",
  "Execution",
  "Analytics",
  "UX Sense",
  "Technical",
  "Leadership",
  "Communication",
];

const PM_TYPE_DESCRIPTIONS: Record<string, { emoji: string; description: string }> = {
  "The Visionary": {
    emoji: "🔮",
    description: "You think big picture and love shaping product strategy from the top down.",
  },
  "The Builder": {
    emoji: "🛠️",
    description: "You thrive in execution, shipping features fast and iterating relentlessly.",
  },
  "The Analyst": {
    emoji: "📊",
    description: "Data drives your decisions. You find signal in noise and optimize ruthlessly.",
  },
  "The Designer": {
    emoji: "🎨",
    description: "You obsess over user experience and craft delightful product interactions.",
  },
  "The Technologist": {
    emoji: "⚙️",
    description: "You bridge engineering and product, leveraging deep technical understanding.",
  },
  "The Growth Hacker": {
    emoji: "🚀",
    description: "You focus on metrics, experiments, and rapid growth through clever tactics.",
  },
  "The Communicator": {
    emoji: "🗣️",
    description: "You rally teams around a vision and excel at stakeholder management.",
  },
};

interface Badge {
  id: string;
  label: string;
  emoji: string;
  description: string;
  earned: boolean;
}

function getBadges(progress: UserProgress): Badge[] {
  return [
    {
      id: "first-challenge",
      label: "First Challenge",
      emoji: "⚡",
      description: "Completed 1 challenge",
      earned: progress.challengesCompleted >= 1,
    },
    {
      id: "streak-starter",
      label: "Streak Starter",
      emoji: "🔥",
      description: "3 day streak",
      earned: progress.streak >= 3,
    },
    {
      id: "week-warrior",
      label: "Week Warrior",
      emoji: "🗓️",
      description: "7 day streak",
      earned: progress.streak >= 7,
    },
    {
      id: "ai-pm-student",
      label: "AI PM Student",
      emoji: "🤖",
      description: "Completed 3 AI lessons",
      earned: progress.lessonsCompleted.length >= 3,
    },
    {
      id: "framework-explorer",
      label: "Framework Explorer",
      emoji: "🧩",
      description: "Explored 10 frameworks",
      earned: progress.frameworksExplored.length >= 10,
    },
    {
      id: "interview-ready",
      label: "Interview Ready",
      emoji: "💼",
      description: "Completed 20 interview questions",
      earned: progress.interviewQsCompleted >= 20,
    },
    {
      id: "glossary-guru",
      label: "Glossary Guru",
      emoji: "📖",
      description: "Bookmarked 10 terms",
      earned: progress.bookmarkedTerms.length >= 10,
    },
    {
      id: "speed-reader",
      label: "Speed Reader",
      emoji: "🔍",
      description: "Read 5 teardowns",
      earned: progress.teardownsRead.length >= 5,
    },
    {
      id: "case-cracker",
      label: "Case Cracker",
      emoji: "🍿",
      description: "Solved 10 case snacks",
      earned: progress.caseSnacksCompleted.length >= 10,
    },
    {
      id: "centurion",
      label: "Centurion",
      emoji: "🏆",
      description: "Earned 1000 XP",
      earned: progress.totalXP >= 1000,
    },
  ];
}

export default function DashboardPage() {
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  if (!progress) {
    return <div className="shimmer h-96 rounded-xl" />;
  }

  const levelInfo = getLevelProgress(progress.totalXP);
  const badges = getBadges(progress);
  const earnedCount = badges.filter((b) => b.earned).length;

  // Stats overview data
  const stats = [
    { icon: "🔥", value: progress.streak, label: "Current Streak", suffix: "days" },
    { icon: "✨", value: progress.totalXP, label: "Total XP", suffix: "" },
    { icon: "🎖️", value: levelInfo.current, label: "Current Level", suffix: "" },
    { icon: "⚡", value: progress.challengesCompleted, label: "Challenges Done", suffix: "" },
    { icon: "💼", value: progress.interviewQsCompleted, label: "Interview Qs Done", suffix: "" },
    { icon: "📚", value: progress.lessonsCompleted.length, label: "Lessons Done", suffix: "" },
  ];

  // Activity breakdown data for BarChart
  const activityData = [
    { name: "Challenges", completed: progress.challengesCompleted },
    { name: "Interview", completed: progress.interviewQsCompleted },
    { name: "Lessons", completed: progress.lessonsCompleted.length },
    { name: "Teardowns", completed: progress.teardownsRead.length },
    { name: "Cases", completed: progress.caseSnacksCompleted.length },
    { name: "Frameworks", completed: progress.frameworksExplored.length },
  ];

  // Radar chart data
  const radarData = progress.radarScores
    ? PM_SKILLS.map((skill) => ({
        skill,
        score: progress.radarScores?.[skill] ?? 0,
        fullMark: 5,
      }))
    : null;

  // PM Type info
  const pmTypeInfo = progress.pmType ? PM_TYPE_DESCRIPTIONS[progress.pmType] : null;

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">Progress Dashboard</h1>
        <p className="text-muted">Track your journey to becoming a world-class PM</p>
      </div>

      {/* Stats Overview - 6 stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-border rounded-xl p-5 flex items-center gap-4 card-hover"
          >
            <span className="text-3xl shrink-0">{stat.icon}</span>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {stat.value}
                {stat.suffix && (
                  <span className="text-sm font-normal text-muted ml-1">{stat.suffix}</span>
                )}
              </div>
              <div className="text-xs text-muted mt-0.5">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Level Progress */}
      <div className="bg-white border border-border rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-foreground text-lg">Level Progress</h2>
          <span className="text-sm text-muted">
            {levelInfo.next !== levelInfo.current
              ? `Next: ${levelInfo.next}`
              : "Max Level Reached!"}
          </span>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-sm font-medium text-primary-dark whitespace-nowrap">
            {levelInfo.current}
          </span>
          <div className="w-full bg-gray-100 rounded-full h-4 relative overflow-hidden">
            <div
              className="h-4 rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700"
              style={{ width: `${levelInfo.progress}%` }}
            />
          </div>
          <span className="text-sm font-medium text-muted whitespace-nowrap">
            {levelInfo.next !== levelInfo.current ? levelInfo.next : ""}
          </span>
        </div>
        <div className="flex justify-between text-xs text-muted">
          <span>{levelInfo.currentMin} XP</span>
          <span className="font-semibold text-foreground">{progress.totalXP} XP</span>
          <span>
            {levelInfo.next !== levelInfo.current ? `${levelInfo.nextMin} XP` : ""}
          </span>
        </div>

        {/* Level milestones */}
        <div className="flex items-center gap-1 mt-4 overflow-x-auto pb-2">
          {["Aspiring PM", "Associate PM", "PM", "Senior PM", "PM Leader", "CPO"].map(
            (level, i) => {
              const mins = [0, 300, 1000, 2000, 3500, 5000];
              const isActive = progress.totalXP >= mins[i];
              return (
                <div key={level} className="flex items-center">
                  <div
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                      isActive
                        ? "bg-primary/10 text-primary-dark border border-primary/30"
                        : "bg-gray-100 text-muted"
                    }`}
                  >
                    {level}
                  </div>
                  {i < 5 && (
                    <div
                      className={`w-4 h-0.5 ${isActive ? "bg-primary/30" : "bg-gray-200"}`}
                    />
                  )}
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* Two-column layout: Radar + Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Skills Radar */}
        <div className="bg-white border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground text-lg">Skills Radar</h2>
            {radarData && (
              <Link
                href="/skills-radar"
                className="text-sm text-primary hover:underline"
              >
                Retake Assessment →
              </Link>
            )}
          </div>
          {radarData ? (
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis
                    dataKey="skill"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 5]}
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                    tickCount={6}
                  />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.25}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-72 text-center">
              <span className="text-5xl mb-4">🎯</span>
              <p className="text-muted mb-4">
                Take the Skills Assessment to see your PM strengths
              </p>
              <Link
                href="/skills-radar"
                className="bg-primary text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-primary-dark transition-colors"
              >
                Take Skills Assessment
              </Link>
            </div>
          )}
        </div>

        {/* Activity Breakdown - Bar Chart */}
        <div className="bg-white border border-border rounded-xl p-6">
          <h2 className="font-semibold text-foreground text-lg mb-4">
            Activity Breakdown
          </h2>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={activityData}
                margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  axisLine={{ stroke: "#e2e8f0" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={{ stroke: "#e2e8f0" }}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "13px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                  cursor={{ fill: "rgba(99,102,241,0.06)" }}
                />
                <Bar
                  dataKey="completed"
                  name="Completed"
                  fill="#6366f1"
                  radius={[6, 6, 0, 0]}
                  barSize={36}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* PM Type */}
      <div className="bg-white border border-border rounded-xl p-6 mb-8">
        <h2 className="font-semibold text-foreground text-lg mb-4">PM Type</h2>
        {progress.pmType && pmTypeInfo ? (
          <div className="flex items-center gap-5">
            <span className="text-5xl">{pmTypeInfo.emoji}</span>
            <div>
              <h3 className="text-xl font-bold text-foreground">{progress.pmType}</h3>
              <p className="text-muted mt-1">{pmTypeInfo.description}</p>
              <Link
                href="/pm-quiz"
                className="text-sm text-primary hover:underline mt-2 inline-block"
              >
                Retake Quiz →
              </Link>
            </div>
          </div>
        ) : progress.pmType ? (
          <div className="flex items-center gap-5">
            <span className="text-5xl">🎭</span>
            <div>
              <h3 className="text-xl font-bold text-foreground">{progress.pmType}</h3>
              <Link
                href="/pm-quiz"
                className="text-sm text-primary hover:underline mt-2 inline-block"
              >
                Retake Quiz →
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <span className="text-5xl mb-4">🎭</span>
            <p className="text-muted mb-4">
              Discover what kind of Product Manager you are
            </p>
            <Link
              href="/pm-quiz"
              className="bg-primary text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-primary-dark transition-colors"
            >
              Take PM Type Quiz
            </Link>
          </div>
        )}
      </div>

      {/* Achievements / Badges */}
      <div className="bg-white border border-border rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-foreground text-lg">Achievements</h2>
          <span className="text-sm text-muted">
            {earnedCount}/{badges.length} earned
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`flex flex-col items-center text-center p-4 rounded-xl transition-all ${
                badge.earned
                  ? "bg-gradient-to-b from-indigo-50 to-purple-50 border border-indigo-200"
                  : "bg-gray-50 border border-gray-200 opacity-50 grayscale"
              }`}
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-2 ${
                  badge.earned
                    ? "bg-white shadow-lg shadow-indigo-200/50"
                    : "bg-gray-100"
                }`}
                style={
                  badge.earned
                    ? {
                        boxShadow:
                          "0 0 16px rgba(99, 102, 241, 0.3), 0 4px 12px rgba(99, 102, 241, 0.15)",
                      }
                    : undefined
                }
              >
                {badge.emoji}
              </div>
              <span
                className={`text-xs font-semibold mt-1 ${
                  badge.earned ? "text-foreground" : "text-muted"
                }`}
              >
                {badge.label}
              </span>
              <span className="text-[10px] text-muted mt-0.5 leading-tight">
                {badge.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
