"use client";

import DayStatusHero from "@/components/DayStatusHero";
import PeriodCountdown from "@/components/PeriodCountdown";
import QuickGlanceCards from "@/components/QuickGlanceCards";
import { useLunchWave } from "@/hooks/useLunchWave";

export default function Dashboard() {
  const { lunchWave } = useLunchWave();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center text-center rounded-2xl border border-border bg-white p-6 pb-8 shadow-sm dark:border-dark-border dark:bg-dark-surface dark:shadow-none">
        <DayStatusHero />
        <PeriodCountdown lunchWave={lunchWave} />
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted dark:text-dark-muted">
          At a Glance
        </p>
        <QuickGlanceCards />
      </div>
    </div>
  );
}
