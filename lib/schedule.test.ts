import assert from "node:assert/strict";
import test from "node:test";
import {
  ASSEMBLY_DAY,
  getDayTypeLabel,
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

test("Oct 5 2026 uses Thursday schedule; Oct 6 uses Friday schedule", () => {
  const mon = new Date("2026-10-05T12:00:00-04:00");
  const tue = new Date("2026-10-06T12:00:00-04:00");
  const wed = new Date("2026-10-07T12:00:00-04:00");

  assert.equal(getEffectiveDayOfWeek(mon), 4);
  assert.equal(getDayType(getEffectiveDayOfWeek(mon)), "odd");
  assert.deepEqual(
    getScheduleForDay(getEffectiveDayOfWeek(mon), "9/10"),
    getScheduleForDay(4, "9/10"),
  );

  assert.equal(getEffectiveDayOfWeek(tue), 5);
  assert.equal(getDayType(getEffectiveDayOfWeek(tue)), "even");
  assert.deepEqual(
    getScheduleForDay(getEffectiveDayOfWeek(tue), "9/10"),
    getScheduleForDay(5, "9/10"),
  );

  assert.equal(getEffectiveDayOfWeek(wed), 3);
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

const at = (d: string) => new Date(`${d}T12:00:00-04:00`);
const sched = (d: string, w: "9/10" | "11/12") => getScheduleForDay(getEffectiveDayOfWeek(at(d)), w);
const find = (d: string, w: "9/10" | "11/12", n: string) => sched(d, w).find((p) => p.name === n);

test("generic assembly schedule keeps its Assembly block", () => {
  const s = getScheduleForDay(ASSEMBLY_DAY, "11/12");
  assert.deepEqual(s.find((p) => p.name === "Assembly"), { name: "Assembly", start: "09:15", end: "10:10" });
  assert.equal(s[s.length - 1].end, "14:50");
});

test("Homecoming Tue 10/13: Powder Puff Football", () => {
  assert.equal(getDayTypeLabel(getDayType(getEffectiveDayOfWeek(at("2026-10-13")))!), "Homecoming");
  assert.deepEqual(find("2026-10-13", "9/10", "Powder Puff Football"), { name: "Powder Puff Football", start: "09:15", end: "10:10" });
  assert.equal(find("2026-10-13", "9/10", "Assembly"), undefined);
  assert.deepEqual(find("2026-10-13", "9/10", "Lunch"), { name: "Lunch", start: "12:20", end: "12:45" });
  assert.deepEqual(find("2026-10-13", "11/12", "Lunch"), { name: "Lunch", start: "13:00", end: "13:25" });
});

test("Homecoming Wed 10/14: Basketball Challenge, early release", () => {
  assert.deepEqual(find("2026-10-14", "9/10", "Basketball Challenge"), { name: "Basketball Challenge", start: "09:10", end: "10:30" });
  assert.deepEqual(find("2026-10-14", "9/10", "6th Period"), { name: "6th Period", start: "11:15", end: "12:35" });
  assert.deepEqual(find("2026-10-14", "11/12", "6th Period"), { name: "6th Period", start: "10:35", end: "11:55" });
  assert.equal(sched("2026-10-14", "11/12").slice(-1)[0].end, "14:00");
});

test("Homecoming Thu 10/15: Lip Sync Battle", () => {
  assert.deepEqual(find("2026-10-15", "11/12", "Lip Sync Battle"), { name: "Lip Sync Battle", start: "09:15", end: "10:10" });
  assert.deepEqual(find("2026-10-15", "11/12", "6th Period"), { name: "6th Period", start: "12:25", end: "13:00" });
});

test("Homecoming Fri 10/16: same for both waves", () => {
  assert.deepEqual(sched("2026-10-16", "9/10"), sched("2026-10-16", "11/12"));
  assert.deepEqual(find("2026-10-16", "9/10", "Homecoming Parade"), { name: "Homecoming Parade", start: "09:45", end: "10:15" });
  assert.equal(find("2026-10-16", "9/10", "6th Prep Talk - Special Edition")?.start, "13:10");
  assert.equal(sched("2026-10-16", "9/10").slice(-1)[0].end, "14:50");
});

test("Oct 20-23 are normal days", () => {
  ["2026-10-20", "2026-10-21", "2026-10-22", "2026-10-23"].forEach((d, i) => {
    assert.equal(getEffectiveDayOfWeek(at(d)), 2 + i);
  });
});
