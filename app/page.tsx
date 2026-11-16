"use client";

import { useState, useEffect } from "react";
import DayStatusHero from "@/components/DayStatusHero";
import PeriodCountdown from "@/components/PeriodCountdown";
import QuickGlanceCards from "@/components/QuickGlanceCards";
import AnnouncementsFeed from "@/components/AnnouncementsFeed";
import { useLunchWave } from "@/hooks/useLunchWave";
import type { Announcement } from "@/lib/announcements";
import type { SchoolEvent } from "@/lib/events";
import { formatDateStr } from "@/lib/schedule";
import { getDevDate } from "@/lib/devTime";

const REFRESH_INTERVAL_MS = 60_000;

async function readDashboardFeed<T>(path: string, signal: AbortSignal): Promise<T[]> {
  const response = await fetch(path + "?view=dashboard", { signal });
  if (!response.ok) throw new Error("Could not load " + path);
  const data = await response.json();
  if (!Array.isArray(data)) throw new Error("Invalid feed from " + path);
  return data;
}

export default function Dashboard() {
  const { lunchWave } = useLunchWave();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<SchoolEvent[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    let nextRefresh = 0;
    let inFlight = false;

    async function refresh() {
      clearTimeout(timer);
      if (controller.signal.aborted || document.hidden || inFlight) return;

      const remaining = nextRefresh - Date.now();
      if (remaining > 0) {
        timer = setTimeout(refresh, remaining);
        return;
      }

      inFlight = true;
      await Promise.allSettled([
        readDashboardFeed<Announcement>("/api/announcements", controller.signal).then(setAnnouncements),
        readDashboardFeed<SchoolEvent>("/api/events", controller.signal).then(setEvents),
      ]);
      inFlight = false;
      nextRefresh = Date.now() + REFRESH_INTERVAL_MS;
      if (!controller.signal.aborted && !document.hidden) {
        timer = setTimeout(refresh, REFRESH_INTERVAL_MS);
      }
    }

    void refresh();
    document.addEventListener("visibilitychange", refresh);
    return () => {
      controller.abort();
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  const today = formatDateStr(getDevDate(new Date()));
  const isEarlyDismissal = events.some(
    (event) => event.type === "early-dismissal" &&
      event.date <= today && (event.endDate ?? event.date) >= today
  );
  const hasAnnouncements = announcements.length > 0;

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-2xl border border-border bg-white p-6 pb-8 shadow-sm dark:border-dark-border dark:bg-dark-surface dark:shadow-none">
        {hasAnnouncements ? (
          <div className="flex flex-col lg:flex-row lg:gap-8">
            {/* Left: Clock area — this sets the card's natural height */}
            <div className="flex flex-col items-center text-center lg:flex-1">
              <DayStatusHero isEarlyDismissal={isEarlyDismissal} />
              <PeriodCountdown lunchWave={lunchWave} />
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-border dark:border-dark-border lg:my-0 lg:border-l lg:border-t-0" />

            {/* Right: Announcements — scrolls if taller than the clock */}
            <div className="max-h-[420px] lg:w-[340px] lg:max-h-none lg:shrink-0 lg:self-stretch lg:overflow-hidden">
              <AnnouncementsFeed announcements={announcements} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <DayStatusHero isEarlyDismissal={isEarlyDismissal} />
            <PeriodCountdown lunchWave={lunchWave} />
          </div>
        )}
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted dark:text-dark-muted">
          At a Glance
        </p>
        <QuickGlanceCards events={events} />
      </div>
    </div>
  );
}
