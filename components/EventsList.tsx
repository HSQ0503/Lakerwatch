"use client";

import { useState, useEffect } from "react";
import { useHasMounted } from "@/hooks/useHasMounted";
import { type SchoolEvent, daysUntil } from "@/lib/events";

function formatEventDate(event: SchoolEvent): string {
  const date = new Date(event.date + "T12:00:00");
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };
  const start = date.toLocaleDateString("en-US", options);

  if (event.endDate) {
    const end = new Date(event.endDate + "T12:00:00");
    const endDay = end.toLocaleDateString("en-US", { day: "numeric" });
    return `${start}\u2013${endDay}`;
  }

  return start;
}

function getMonthYear(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

const TYPE_STYLES: Record<
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
  event: { border: "border-border dark:border-dark-border", bg: "bg-white dark:bg-dark-surface", dot: "bg-red dark:bg-red-light" },
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

export default function EventsList() {
  const mounted = useHasMounted();
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPast, setShowPast] = useState(false);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (!mounted || loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-xl bg-border" />
        ))}
      </div>
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

  const filteredEvents = showPast
    ? events
    : events.filter((e) => {
        const compareDate = e.endDate || e.date;
        return compareDate >= todayStr;
      });

  // Group by month
  const grouped: Record<string, SchoolEvent[]> = {};
  for (const event of filteredEvents) {
    const month = getMonthYear(event.date);
    if (!grouped[month]) grouped[month] = [];
    grouped[month].push(event);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-text dark:text-dark-text">
          School Events
        </h2>
        <button
          onClick={() => setShowPast(!showPast)}
          className="text-sm text-muted dark:text-dark-muted transition-colors hover:text-red dark:hover:text-dark-text"
        >
          {showPast ? "Hide past events" : "Show past events"}
        </button>
      </div>

      {Object.entries(grouped).map(([month, monthEvents]) => (
        <div key={month}>
          <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-muted dark:text-dark-muted">
            {month}
          </h3>
          <div className="space-y-2">
            {monthEvents.map((event, i) => {
              const days = daysUntil(event.date);
              const isPast = days < 0;
              const style = TYPE_STYLES[event.type];

              return (
                <div
                  key={event.id || `${event.date}-${i}`}
                  className={`rounded-xl border p-4 ${style.border} ${style.bg} ${isPast ? "opacity-50" : ""}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-2 h-2 w-2 rounded-full ${style.dot}`}
                      />
                      <div>
                        <p className="font-medium text-text dark:text-dark-text">{event.name}</p>
                        <p className="text-sm text-muted dark:text-dark-muted">
                          {formatEventDate(event)}
                        </p>
                      </div>
                    </div>
                    {!isPast && (
                      <span className="whitespace-nowrap text-sm text-muted dark:text-dark-muted">
                        {days === 0
                          ? "Today"
                          : days === 1
                            ? "Tomorrow"
                            : `${days} days`}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {filteredEvents.length === 0 && (
        <p className="py-8 text-center text-muted dark:text-dark-muted">No upcoming events</p>
      )}
    </div>
  );
}
