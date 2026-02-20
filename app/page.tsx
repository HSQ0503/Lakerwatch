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
    <div className="space-y-8">
      <DayStatusHero />

      {mounted && (
        <div className="flex justify-center">
          <button
            onClick={handleWaveChange}
            className="flex items-center gap-2 text-xs text-muted transition-colors hover:text-light"
            title="Toggle lunch wave"
          >
            <svg
              className="h-4 w-4"
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
        </div>
      )}

      <PeriodCountdown lunchWave={lunchWave} />

      <QuickGlanceCards />
    </div>
  );
}
