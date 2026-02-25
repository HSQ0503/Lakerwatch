"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { PrepTalk } from "@/lib/preptalks";
import { extractYoutubeId } from "@/lib/preptalks";

function formatWeekDate(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  return `Week of ${date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`;
}

export default function MediaPage() {
  const [preptalks, setPreptalks] = useState<PrepTalk[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/preptalks")
      .then((res) => res.json())
      .then((data: PrepTalk[]) => {
        setPreptalks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const latest = preptalks[0] ?? null;
  const archive = preptalks.slice(1);
  const latestVideoId = latest ? extractYoutubeId(latest.youtubeUrl) : null;

  if (loading) {
    return (
      <div>
        <div className="mb-2 h-12 w-48 animate-pulse rounded-lg bg-border/50 dark:bg-white/5" />
        <div className="mb-8 h-5 w-64 animate-pulse rounded bg-border/50 dark:bg-white/5" />
        <div className="aspect-video w-full animate-pulse rounded-xl bg-border/50 dark:bg-white/5" />
        <div className="mt-4 h-6 w-72 animate-pulse rounded bg-border/50 dark:bg-white/5" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-xl bg-border/50 dark:bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  if (preptalks.length === 0) {
    return (
      <div>
        <h1 className="mb-2 font-display text-4xl font-extrabold text-text dark:text-dark-text md:text-5xl">
          WPS-Media
        </h1>
        <p className="mb-8 text-lg text-muted dark:text-dark-muted">
          Weekly PrepTalk videos
        </p>
        <div className="rounded-xl border border-dashed border-border py-16 text-center dark:border-dark-border">
          <svg
            className="mx-auto mb-4 h-12 w-12 text-border dark:text-dark-border"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z"
            />
          </svg>
          <p className="text-sm font-medium text-muted dark:text-dark-muted">
            No PrepTalks yet
          </p>
          <p className="mt-1 text-xs text-muted/60 dark:text-dark-muted/60">
            Check back soon for the latest PrepTalk video
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-2 font-display text-4xl font-extrabold text-text dark:text-dark-text md:text-5xl">
        WPS-Media
      </h1>
      <p className="mb-8 text-lg text-muted dark:text-dark-muted">
        Weekly PrepTalk videos
      </p>

      {/* Hero — Latest PrepTalk */}
      {latest && latestVideoId && (
        <div className="mb-10">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-red/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-red dark:bg-red/20 dark:text-red-light">
              Latest
            </span>
          </div>
          <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm dark:border-dark-border dark:bg-dark-surface">
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${latestVideoId}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
                title={latest.title}
              />
            </div>
            <div className="p-5">
              <h2 className="font-display text-xl font-bold text-text dark:text-dark-text">
                {latest.title}
              </h2>
              <p className="mt-1 text-sm text-muted dark:text-dark-muted">
                {formatWeekDate(latest.weekDate)}
              </p>
              {latest.description && (
                <p className="mt-2 text-sm text-text/80 dark:text-dark-text/80">
                  {latest.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Archive */}
      {archive.length > 0 && (
        <div>
          <h2 className="mb-4 font-display text-lg font-bold text-text dark:text-dark-text">
            Past PrepTalks
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {archive.map((pt) => {
              const videoId = extractYoutubeId(pt.youtubeUrl);
              if (!videoId) return null;

              const isExpanded = expandedId === pt.id;

              return (
                <div
                  key={pt.id}
                  className="overflow-hidden rounded-xl border border-border bg-white transition-colors dark:border-dark-border dark:bg-dark-surface"
                >
                  {isExpanded ? (
                    <div className="aspect-video w-full">
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="h-full w-full"
                        title={pt.title}
                      />
                    </div>
                  ) : (
                    <button
                      onClick={() => setExpandedId(pt.id ?? null)}
                      className="group relative aspect-video w-full cursor-pointer"
                    >
                      <Image
                        src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                        alt={pt.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red/90 text-white shadow-lg transition-transform group-hover:scale-110">
                          <svg className="ml-0.5 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
                          </svg>
                        </div>
                      </div>
                    </button>
                  )}
                  <div className="p-4">
                    <h3 className="font-display text-sm font-bold text-text dark:text-dark-text">
                      {pt.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-muted dark:text-dark-muted">
                      {formatWeekDate(pt.weekDate)}
                    </p>
                    {isExpanded && (
                      <button
                        onClick={() => setExpandedId(null)}
                        className="mt-2 text-xs font-medium text-red transition-colors hover:text-red-light dark:text-red-light"
                      >
                        Collapse
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
