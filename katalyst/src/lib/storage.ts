"use client";

export interface UserProgress {
  streak: number;
  lastActiveDate: string;
  totalXP: number;
  level: string;
  challengesCompleted: number;
  interviewQsCompleted: number;
  lessonsCompleted: string[];
  radarScores: Record<string, number> | null;
  pmType: string | null;
  quizAnswers: Record<string, number>;
  caseSnacksCompleted: string[];
  frameworksExplored: string[];
  teardownsRead: string[];
  bookmarkedTerms: string[];
  chatHistory: { role: string; content: string }[];
  dailyChallengeHistory: Record<string, { answered: boolean; correct: boolean; questionId: string }>;
}

const DEFAULT_PROGRESS: UserProgress = {
  streak: 0,
  lastActiveDate: "",
  totalXP: 0,
  level: "Aspiring PM",
  challengesCompleted: 0,
  interviewQsCompleted: 0,
  lessonsCompleted: [],
  radarScores: null,
  pmType: null,
  quizAnswers: {},
  caseSnacksCompleted: [],
  frameworksExplored: [],
  teardownsRead: [],
  bookmarkedTerms: [],
  chatHistory: [],
  dailyChallengeHistory: {},
};

const STORAGE_KEY = "katalyst_progress";

export function getProgress(): UserProgress {
  if (typeof window === "undefined") return DEFAULT_PROGRESS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_PROGRESS;
    return { ...DEFAULT_PROGRESS, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(progress: Partial<UserProgress>): UserProgress {
  const current = getProgress();
  const updated = { ...current, ...progress };

  // Calculate level based on XP
  updated.level = calculateLevel(updated.totalXP);

  // Update streak
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  if (updated.lastActiveDate === today) {
    // Already active today, keep streak
  } else if (updated.lastActiveDate === yesterday) {
    updated.streak += 1;
  } else if (updated.lastActiveDate !== today) {
    if (updated.lastActiveDate === "") {
      updated.streak = 1;
    } else {
      updated.streak = 1; // Reset streak if missed a day
    }
  }
  updated.lastActiveDate = today;

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function addXP(amount: number): UserProgress {
  const current = getProgress();
  return saveProgress({ totalXP: current.totalXP + amount });
}

function calculateLevel(xp: number): string {
  if (xp >= 5000) return "CPO";
  if (xp >= 3500) return "PM Leader";
  if (xp >= 2000) return "Senior PM";
  if (xp >= 1000) return "PM";
  if (xp >= 300) return "Associate PM";
  return "Aspiring PM";
}

export function getLevelProgress(xp: number): { current: string; next: string; progress: number; currentMin: number; nextMin: number } {
  const levels = [
    { name: "Aspiring PM", min: 0 },
    { name: "Associate PM", min: 300 },
    { name: "PM", min: 1000 },
    { name: "Senior PM", min: 2000 },
    { name: "PM Leader", min: 3500 },
    { name: "CPO", min: 5000 },
  ];

  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i].min) {
      const next = levels[i + 1] || levels[i];
      const range = next.min - levels[i].min || 1;
      const progress = Math.min(((xp - levels[i].min) / range) * 100, 100);
      return { current: levels[i].name, next: next.name, progress, currentMin: levels[i].min, nextMin: next.min };
    }
  }
  return { current: "Aspiring PM", next: "Associate PM", progress: 0, currentMin: 0, nextMin: 300 };
}
