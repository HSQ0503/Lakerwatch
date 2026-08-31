"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  type FlikDay,
  parseFlikDay,
  formatLunchDate,
  getWeekdayDays,
} from "@/lib/lunch";

export default function LunchPreview() {
  const [headline, setHeadline] = useState<string | null>(null);
  const [subtitle, setSubtitle] = useState("Loading...");

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 12_000);
    let active = true;

    fetch("/api/lunch", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data: { days: FlikDay[] }) => {
        if (!active) return;

        const today = formatLunchDate(new Date());
        const weekdays = getWeekdayDays(data.days);
        const todayMenu = weekdays.find((d) => d.date === today);

        if (!todayMenu) {
          setHeadline("No menu today");
          setSubtitle("Check back on a school day");
          return;
        }

        const stations = parseFlikDay(todayMenu);
        if (stations.length === 0) {
          setHeadline("Menu not posted");
          setSubtitle("Check back later");
          return;
        }

        // Show the first Main Entrees item as the headline
        const mainEntree = stations.find((s) =>
          s.name.toLowerCase().includes("entree"),
        );
        const firstItem = mainEntree?.items[0] ?? stations[0].items[0];
        const totalItems = stations.reduce((n, s) => n + s.items.length, 0);

        setHeadline(firstItem.name);
        setSubtitle(
          totalItems > 1
            ? `+ ${totalItems - 1} more item${totalItems - 1 === 1 ? "" : "s"}`
            : stations[0].name,
        );
      })
      .catch(() => {
        if (!active) return;
        setHeadline("Menu unavailable");
        setSubtitle("View on FLIK Dining");
      })
      .finally(() => {
        window.clearTimeout(timeoutId);
      });

    return () => {
      active = false;
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  return (
    <Link
      href="/lunch"
      className="rounded-xl border border-red/15 border-l-[3px] border-l-red bg-white p-5 shadow-sm transition-all hover:shadow-md hover:bg-red/5 dark:border-dark-border dark:border-l-red dark:bg-dark-surface dark:shadow-none dark:backdrop-blur-md dark:hover:bg-white/10"
    >
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-red dark:text-red-light">
        Today&apos;s Lunch
      </p>
      <p className="font-display text-lg font-bold text-text dark:text-dark-text">
        {headline ?? "Loading..."}
      </p>
      <p className="mt-1 truncate text-sm text-muted dark:text-dark-muted">
        {subtitle}
      </p>
    </Link>
  );
}
