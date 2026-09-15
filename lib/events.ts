export type SchoolEvent = {
  id?: string;
  date: string; // America/New_York calendar date, "YYYY-MM-DD"
  name: string;
  description?: string | null;
  type: "no-school" | "early-dismissal" | "event" | "exam" | "deadline";
  endDate?: string | null;
};

export const SCHOOL_TIME_ZONE = "America/New_York";

const SCHOOL_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: SCHOOL_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function dateKeyToUtc(dateStr: string): number {
  const [year, month, day] = dateStr.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

function parseSchoolDate(dateStr: string): Date {
  return new Date(`${dateStr}T12:00:00Z`);
}

export function getSchoolDateKey(date = new Date()): string {
  const parts = SCHOOL_DATE_FORMATTER.formatToParts(date);
  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value]),
  );
  return `${values.year}-${values.month}-${values.day}`;
}

export function formatSchoolDate(
  dateStr: string,
  options: Intl.DateTimeFormatOptions,
): string {
  return parseSchoolDate(dateStr).toLocaleDateString("en-US", {
    ...options,
    timeZone: SCHOOL_TIME_ZONE,
  });
}

export function formatEventDateRange(
  event: Pick<SchoolEvent, "date" | "endDate">,
  includeYear = false,
): string {
  const startOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    ...(includeYear ? { year: "numeric" } : {}),
  };
  const start = formatSchoolDate(event.date, startOptions);
  if (!event.endDate) return start;

  const [startYear, startMonth] = event.date.split("-");
  const [endYear, endMonth] = event.endDate.split("-");

  if (startYear === endYear && startMonth === endMonth) {
    const endDay = formatSchoolDate(event.endDate, { day: "numeric" });
    return includeYear
      ? `${start.replace(`, ${startYear}`, "")}–${endDay}, ${startYear}`
      : `${start}–${endDay}`;
  }

  const sameYear = startYear === endYear;
  const end = formatSchoolDate(event.endDate, {
    month: "short",
    day: "numeric",
    ...(includeYear || !sameYear ? { year: "numeric" } : {}),
  });
  const rangedStart =
    includeYear || !sameYear
      ? formatSchoolDate(event.date, {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : start;
  return `${rangedStart} – ${end}`;
}

export function daysUntil(dateStr: string, now = new Date()): number {
  const diff = dateKeyToUtc(dateStr) - dateKeyToUtc(getSchoolDateKey(now));
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

export function filterUpcoming(events: SchoolEvent[]): SchoolEvent[] {
  const todayStr = getSchoolDateKey();

  return events.filter((e) => {
    const compareDate = e.endDate || e.date;
    return compareDate >= todayStr;
  });
}

export function findNextNoSchool(events: SchoolEvent[]): SchoolEvent | null {
  const upcoming = filterUpcoming(events);
  return upcoming.find((e) => e.type === "no-school") ?? null;
}

export const TYPE_STYLES: Record<
  SchoolEvent["type"],
  { border: string; bg: string; dot: string }
> = {
  "no-school": {
    border: "border-red/20 dark:border-red/15",
    bg: "bg-red/5 dark:bg-red/10",
    dot: "bg-red",
  },
  "early-dismissal": {
    border: "border-red/15 dark:border-red/10",
    bg: "bg-red/5 dark:bg-red/10",
    dot: "bg-red-light",
  },
  event: {
    border: "border-border dark:border-dark-border",
    bg: "bg-white dark:bg-dark-surface",
    dot: "bg-red dark:bg-red-light",
  },
  exam: {
    border: "border-red/20 dark:border-red/15",
    bg: "bg-red/5 dark:bg-red/10",
    dot: "bg-red",
  },
  deadline: {
    border: "border-red/15 dark:border-red/10",
    bg: "bg-red/5 dark:bg-red/10",
    dot: "bg-red-light",
  },
};
