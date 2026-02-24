"use client";

import { useState, useCallback, useSyncExternalStore } from "react";
import AdminEventForm from "@/components/AdminEventForm";
import type { SchoolEvent } from "@/lib/events";

const TYPE_LABELS: Record<string, string> = {
  "no-school": "No School",
  "early-dismissal": "Early Dismissal",
  event: "Event",
  exam: "Exam",
  deadline: "Deadline",
};

const TYPE_DOT: Record<string, string> = {
  "no-school": "bg-red",
  "early-dismissal": "bg-red-light",
  event: "bg-red dark:bg-red-light",
  exam: "bg-red",
  deadline: "bg-red-light",
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getStoredPassword() {
  return sessionStorage.getItem("admin-password");
}

const subscribeNoop = () => () => {};

export default function AdminPage() {
  const storedPassword = useSyncExternalStore(subscribeNoop, getStoredPassword, () => null);
  const [password, setPassword] = useState("");
  const [isAuthed, setIsAuthed] = useState(storedPassword !== null);
  const [authError, setAuthError] = useState("");
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  function getToken(): string {
    return sessionStorage.getItem("admin-password") ?? "";
  }

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      setEvents(data);
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  if (isAuthed && !hasFetched) {
    setHasFetched(true);
    fetchEvents();
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      sessionStorage.setItem("admin-password", password);
      setIsAuthed(true);
    } else {
      setAuthError("Invalid password");
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("admin-password");
    setIsAuthed(false);
    setPassword("");
  }

  async function handleAdd(data: { date: string; name: string; type: SchoolEvent["type"]; endDate: string }) {
    const res = await fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setShowAddForm(false);
      fetchEvents();
    }
  }

  async function handleEdit(data: { date: string; name: string; type: SchoolEvent["type"]; endDate: string }) {
    if (!editingId) return;
    const res = await fetch(`/api/events/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setEditingId(null);
      fetchEvents();
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/events/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (res.ok) {
      setDeleteConfirmId(null);
      fetchEvents();
    }
  }

  // Login screen
  if (!isAuthed) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-xl border border-border bg-white p-6 shadow-sm dark:border-dark-border dark:bg-dark-surface"
        >
          <h1 className="mb-4 font-display text-xl font-bold text-text dark:text-dark-text">
            Admin Login
          </h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="mb-3 w-full rounded-lg border border-border bg-bg px-3 py-2 text-text dark:border-dark-border dark:bg-dark-bg dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-red/30"
            autoFocus
          />
          {authError && (
            <p className="mb-3 text-sm text-red">{authError}</p>
          )}
          <button
            type="submit"
            className="w-full rounded-lg bg-red px-4 py-2 font-medium text-white transition-colors hover:bg-red-light"
          >
            Log In
          </button>
        </form>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-text dark:text-dark-text">
          Admin Panel
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => { setShowAddForm(true); setEditingId(null); }}
            className="rounded-lg bg-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-light"
          >
            + Add Event
          </button>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-text dark:border-dark-border dark:text-dark-muted dark:hover:text-dark-text"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Add form */}
      {showAddForm && (
        <div className="mb-6 rounded-xl border border-border bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-surface">
          <h2 className="mb-4 font-display text-lg font-bold text-text dark:text-dark-text">
            New Event
          </h2>
          <AdminEventForm
            onSave={handleAdd}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {/* Events list */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-border dark:bg-white/10" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {events.map((event) => (
            <div
              key={event.id}
              className="rounded-xl border border-border bg-white p-4 dark:border-dark-border dark:bg-dark-surface"
            >
              {editingId === event.id ? (
                <div>
                  <h3 className="mb-3 font-display text-sm font-semibold text-text dark:text-dark-text">
                    Edit Event
                  </h3>
                  <AdminEventForm
                    event={event}
                    onSave={handleEdit}
                    onCancel={() => setEditingId(null)}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`h-2 w-2 shrink-0 rounded-full ${TYPE_DOT[event.type] ?? "bg-muted"}`} />
                    <div className="min-w-0">
                      <p className="font-medium text-text dark:text-dark-text truncate">
                        {event.name}
                      </p>
                      <p className="text-sm text-muted dark:text-dark-muted">
                        {formatDate(event.date)}
                        {event.endDate && ` \u2013 ${formatDate(event.endDate)}`}
                        {" \u00B7 "}
                        <span className="capitalize">{TYPE_LABELS[event.type] ?? event.type}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    {deleteConfirmId === event.id ? (
                      <>
                        <button
                          onClick={() => handleDelete(event.id!)}
                          className="rounded-lg bg-red px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-light"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted transition-colors hover:text-text dark:border-dark-border dark:text-dark-muted dark:hover:text-dark-text"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => { setEditingId(event.id!); setShowAddForm(false); }}
                          className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted transition-colors hover:text-text dark:border-dark-border dark:text-dark-muted dark:hover:text-dark-text"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(event.id!)}
                          className="rounded-lg border border-red/20 px-3 py-1.5 text-sm text-red transition-colors hover:bg-red/10"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {events.length === 0 && !loading && (
            <p className="py-8 text-center text-muted dark:text-dark-muted">
              No events yet. Click &quot;+ Add Event&quot; to create one.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
