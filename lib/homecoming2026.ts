import type { SchoolEvent } from "./events";
import { DATE_SCHEDULE_OVERRIDES, formatTime, type Period } from "./schedule";

function describePeriods(periods: Period[]): string {
  return periods.map((period) =>
    `${formatTime(period.start)}–${formatTime(period.end)}: ${period.name}${period.description ? ` — ${period.description}` : ""}`,
  ).join("\n");
}

function describeSchedule(date: string): string {
  const schedule = DATE_SCHEDULE_OVERRIDES[date];
  const heading = `WPS High School Homecoming Week Schedule\nAll times Eastern (America/New_York).\nSpirit Wear Theme: ${schedule.spiritWearTheme}`;
  if (date === "2026-10-16") {
    return `${heading}\n\nGrades 9–12 (shared HOCO Cookout Lunch):\n${describePeriods(schedule["9/10"])}`;
  }
  return `${heading}\n\nGrades 9/10:\n${describePeriods(schedule["9/10"])}\n\nGrades 11/12:\n${describePeriods(schedule["11/12"])}`;
}

export const HOMECOMING_CALENDAR_EVENTS: (SchoolEvent & { key: string; description: string })[] = [
  {
    key: "2026-10-15-assembly-schedule",
    date: "2026-10-15",
    name: "Homecoming — Lip Sync Battle & All Periods",
    type: "event",
    description: describeSchedule("2026-10-15"),
  },
  {
    // Keep the seeded source key so the correction replaces the existing entry.
    key: "2026-10-16-eight-period",
    date: "2026-10-16",
    name: "Homecoming — Parade, Pep Rally & Cookout",
    type: "event",
    description: describeSchedule("2026-10-16"),
  },
];

const LEGACY_NAMES = [
  "Homecoming Week — Assembly Schedule",
  "Homecoming Week — 8 Period Day",
];

/** Apply the published correction on reads without reseeding unrelated database events. */
export function applyHomecomingCalendarUpdates<T extends {
  date: string;
  name: string;
  sourceKey?: string | null;
}>(events: T[]): T[] {
  return events.map((event) => {
    const update = HOMECOMING_CALENDAR_EVENTS.find((candidate, index) =>
      event.date === candidate.date && (
        event.sourceKey === `wps-hs-2026-2027:${candidate.key}` ||
        event.name === LEGACY_NAMES[index] || event.name === candidate.name
      ),
    );
    if (!update) return event;
    return { ...event, name: update.name, description: update.description };
  });
}
