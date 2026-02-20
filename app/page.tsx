"use client";

import DayStatusHero from "@/components/DayStatusHero";
import PeriodCountdown from "@/components/PeriodCountdown";
import QuickGlanceCards from "@/components/QuickGlanceCards";
import { useLunchWave } from "@/hooks/useLunchWave";

export default function Dashboard() {
  const { lunchWave } = useLunchWave();

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col items-center text-center">
        <DayStatusHero />
        <PeriodCountdown lunchWave={lunchWave} />
      </div>

      <QuickGlanceCards />
    </div>
  );
}
