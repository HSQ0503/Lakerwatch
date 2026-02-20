"use client";

import { useState, useEffect } from "react";
import { useHasMounted } from "@/hooks/useHasMounted";
import {
  getScheduleForDay,
  getCurrentPeriod,
  getTimeRemaining,
  getNextPeriod,
  getPeriodProgress,
  isSchoolOver,
  isBeforeSchool,
  getSchoolStartCountdown,
  getPassingTimeInfo,
  formatTime,
  getEffectiveDayOfWeek,
  isNoSchoolDate,
  formatDateStr,
  getNextSchoolDay,
  type LunchWave,
} from "@/lib/schedule";

const BADGE_COLORS = {
  monday: "border-border bg-bg text-text",
  odd: "border-navy/20 bg-navy text-white",
  even: "border-red/20 bg-red text-white",
};

function formatCountdown(seconds: number): string {
  if (seconds <= 0) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function PeriodCountdown({
  lunchWave,
}: {
  lunchWave: LunchWave;
}) {
  const mounted = useHasMounted();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto mb-4 h-6 w-48 animate-pulse rounded bg-border" />
        <div className="mx-auto mb-4 h-16 w-56 animate-pulse rounded-lg bg-border" />
        <div className="mx-auto h-2 w-64 animate-pulse rounded-full bg-border" />
      </div>
    );
  }

  const dateStr = formatDateStr(now);
  const dayOfWeek = now.getDay();

  if (dayOfWeek === 0 || dayOfWeek === 6 || isNoSchoolDate(dateStr)) {
    return null;
  }

  const effectiveDow = getEffectiveDayOfWeek(now);
  const schedule = getScheduleForDay(effectiveDow, lunchWave);

  if (schedule.length === 0) return null;

  // School is over
  if (isSchoolOver(schedule, now)) {
    const next = getNextSchoolDay(now);
    const badgeColor = next ? BADGE_COLORS[next.dayType] : "";

    return (
      <div className="py-8 text-center">
        <p className="text-2xl font-medium text-muted">
          School&apos;s over — enjoy your evening!
        </p>
        {next && (
          <div className="mt-5 flex items-center justify-center gap-2">
            <p className="text-base text-muted">
              {next.isTomorrow ? "Tomorrow" : next.dayName} is
            </p>
            <span
              className={`inline-block rounded-full border px-3 py-1 font-display text-sm font-bold uppercase tracking-wider ${badgeColor}`}
            >
              {next.label}
            </span>
          </div>
        )}
      </div>
    );
  }

  // Before school
  if (isBeforeSchool(schedule, now)) {
    const seconds = getSchoolStartCountdown(schedule, now);
    return (
      <div className="py-8 text-center">
        <p className="mb-3 text-xl text-muted">School starts in</p>
        <p className="font-mono text-6xl font-bold tabular-nums text-navy md:text-7xl lg:text-8xl">
          {formatCountdown(Math.max(0, seconds))}
        </p>
      </div>
    );
  }

  // Currently in a period
  const currentPeriod = getCurrentPeriod(schedule, now);

  if (currentPeriod) {
    const remaining = getTimeRemaining(currentPeriod, now);
    const progress = getPeriodProgress(currentPeriod, now);
    const nextPeriod = getNextPeriod(schedule, now);

    return (
      <div className="py-8 text-center">
        <p className="mb-3 font-display text-2xl font-bold text-navy md:text-3xl">
          {currentPeriod.name}
        </p>
        <p className="font-mono text-6xl font-bold tabular-nums text-navy md:text-7xl lg:text-8xl">
          {formatCountdown(Math.max(0, remaining))}
        </p>
        <div className="mx-auto mt-5 max-w-sm">
          <div className="h-2 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-gradient-to-r from-navy to-red transition-all duration-1000"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
        {nextPeriod && (
          <p className="mt-4 text-base text-muted">
            Next up:{" "}
            <span className="font-medium text-text">{nextPeriod.name}</span> at{" "}
            {formatTime(nextPeriod.start)}
          </p>
        )}
      </div>
    );
  }

  // Passing time
  const passingInfo = getPassingTimeInfo(schedule, now);
  if (passingInfo) {
    return (
      <div className="py-8 text-center">
        <p className="mb-3 text-xl text-muted">
          Passing period —{" "}
          <span className="font-medium text-text">
            {passingInfo.nextPeriod.name}
          </span>{" "}
          starts in
        </p>
        <p className="font-mono text-6xl font-bold tabular-nums text-red md:text-7xl lg:text-8xl">
          {formatCountdown(Math.max(0, passingInfo.secondsUntil))}
        </p>
      </div>
    );
  }

  return null;
}
