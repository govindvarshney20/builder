"use client";

import { useEffect, useState } from "react";
import { getProgress, getLevelProgress } from "@/lib/storage";

export default function StreakBanner() {
  const [progress, setProgress] = useState<ReturnType<typeof getProgress> | null>(null);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  if (!progress) return null;

  const levelInfo = getLevelProgress(progress.totalXP);

  return (
    <div className="bg-white border border-border rounded-xl p-4 flex flex-wrap items-center gap-6">
      {/* Streak */}
      <div className="flex items-center gap-2">
        <span className="text-2xl streak-pulse">🔥</span>
        <div>
          <div className="text-lg font-bold text-foreground">{progress.streak}</div>
          <div className="text-xs text-muted">Day Streak</div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-8 w-px bg-border hidden sm:block" />

      {/* XP */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">✨</span>
        <div>
          <div className="text-lg font-bold text-foreground">{progress.totalXP}</div>
          <div className="text-xs text-muted">Total XP</div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-8 w-px bg-border hidden sm:block" />

      {/* Level */}
      <div className="flex-1 min-w-[200px]">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-semibold text-foreground">{levelInfo.current}</span>
          <span className="text-xs text-muted">{levelInfo.next !== levelInfo.current ? `→ ${levelInfo.next}` : "Max Level!"}</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
            style={{ width: `${levelInfo.progress}%` }}
          />
        </div>
        <div className="text-xs text-muted mt-0.5">{progress.totalXP} / {levelInfo.nextMin} XP</div>
      </div>
    </div>
  );
}
