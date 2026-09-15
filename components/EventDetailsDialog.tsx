"use client";

import { useEffect, useId, useRef } from "react";
import {
  formatEventDateRange,
  type SchoolEvent,
  TYPE_STYLES,
} from "@/lib/events";

type EventDetailsDialogProps = {
  event: SchoolEvent | null;
  onClose: () => void;
};

const TYPE_LABELS: Record<SchoolEvent["type"], string> = {
  "no-school": "No School",
  "early-dismissal": "Early Dismissal",
  event: "School Event",
  exam: "Testing & Exams",
  deadline: "Deadline",
};

export default function EventDetailsDialog({
  event,
  onClose,
}: EventDetailsDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (event && !dialog.open) {
      dialog.showModal();
    } else if (!event && dialog.open) {
      dialog.close();
    }
  }, [event]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(clickEvent) => {
        if (clickEvent.target === clickEvent.currentTarget) onClose();
      }}
      className="m-auto w-[min(92vw,32rem)] rounded-2xl border border-border bg-white p-0 text-text shadow-2xl backdrop:bg-slate-950/55 dark:border-dark-border dark:bg-dark-surface dark:text-dark-text"
    >
      {event ? (
        <div className="p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-3 flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 shrink-0 rounded-full ${TYPE_STYLES[event.type].dot}`}
                />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted dark:text-dark-muted">
                  {TYPE_LABELS[event.type]}
                </span>
              </div>
              <h2
                id={titleId}
                className="font-display text-xl font-bold leading-tight"
              >
                {event.name}
              </h2>
              <p className="mt-2 text-sm font-medium text-red dark:text-red-light">
                {formatEventDateRange(event, true)}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close event details"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-border/60 hover:text-text dark:text-dark-muted dark:hover:bg-white/10 dark:hover:text-dark-text"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>

          <p className="mt-5 whitespace-pre-line leading-relaxed text-text/85 dark:text-dark-text/85">
            {event.description ||
              "No additional details have been posted for this event yet."}
          </p>
          <p className="mt-5 border-t border-border pt-4 text-xs text-muted dark:border-dark-border dark:text-dark-muted">
            Dates and details are subject to change. Check official WPS
            communications for the latest information.
          </p>
        </div>
      ) : null}
    </dialog>
  );
}
