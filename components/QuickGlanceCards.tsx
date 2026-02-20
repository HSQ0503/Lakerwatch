"use client";

import { useState } from "react";
import Link from "next/link";
import { useHasMounted } from "@/hooks/useHasMounted";
import { getUpcomingEvents, getNextNoSchoolEvent, daysUntil } from "@/lib/events";

function readTodoCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const stored = localStorage.getItem("lakerwatch-todos");
    if (stored) {
      const todos = JSON.parse(stored);
      return todos.filter((t: { completed: boolean }) => !t.completed).length;
    }
  } catch {
    // ignore parse errors
  }
  return 0;
}

export default function QuickGlanceCards() {
  const mounted = useHasMounted();
  const [todoCount] = useState(readTodoCount);

  if (!mounted) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-2">
        <div className="h-24 w-64 flex-shrink-0 animate-pulse rounded-xl bg-border" />
        <div className="h-24 w-64 flex-shrink-0 animate-pulse rounded-xl bg-border" />
      </div>
    );
  }

  const nextBreak = getNextNoSchoolEvent();
  const upcomingEvents = getUpcomingEvents();
  const nextEvent = upcomingEvents[0];

  const eventTarget = nextBreak || nextEvent;
  const eventLabel = nextBreak ? "Next Break" : "Next Event";
  const eventName = eventTarget?.name ?? "No upcoming events";
  const eventDays = eventTarget ? daysUntil(eventTarget.date) : null;

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-2 md:overflow-visible">
      <Link
        href="/events"
        className="w-64 flex-shrink-0 rounded-xl border border-red/15 bg-red/5 p-4 transition-colors hover:bg-red/10 md:w-auto"
      >
        <p className="mb-1 text-sm font-medium text-red">{eventLabel}</p>
        <p className="font-display text-lg font-bold text-navy">
          {eventName}
        </p>
        {eventDays !== null && (
          <p className="mt-1 text-sm text-muted">
            {eventDays === 0
              ? "Today"
              : eventDays === 1
                ? "Tomorrow"
                : `${eventDays} days away`}
          </p>
        )}
      </Link>

      <Link
        href="/todos"
        className="w-64 flex-shrink-0 rounded-xl border border-navy/10 bg-navy/5 p-4 transition-colors hover:bg-navy/10 md:w-auto"
      >
        <p className="mb-1 text-sm font-medium text-navy-light">To-Do</p>
        <p className="font-display text-lg font-bold text-navy">
          {todoCount === 0
            ? "All caught up!"
            : `${todoCount} task${todoCount === 1 ? "" : "s"} remaining`}
        </p>
        <p className="mt-1 text-sm text-muted">
          {todoCount === 0 ? "Nothing to do" : "Stay on track"}
        </p>
      </Link>
    </div>
  );
}
