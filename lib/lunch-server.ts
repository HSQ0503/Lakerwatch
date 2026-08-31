import { Prisma, type LunchMenu } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  type FlikDay,
  getWeekSundayFromDate,
  isLunchDate,
  shiftLunchDate,
} from "@/lib/lunch";

const FLIK_BASE_URL =
  "https://wps.api.flikisdining.com/menu/api/weeks/school/windermere-prep-school/menu-type/lunch";
const FLIK_FETCH_TIMEOUT_MS = 10_000;
const EMPTY_MENU_RETRY_MS = 15 * 60 * 1_000;
const PUBLISHED_MENU_REFRESH_MS = 6 * 60 * 60 * 1_000;
const FAILED_ON_DEMAND_RETRY_MS = 60 * 1_000;

const inFlightSyncs = new Map<string, Promise<LunchMenu>>();
const failedOnDemandSyncs = new Map<string, number>();

export class FlikMenuError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "FlikMenuError";
  }
}

function isFlikDay(value: unknown): value is FlikDay {
  if (!value || typeof value !== "object") return false;

  const day = value as Record<string, unknown>;
  return (
    typeof day.date === "string" &&
    isLunchDate(day.date) &&
    Array.isArray(day.menu_items)
  );
}

function hasFoodItem(day: FlikDay): boolean {
  return day.menu_items.some(
    (item) =>
      item.food &&
      typeof item.food.name === "string" &&
      item.food.name.trim().length > 0,
  );
}

export function hasPublishedLunchItems(days: unknown): boolean {
  return Array.isArray(days) && days.every(isFlikDay) && days.some(hasFoodItem);
}

export function shouldRefreshLunchMenu(
  menu: Pick<LunchMenu, "days" | "updatedAt">,
  now = new Date(),
): boolean {
  const refreshAfter = hasPublishedLunchItems(menu.days)
    ? PUBLISHED_MENU_REFRESH_MS
    : EMPTY_MENU_RETRY_MS;

  return now.getTime() - menu.updatedAt.getTime() >= refreshAfter;
}

export function canSyncLunchWeekOnDemand(
  weekStart: string,
  currentWeek: string,
): boolean {
  return (
    weekStart === currentWeek ||
    weekStart === shiftLunchDate(currentWeek, 7)
  );
}

export function getFlikWeekUrl(weekStart: string): string {
  if (
    !isLunchDate(weekStart) ||
    getWeekSundayFromDate(weekStart) !== weekStart
  ) {
    throw new Error(`Invalid FLIK week start: ${weekStart}`);
  }

  const [year, month, day] = weekStart.split("-").map(Number);
  return `${FLIK_BASE_URL}/${year}/${month}/${day}/`;
}

export async function fetchFlikWeek(weekStart: string): Promise<FlikDay[]> {
  const response = await fetch(getFlikWeekUrl(weekStart), {
    headers: { Accept: "application/json" },
    cache: "no-store",
    signal: AbortSignal.timeout(FLIK_FETCH_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new FlikMenuError(
      `FLIK API returned ${response.status}`,
      response.status,
    );
  }

  const payload: unknown = await response.json();
  if (!payload || typeof payload !== "object") {
    throw new FlikMenuError("FLIK API returned an invalid response");
  }

  const days = (payload as Record<string, unknown>).days;
  if (!Array.isArray(days) || !days.every(isFlikDay)) {
    throw new FlikMenuError("FLIK API returned invalid menu days");
  }

  return days;
}

async function fetchAndPersistLunchWeek(weekStart: string): Promise<LunchMenu> {
  const days = await fetchFlikWeek(weekStart);

  return prisma.lunchMenu.upsert({
    where: { weekStart },
    update: { days: days as unknown as Prisma.InputJsonValue },
    create: {
      weekStart,
      days: days as unknown as Prisma.InputJsonValue,
    },
  });
}

export function syncLunchWeek(weekStart: string): Promise<LunchMenu> {
  const existingSync = inFlightSyncs.get(weekStart);
  if (existingSync) return existingSync;

  const sync = fetchAndPersistLunchWeek(weekStart).finally(() => {
    if (inFlightSyncs.get(weekStart) === sync) {
      inFlightSyncs.delete(weekStart);
    }
  });

  inFlightSyncs.set(weekStart, sync);
  return sync;
}

export async function syncLunchWeekOnDemand(
  weekStart: string,
): Promise<LunchMenu> {
  const retryAfter = failedOnDemandSyncs.get(weekStart);
  if (retryAfter && retryAfter > Date.now()) {
    throw new FlikMenuError("FLIK retry is temporarily paused");
  }

  try {
    const menu = await syncLunchWeek(weekStart);
    failedOnDemandSyncs.delete(weekStart);
    return menu;
  } catch (error) {
    failedOnDemandSyncs.set(
      weekStart,
      Date.now() + FAILED_ON_DEMAND_RETRY_MS,
    );
    throw error;
  }
}
