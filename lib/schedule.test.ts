import assert from "node:assert/strict";
import test from "node:test";
import {
  formatDateStr,
  getDayType,
  getEffectiveDayOfWeek,
  getScheduleForDay,
} from "./schedule";

test("uses the Monday schedule only on September 17, 2026", () => {
  const before = new Date("2026-09-16T16:00:00-04:00");
  const override = new Date("2026-09-17T16:00:00-04:00");
  const after = new Date("2026-09-18T16:00:00-04:00");

  assert.equal(getEffectiveDayOfWeek(before), 3);
  assert.equal(getEffectiveDayOfWeek(override), 1);
  assert.equal(getEffectiveDayOfWeek(after), 5);
  assert.equal(getDayType(getEffectiveDayOfWeek(override)), "monday");
  assert.deepEqual(
    getScheduleForDay(getEffectiveDayOfWeek(override), "9/10"),
    getScheduleForDay(1, "9/10"),
  );
});

test("applies schedule exceptions at America/New_York date boundaries", () => {
  const beforeMidnight = new Date("2026-09-17T03:59:59.999Z");
  const atMidnight = new Date("2026-09-17T04:00:00.000Z");
  const nextMidnight = new Date("2026-09-18T04:00:00.000Z");

  assert.equal(formatDateStr(beforeMidnight), "2026-09-16");
  assert.equal(getEffectiveDayOfWeek(beforeMidnight), 3);
  assert.equal(formatDateStr(atMidnight), "2026-09-17");
  assert.equal(getEffectiveDayOfWeek(atMidnight), 1);
  assert.equal(formatDateStr(nextMidnight), "2026-09-18");
  assert.equal(getEffectiveDayOfWeek(nextMidnight), 5);
});
