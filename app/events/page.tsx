import EventsList from "@/components/EventsList";

export default function EventsPage() {
  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-navy dark:text-dark-text">
        Events &amp; Calendar
      </h1>
      <EventsList />
    </div>
  );
}
