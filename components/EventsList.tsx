"use client";

import { useState, useEffect } from "react";
import { useHasMounted } from "@/hooks/useHasMounted";
import {
  type SchoolEvent,
  daysUntil,
  formatEventDateRange,
  formatSchoolDate,
  getSchoolDateKey,
  TYPE_STYLES,
} from "@/lib/events";
import CalendarView from "@/components/CalendarView";
import EventDetailsDialog from "@/components/EventDetailsDialog";

function getMonthYear(dateStr: string): string {
  return formatSchoolDate(dateStr, { month: "long", year: "numeric" });
}

export default function EventsList() {
  const mounted = useHasMounted();
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPast, setShowPast] = useState(false);
  const [viewMode, setViewMode] = useState<"cards" | "calendar">("calendar");
  const [selectedEvent, setSelectedEvent] = useState<SchoolEvent | null>(null);

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

  const todayStr = getSchoolDateKey();

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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-lg font-bold text-text dark:text-dark-text">
          School Events
        </h2>
        <div className="flex items-center gap-3">
          {viewMode === "cards" && (
            <button
              onClick={() => setShowPast(!showPast)}
              className="text-sm text-muted transition-colors hover:text-red dark:text-dark-muted dark:hover:text-dark-text"
            >
              {showPast ? "Hide past events" : "Show past events"}
            </button>
          )}
          <div className="flex gap-1 rounded-lg border border-border bg-white p-1 dark:border-dark-border dark:bg-dark-surface">
            {(["cards", "calendar"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  viewMode === mode
                    ? "bg-red text-white"
                    : "text-muted hover:text-text dark:text-dark-muted dark:hover:text-dark-text"
                }`}
              >
                {mode === "cards" ? "Cards" : "Calendar"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="rounded-xl border border-border bg-white px-4 py-3 text-sm text-muted dark:border-dark-border dark:bg-dark-surface dark:text-dark-muted">
        Dates will be added and are subject to change. Open an event for details,
        and check official WPS communications for the latest updates.
      </p>

      {viewMode === "calendar" ? (
        <CalendarView events={events} onEventClick={setSelectedEvent} />
      ) : (
        <>
          {Object.entries(grouped).map(([month, monthEvents]) => (
            <div key={month}>
              <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-muted dark:text-dark-muted">
                {month}
              </h3>
              <div className="space-y-2">
                {monthEvents.map((event, i) => {
                  const days = daysUntil(event.date);
                  const isPast = (event.endDate ?? event.date) < todayStr;
                  const style = TYPE_STYLES[event.type];

                  return (
                    <button
                      type="button"
                      key={event.id || `${event.date}-${i}`}
                      onClick={() => setSelectedEvent(event)}
                      className={`w-full rounded-xl border p-4 text-left transition-shadow hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red/40 ${style.border} ${style.bg} ${isPast ? "opacity-50" : ""}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div
                            className={`mt-2 h-2 w-2 rounded-full ${style.dot}`}
                          />
                          <div>
                            <p className="font-medium text-text dark:text-dark-text">{event.name}</p>
                            <p className="text-sm text-muted dark:text-dark-muted">
                              {formatEventDateRange(event)}
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
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {filteredEvents.length === 0 && (
            <p className="py-8 text-center text-muted dark:text-dark-muted">No upcoming events</p>
          )}
        </>
      )}

      <EventDetailsDialog
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
}
