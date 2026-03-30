"use client";

import { useState } from "react";

export default function AdminLunchSyncPanel() {
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  async function handleSync() {
    setSyncing(true);
    setResult(null);
    try {
      const res = await fetch("/api/lunch/sync");
      const data = await res.json();
      if (res.ok && data.success) {
        const synced = data.results.filter(
          (r: { status: string }) => r.status === "synced"
        ).length;
        setResult({
          success: true,
          message: `Synced ${synced} week${synced !== 1 ? "s" : ""} successfully.`,
        });
      } else {
        setResult({
          success: false,
          message: data.error || "Sync failed.",
        });
      }
    } catch {
      setResult({ success: false, message: "Network error. Please try again." });
    }
    setSyncing(false);
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 dark:border-dark-border dark:bg-dark-card">
      <div className="mb-4">
        <h2 className="font-display text-lg font-bold text-text dark:text-dark-text">
          Lunch Menu Sync
        </h2>
        <p className="mt-1 text-sm text-muted dark:text-dark-muted">
          Sync the lunch menu from Flik for the current and next week.
        </p>
      </div>

      <button
        onClick={handleSync}
        disabled={syncing}
        className="flex items-center gap-2 rounded-lg bg-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-dark disabled:opacity-50"
      >
        {syncing ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Syncing…
          </>
        ) : (
          <>
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.992 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M20.015 4.356v4.992"
              />
            </svg>
            Sync Now
          </>
        )}
      </button>

      {result && (
        <div
          className={`mt-4 rounded-lg px-4 py-3 text-sm ${
            result.success
              ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
              : "bg-red/10 text-red dark:bg-red/20 dark:text-red-light"
          }`}
        >
          {result.message}
        </div>
      )}
    </div>
  );
}
