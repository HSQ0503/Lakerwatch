import type { Metadata } from "next";
import EventsList from "@/components/EventsList";

export const metadata: Metadata = {
  title: "Events & Calendar",
  description:
    "School events, breaks, early dismissals, and exam dates for the Windermere Preparatory School 2026–2027 academic year.",
};

export default function EventsPage() {
  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-text dark:text-dark-text">
        Official Calendar
      </h1>
      <EventsList />
    </div>
  );
}
