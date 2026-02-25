"use client";

import { useState } from "react";

type AdminLoginFormProps = {
  onAuthenticated: () => void;
};

type Step = "email" | "login" | "register";

export default function AdminLoginForm({ onAuthenticated }: AdminLoginFormProps) {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.status === "not_whitelisted") {
        setError("This email is not authorized for admin access");
      } else if (data.status === "registered") {
        setStep("login");
      } else if (data.status === "unregistered") {
        setStep("register");
      }
    } catch {
      setError("Something went wrong");
    }
    setLoading(false);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        onAuthenticated();
      } else {
        setError("Invalid password");
      }
    } catch {
      setError("Something went wrong");
    }
    setLoading(false);
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        onAuthenticated();
      } else {
        const data = await res.json();
        setError(data.error || "Registration failed");
      }
    } catch {
      setError("Something went wrong");
    }
    setLoading(false);
  }

  function handleBack() {
    setStep("email");
    setPassword("");
    setConfirmPassword("");
    setError("");
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
            {step === "email" && "Admin Access"}
            {step === "login" && "Welcome Back"}
            {step === "register" && "Create Account"}
          </h1>
          <p className="mt-1 text-sm text-muted dark:text-dark-muted">
            {step === "email" && "Enter your admin email to continue"}
            {step === "login" && email}
            {step === "register" && "Set a password for your admin account"}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-white p-6 shadow-sm dark:border-dark-border dark:bg-dark-surface">
          {step === "email" && (
            <form onSubmit={handleEmailSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@school.com"
                className="mb-3 w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-text dark:border-dark-border dark:bg-dark-bg dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-red/30"
                autoFocus
                required
              />
              {error && <p className="mb-3 text-sm text-red">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-red px-4 py-2.5 font-medium text-white transition-colors hover:bg-red-light disabled:opacity-50"
              >
                {loading ? "Checking..." : "Continue"}
              </button>
            </form>
          )}

          {step === "login" && (
            <form onSubmit={handleLogin}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="mb-3 w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-text dark:border-dark-border dark:bg-dark-bg dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-red/30"
                autoFocus
                required
              />
              {error && <p className="mb-3 text-sm text-red">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="mb-3 w-full rounded-lg bg-red px-4 py-2.5 font-medium text-white transition-colors hover:bg-red-light disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
              <button
                type="button"
                onClick={handleBack}
                className="w-full text-sm text-muted transition-colors hover:text-text dark:text-dark-muted dark:hover:text-dark-text"
              >
                Use a different email
              </button>
            </form>
          )}

          {step === "register" && (
            <form onSubmit={handleRegister}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min. 8 characters)"
                className="mb-3 w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-text dark:border-dark-border dark:bg-dark-bg dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-red/30"
                autoFocus
                required
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="mb-3 w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-text dark:border-dark-border dark:bg-dark-bg dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-red/30"
                required
              />
              {error && <p className="mb-3 text-sm text-red">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="mb-3 w-full rounded-lg bg-red px-4 py-2.5 font-medium text-white transition-colors hover:bg-red-light disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
              <button
                type="button"
                onClick={handleBack}
                className="w-full text-sm text-muted transition-colors hover:text-text dark:text-dark-muted dark:hover:text-dark-text"
              >
                Use a different email
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
