"use client";

import { useState } from "react";

type AdminLoginFormProps = {
  onLogin: (password: string) => Promise<boolean>;
};

export default function AdminLoginForm({ onLogin }: AdminLoginFormProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const success = await onLogin(password);
    if (!success) setError("Invalid password");
    setLoading(false);
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red/10">
            <svg className="h-6 w-6 text-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="font-display text-xl font-bold text-text dark:text-dark-text">
            Admin Access
          </h1>
          <p className="mt-1 text-sm text-muted dark:text-dark-muted">
            Enter your password to continue
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-border bg-white p-6 shadow-sm dark:border-dark-border dark:bg-dark-surface"
        >
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="mb-3 w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-text dark:border-dark-border dark:bg-dark-bg dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-red/30"
            autoFocus
          />
          {error && (
            <p className="mb-3 text-sm text-red">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-red px-4 py-2.5 font-medium text-white transition-colors hover:bg-red-light disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}
