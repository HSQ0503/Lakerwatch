"use client";

import { useHasMounted } from "@/hooks/useHasMounted";
import {
  getDayType,
  getDayTypeLabel,
  isNoSchoolDate,
  formatDateStr,
  getEffectiveDayOfWeek,
  isEarlyRelease,
  getNextSchoolDay,
} from "@/lib/schedule";

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const BADGE_COLORS = {
  monday: "border-border bg-bg text-text",
  odd: "border-navy/20 bg-navy text-white",
  even: "border-red/20 bg-red text-white",
};

export default function DayStatusHero() {
  const mounted = useHasMounted();

  if (!mounted) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto mb-3 h-10 w-64 animate-pulse rounded-lg bg-border" />
        <div className="mx-auto h-7 w-40 animate-pulse rounded-full bg-border" />
      </div>
    );
  }

  const now = new Date();
  const dayOfWeek = now.getDay();
  const dateStr = formatDateStr(now);
  const dayName = DAY_NAMES[dayOfWeek];

  if (dayOfWeek === 0 || dayOfWeek === 6 || isNoSchoolDate(dateStr)) {
    const next = getNextSchoolDay(now);
    const badgeColor = next ? BADGE_COLORS[next.dayType] : "";

    return (
      <div className="py-14 text-center">
        <p className="font-display text-4xl font-extrabold text-navy md:text-5xl lg:text-6xl">
          No School Today
        </p>
        <p className="mt-3 text-lg text-muted">Enjoy your time off!</p>
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

  const effectiveDow = getEffectiveDayOfWeek(now);
  const dayType = getDayType(effectiveDow);

  if (!dayType) return null;

  const dayTypeLabel = getDayTypeLabel(dayType);
  const earlyRelease = isEarlyRelease(dayOfWeek);
  const badgeColor = BADGE_COLORS[dayType];

  return (
    <div className="py-14 text-center">
      <p className="font-display text-4xl font-extrabold text-navy md:text-5xl lg:text-6xl">
        It&apos;s <span className="text-red">{dayName}</span>
      </p>
      <div className="mt-4 flex items-center justify-center gap-3">
        <span
          className={`inline-block rounded-full border px-4 py-1.5 font-display text-base font-bold uppercase tracking-wider ${badgeColor}`}
        >
          {dayTypeLabel}
        </span>
        {earlyRelease && (
          <span className="inline-block rounded-full border border-red/20 bg-red px-4 py-1.5 text-base font-bold text-white">
            Early Release
          </span>
        )}
      </div>
    </div>
  );
}
