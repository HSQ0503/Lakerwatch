import ScheduleView from "@/components/ScheduleView";

export default function SchedulePage() {
  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-navy dark:text-dark-text">
        Full Schedule
      </h1>
      <ScheduleView />
    </div>
  );
}
