import { PrismaClient } from "../lib/generated/prisma/client";
import {
  WPS_2026_2027_EVENTS,
  WPS_2026_2027_SOURCE_PREFIX,
} from "../lib/wpsCalendar2026";

const prisma = new PrismaClient();

const LEGACY_EVENTS = [
  // AUGUST 2025
  { date: "2025-08-07", name: "Student Group Activity Day (Athletics, Fine Arts, SGA)", type: "event" },
  { date: "2025-08-08", name: "HS New Student/Family Orientation", type: "event" },
  { date: "2025-08-11", name: "LS New Family Orientation & Meet the Teacher / MS New Family Orientation", type: "event" },
  { date: "2025-08-12", name: "LS Returning Families Meet the Teacher / MS Back-to-School Social / HS Create Your Future Day", type: "event" },
  { date: "2025-08-13", name: "First Day of School (LS, 6th, 9th & new students)", type: "event" },
  { date: "2025-08-14", name: "First Day — All MS & HS Students", type: "event" },
  { date: "2025-08-25", name: "Middle School Back to School Night", type: "event" },
  { date: "2025-08-26", name: "High School Back to School Night", type: "event" },
  { date: "2025-08-27", name: "Lower School Back to School Night", type: "event" },

  // SEPTEMBER 2025
  { date: "2025-09-01", name: "Labor Day", type: "no-school" },
  { date: "2025-09-05", name: "Laker Day — 25th Anniversary Celebration", type: "event" },
  { date: "2025-09-19", name: "Conference Day", type: "no-school" },

  // OCTOBER 2025
  { date: "2025-10-08", name: "Early Dismissal — Teacher Work Day", type: "early-dismissal" },
  { date: "2025-10-09", name: "Teacher Work Day", type: "no-school" },
  { date: "2025-10-10", name: "Fall Break", type: "no-school", endDate: "2025-10-13" },

  // NOVEMBER 2025
  { date: "2025-11-11", name: "Veterans Day (Hurricane Make-Up Day)", type: "no-school" },
  { date: "2025-11-24", name: "Thanksgiving Break", type: "no-school", endDate: "2025-11-28" },

  // DECEMBER 2025
  { date: "2025-12-18", name: "Early Dismissal", type: "early-dismissal" },
  { date: "2025-12-19", name: "Teacher Work Day", type: "no-school" },
  { date: "2025-12-22", name: "Winter Break", type: "no-school", endDate: "2026-01-02" },

  // JANUARY 2026
  { date: "2026-01-05", name: "Teacher Work Day", type: "no-school" },
  { date: "2026-01-06", name: "Classes Resume — Semester 2 Begins", type: "event" },
  { date: "2026-01-19", name: "MLK Jr. Day", type: "no-school" },
  { date: "2026-01-30", name: "Conference Day — No School for HS", type: "no-school" },

  // FEBRUARY 2026
  { date: "2026-02-13", name: "Presidents' Day Weekend", type: "no-school", endDate: "2026-02-16" },

  // MARCH 2026
  { date: "2026-03-12", name: "Early Dismissal", type: "early-dismissal" },
  { date: "2026-03-13", name: "Teacher Work Day", type: "no-school" },
  { date: "2026-03-16", name: "Spring Break", type: "no-school", endDate: "2026-03-20" },

  // APRIL 2026
  { date: "2026-04-13", name: "No School (Hurricane Make-Up Day)", type: "no-school" },
  { date: "2026-04-17", name: "Conference Day — HS in session", type: "event" },

  // MAY 2026
  { date: "2026-05-18", name: "Final Exams — Early Dismissal", type: "exam", endDate: "2026-05-22" },
  { date: "2026-05-22", name: "Last Day of School / HS Graduation 7 PM", type: "event" },
];

async function main() {
  console.log("Seeding database...");

  let created = 0;
  let updated = 0;

  // Keep the original calendar available in fresh databases without deleting
  // events that administrators have added or edited.
  for (const event of LEGACY_EVENTS) {
    const existing = await prisma.schoolEvent.findFirst({
      where: { date: event.date, name: event.name },
    });
    if (existing) continue;

    await prisma.schoolEvent.create({
      data: {
        date: event.date,
        name: event.name,
        type: event.type,
        endDate: (event as { endDate?: string }).endDate ?? null,
      },
    });
    created++;
  }

  // Official events have stable source keys, so this seed can be run again to
  // apply calendar corrections without creating duplicates.
  for (const event of WPS_2026_2027_EVENTS) {
    const sourceKey = `${WPS_2026_2027_SOURCE_PREFIX}:${event.key}`;
    const data = {
      date: event.date,
      name: event.name,
      description: event.description,
      type: event.type,
      endDate: event.endDate ?? null,
      sourceKey,
    };

    let existing = await prisma.schoolEvent.findFirst({
      where: { sourceKey },
    });

    // Adopt an exact pre-existing admin entry on the first seed run.
    existing ??= await prisma.schoolEvent.findFirst({
      where: { date: event.date, name: event.name },
    });

    if (existing) {
      await prisma.schoolEvent.update({
        where: { id: existing.id },
        data,
      });
      updated++;
    } else {
      await prisma.schoolEvent.create({ data });
      created++;
    }
  }

  console.log(
    `Calendar seed complete: ${created} created, ${updated} updated, ${WPS_2026_2027_EVENTS.length} official 2026-2027 events synced`,
  );
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
