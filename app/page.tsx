"use client";

import { useState } from "react";
import { useHasMounted } from "@/hooks/useHasMounted";
import DayStatusHero from "@/components/DayStatusHero";
import PeriodCountdown from "@/components/PeriodCountdown";
import QuickGlanceCards from "@/components/QuickGlanceCards";
import type { LunchWave } from "@/lib/schedule";

function readLunchWave(): LunchWave {
  if (typeof window === "undefined") return "11/12";
  const stored = localStorage.getItem("lakerwatch-lunch-wave");
  return stored === "9/10" || stored === "11/12" ? stored : "11/12";
}

export default function Dashboard() {
  const mounted = useHasMounted();
  const [lunchWave, setLunchWave] = useState<LunchWave>(readLunchWave);

  const handleWaveChange = () => {
    const next: LunchWave = lunchWave === "9/10" ? "11/12" : "9/10";
    setLunchWave(next);
    localStorage.setItem("lakerwatch-lunch-wave", next);
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col items-center text-center">
        <DayStatusHero />

        {mounted && (
          <button
            onClick={handleWaveChange}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-bg px-3 py-1 text-xs font-medium text-muted transition-colors hover:bg-border hover:text-text dark:border-dark-border dark:bg-dark-surface dark:text-dark-muted dark:hover:bg-white/10 dark:hover:text-dark-text"
            title="Toggle lunch wave"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Lunch: Grades {lunchWave}
          </button>
        )}

        <PeriodCountdown lunchWave={lunchWave} />
      </div>

      <QuickGlanceCards />
    </div>
  );
}
