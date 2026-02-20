export type SchoolEvent = {
  date: string; // "YYYY-MM-DD"
  name: string;
  type: "no-school" | "early-dismissal" | "event" | "exam" | "deadline";
  endDate?: string;
};

export const EVENTS: SchoolEvent[] = [
  // AUGUST 2024
  {
    date: "2024-08-12",
    name: "First Day of School (9th & new students)",
    type: "event",
  },
  { date: "2024-08-13", name: "First Day — All HS Students", type: "event" },
  { date: "2024-08-16", name: "Unity Day", type: "event" },
  { date: "2024-08-27", name: "HS Back to School Night", type: "event" },

  // SEPTEMBER 2024
  { date: "2024-09-02", name: "Labor Day", type: "no-school" },
  {
    date: "2024-09-11",
    name: "Picture Day (Formal Uniform)",
    type: "event",
  },
  { date: "2024-09-19", name: "8-Period Schedule", type: "event" },
  { date: "2024-09-20", name: "Conference Day", type: "no-school" },

  // OCTOBER 2024
  { date: "2024-10-08", name: "8-Period Schedule", type: "event" },
  {
    date: "2024-10-09",
    name: "PSAT/Senior SATs — Early Dismissal 11:30",
    type: "early-dismissal",
  },
  {
    date: "2024-10-10",
    name: "Professional Development Day",
    type: "no-school",
  },
  {
    date: "2024-10-11",
    name: "Fall Break",
    type: "no-school",
    endDate: "2024-10-14",
  },
  { date: "2024-10-19", name: "Homecoming Dance", type: "event" },

  // NOVEMBER 2024
  {
    date: "2024-11-01",
    name: "College Application Deadline",
    type: "deadline",
  },
  { date: "2024-11-05", name: "Formal Uniform Day", type: "event" },
  { date: "2024-11-11", name: "Veterans Day", type: "no-school" },
  {
    date: "2024-11-25",
    name: "Thanksgiving Break",
    type: "no-school",
    endDate: "2024-11-29",
  },

  // DECEMBER 2024
  {
    date: "2024-12-03",
    name: "Formal Uniform Day / Senior Class Photo",
    type: "event",
  },
  {
    date: "2024-12-16",
    name: "Per. 1 & 2 Exams — Early Dismissal",
    type: "exam",
  },
  {
    date: "2024-12-17",
    name: "Per. 3 & 5 Exams — Early Dismissal",
    type: "exam",
  },
  {
    date: "2024-12-18",
    name: "Per. 6 & 7 Exams — Early Dismissal",
    type: "exam",
  },
  {
    date: "2024-12-19",
    name: "Per. 8 Exam — Early Dismissal",
    type: "exam",
  },
  { date: "2024-12-20", name: "Teacher Work Day", type: "no-school" },
  {
    date: "2024-12-23",
    name: "Winter Break",
    type: "no-school",
    endDate: "2025-01-03",
  },

  // JANUARY 2025
  {
    date: "2025-01-06",
    name: "Professional Development Day",
    type: "no-school",
  },
  { date: "2025-01-07", name: "Spring Semester Begins", type: "event" },
  { date: "2025-01-09", name: "Honor Societies Induction", type: "event" },
  {
    date: "2025-01-13",
    name: "IB Mock Exams Begin",
    type: "exam",
    endDate: "2025-01-24",
  },
  { date: "2025-01-17", name: "Winter Pep Rally", type: "event" },
  { date: "2025-01-20", name: "MLK Jr. Day", type: "no-school" },

  // FEBRUARY 2025
  { date: "2025-02-05", name: "Wear RED Day (Heart Month)", type: "event" },
  {
    date: "2025-02-10",
    name: "Senior Parent Night — Road to Graduation",
    type: "event",
  },
  {
    date: "2025-02-14",
    name: "Presidents' Day Weekend",
    type: "no-school",
    endDate: "2025-02-17",
  },
  { date: "2025-02-21", name: "Bravo Event", type: "event" },

  // MARCH 2025
  { date: "2025-03-08", name: "Lakerthon", type: "event" },
  {
    date: "2025-03-13",
    name: "Multi Cultural Festival — Early Dismissal",
    type: "early-dismissal",
  },
  {
    date: "2025-03-14",
    name: "Professional Development Day",
    type: "no-school",
  },
  {
    date: "2025-03-17",
    name: "Spring Break",
    type: "no-school",
    endDate: "2025-03-21",
  },
  { date: "2025-03-27", name: "IBDP Junior TOK Exhibition", type: "event" },

  // APRIL 2025
  { date: "2025-04-01", name: "Fools and Flocks Day", type: "event" },
  { date: "2025-04-05", name: "Prom", type: "event" },
  { date: "2025-04-14", name: "No School", type: "no-school" },
  { date: "2025-04-18", name: "Conference Day", type: "no-school" },
  { date: "2025-04-24", name: "Senior Last Day", type: "event" },
  { date: "2025-04-25", name: "Grad Bash", type: "event" },
  {
    date: "2025-04-29",
    name: "IB Exams Begin",
    type: "exam",
    endDate: "2025-05-21",
  },

  // MAY 2025
  { date: "2025-05-12", name: "Junior Parent Night", type: "event" },
  {
    date: "2025-05-19",
    name: "Final Exams — Early Dismissal",
    type: "exam",
    endDate: "2025-05-23",
  },
  {
    date: "2025-05-23",
    name: "Last Day of School / HS Graduation",
    type: "event",
  },
];

export function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + "T00:00:00");
  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getUpcomingEvents(): SchoolEvent[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = formatLocalDate(today);

  return EVENTS.filter((e) => {
    const compareDate = e.endDate || e.date;
    return compareDate >= todayStr;
  });
}

export function getNextNoSchoolEvent(): SchoolEvent | null {
  const upcoming = getUpcomingEvents();
  return upcoming.find((e) => e.type === "no-school") ?? null;
}

function formatLocalDate(date: Date): string {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
}
