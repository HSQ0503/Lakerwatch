// --- Flik API raw types ---

export type FlikFood = {
  name: string;
  description?: string | null;
  rounded_nutrition_info?: {
    calories?: number | null;
    g_protein?: number | null;
  } | null;
  icons?: {
    food_icons?: { synced_name?: string; custom_icon_url?: string | null }[];
  } | null;
  serving_size_info?: {
    serving_size_amount?: string | null;
    serving_size_unit?: string | null;
  } | null;
};

export type FlikMenuItem = {
  is_section_title?: boolean;
  text?: string;
  food?: FlikFood | null;
};

export type FlikDay = {
  date: string;
  menu_items: FlikMenuItem[];
};

// --- Processed types for the frontend ---

export type LunchItem = {
  name: string;
  description?: string;
  calories?: number;
  allergens: string[];
};

export type LunchStation = {
  name: string;
  items: LunchItem[];
};

export type LunchDayMenu = {
  date: string;
  dayName: string;
  stations: LunchStation[];
};

// --- Utilities ---

export const SCHOOL_TIME_ZONE = "America/New_York";

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const lunchDateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: SCHOOL_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const LUNCH_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

function parseLunchDate(dateStr: string) {
  const match = LUNCH_DATE_PATTERN.exec(dateStr);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
}

function formatUtcDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = date.getUTCDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isLunchDate(dateStr: string): boolean {
  return parseLunchDate(dateStr) !== null;
}

export function shiftLunchDate(dateStr: string, days: number): string {
  const date = parseLunchDate(dateStr);
  if (!date) throw new Error(`Invalid lunch date: ${dateStr}`);

  date.setUTCDate(date.getUTCDate() + days);
  return formatUtcDate(date);
}

export function getWeekSundayFromDate(dateStr: string): string {
  const date = parseLunchDate(dateStr);
  if (!date) throw new Error(`Invalid lunch date: ${dateStr}`);

  date.setUTCDate(date.getUTCDate() - date.getUTCDay());
  return formatUtcDate(date);
}

export function getWeekSunday(date: Date = new Date()): string {
  return getWeekSundayFromDate(formatLunchDate(date));
}

export function formatLunchDate(date: Date): string {
  const parts = lunchDateFormatter.formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    throw new Error("Unable to format lunch date");
  }

  return `${year}-${month}-${day}`;
}

export function getDayName(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return DAY_NAMES[d.getDay()];
}

export function parseFlikDay(day: FlikDay): LunchStation[] {
  const stations: LunchStation[] = [];
  let current: LunchStation | null = null;

  for (const item of day.menu_items ?? []) {
    if (item.is_section_title && item.text) {
      current = { name: item.text, items: [] };
      stations.push(current);
    } else if (item.food && current) {
      current.items.push({
        name: item.food.name,
        description: item.food.description || undefined,
        calories: item.food.rounded_nutrition_info?.calories ?? undefined,
        allergens: (item.food.icons?.food_icons ?? [])
          .map((i) => i.synced_name ?? "")
          .filter(Boolean),
      });
    }
  }

  return stations.filter((s) => s.items.length > 0);
}

export function getTodayIndex(days: FlikDay[]): number {
  const today = formatLunchDate(new Date());
  const idx = days.findIndex((d) => d.date === today);
  if (idx !== -1) return idx;
  // Default to Monday (index 1) if today isn't in the array
  return 1;
}

export function getWeekdayDays(days: FlikDay[]): FlikDay[] {
  return days.filter((d) => {
    const dow = new Date(d.date + "T12:00:00").getDay();
    return dow >= 1 && dow <= 5;
  });
}
