"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";

const NAV_LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/schedule", label: "Schedule" },
  { href: "/events", label: "Events" },
  { href: "/productivity", label: "Productivity" },
  { href: "/todos", label: "To-Do" },
];

function SunIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme, mounted } = useTheme();

  const themeButton = mounted ? (
    <button
      onClick={toggleTheme}
      className="rounded-lg p-2 text-muted transition-colors hover:bg-red/5 hover:text-red dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white"
      title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      {theme === "light" ? (
        <MoonIcon className="h-4 w-4" />
      ) : (
        <SunIcon className="h-4 w-4" />
      )}
    </button>
  ) : (
    <div className="h-8 w-8" />
  );

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-border bg-white shadow-sm dark:border-white/10 dark:bg-[#1a1018]">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-xl font-bold tracking-tight"
        >
          <Image
            src="/logo.jpg"
            alt="WP Logo"
            width={36}
            height={36}
            className="rounded"
          />
          <span className="text-red dark:text-white">Laker<span className="text-red-light"> Watch</span></span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive
                    ? "text-red dark:text-white"
                    : "text-muted hover:text-red dark:text-white/60 dark:hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          {themeButton}
        </div>

        <div className="flex items-center gap-1 md:hidden">
          {themeButton}
          <button
            className="p-2 text-muted hover:text-red dark:text-white/60 dark:hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-border bg-white dark:border-white/10 dark:bg-[#1a1018] md:hidden">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-red/5 text-red dark:bg-white/10 dark:text-white"
                    : "text-muted hover:bg-red/5 hover:text-red dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
