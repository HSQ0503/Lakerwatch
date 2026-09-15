import assert from "node:assert/strict";
import test from "node:test";
import {
  daysUntil,
  formatEventDateRange,
  getSchoolDateKey,
} from "./events";
import { WPS_2026_2027_EVENTS } from "./wpsCalendar2026";

test("uses America/New_York boundaries for event dates", () => {
  assert.equal(
    getSchoolDateKey(new Date("2026-09-17T03:59:59.999Z")),
    "2026-09-16",
  );
  assert.equal(
    getSchoolDateKey(new Date("2026-09-17T04:00:00.000Z")),
    "2026-09-17",
  );
  assert.equal(daysUntil("2026-09-18", new Date("2026-09-17T16:00:00Z")), 1);
});

test("formats same-month and cross-year event ranges clearly", () => {
  assert.equal(
    formatEventDateRange(
      { date: "2026-06-10", endDate: "2026-06-18" },
      true,
    ),
    "Jun 10–18, 2026",
  );
  assert.equal(
    formatEventDateRange(
      { date: "2026-12-18", endDate: "2027-01-04" },
      true,
    ),
    "Dec 18, 2026 – Jan 4, 2027",
  );
});

test("contains the complete described 2026-2027 calendar seed", () => {
  assert.equal(WPS_2026_2027_EVENTS.length, 128);
  assert.equal(
    new Set(WPS_2026_2027_EVENTS.map((event) => event.key)).size,
    WPS_2026_2027_EVENTS.length,
  );

  for (const event of WPS_2026_2027_EVENTS) {
    assert.match(event.date, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(event.description.trim().length > 0, `${event.key} needs a description`);
    if (event.endDate) {
      assert.match(event.endDate, /^\d{4}-\d{2}-\d{2}$/);
      assert.ok(event.endDate >= event.date, `${event.key} has an invalid range`);
    }
  }
});
