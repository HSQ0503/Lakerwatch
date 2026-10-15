import assert from "node:assert/strict";
import test from "node:test";
import {
  formatDateStr, getCurrentPeriod, getDayType, getEffectiveDayOfWeek,
  getNextPeriod, getPassingTimeInfo, getPeriodProgress, getScheduleDateForWeekday,
  getScheduleForDay, getSchoolMinutes, getSchoolStartCountdown, getSpiritWearTheme,
  getTimeRemaining, isBeforeSchool, isSchoolOver, timeToMinutes, type LunchWave,
} from "./schedule";
import { applyHomecomingCalendarUpdates, HOMECOMING_CALENDAR_EVENTS } from "./homecoming2026";
import { WPS_2026_2027_EVENTS } from "./wpsCalendar2026";

const waves: LunchWave[] = ["9/10", "11/12"];
const at = (date: string, time = "12:00:00") => new Date(`${date}T${time}-04:00`);
const scheduleFor = (date: string, wave: LunchWave) => getScheduleForDay(getEffectiveDayOfWeek(at(date)), wave);

for (const wave of waves) {
  test(`October 15 matches every published period for grades ${wave}`, () => {
    assert.deepEqual(scheduleFor("2026-10-15", wave).map(({ name, start, end }) => [name, start, end]), [
      ["1st Period", "07:45", "08:25"],
      ["2nd Period", "08:30", "09:10"],
      ["Lip Sync Battle", "09:15", "10:10"],
      ["3rd Period", "10:15", "10:55"],
      ["4th Period", "11:00", "11:40"],
      ["5th Period", "11:45", "12:20"],
      ...(wave === "9/10" ? [
        ["Lunch", "12:20", "12:45"], ["6th Period", "12:50", "13:25"],
      ] : [
        ["6th Period", "12:25", "13:00"], ["Lunch", "13:00", "13:25"],
      ]),
      ["7th Period", "13:30", "14:05"],
      ["8th Period", "14:10", "14:50"],
    ]);
  });

  test(`October 16 matches every published block for grades ${wave}`, () => {
    const schedule = scheduleFor("2026-10-16", wave);
    assert.deepEqual(schedule.map(({ name, start, end }) => [name, start, end]), [
      ["2nd Period", "07:45", "08:40"],
      ["4th Period", "08:45", "09:40"],
      ["Homecoming Parade", "09:45", "10:15"],
      ["Pep Rally", "10:20", "10:45"],
      ["HOCO Cookout Lunch", "10:45", "11:45"],
      ["6th Period", "11:50", "13:10"],
      ["6th Prep Talk - Special Edition", "13:10", "13:25"],
      ["8th Period", "13:30", "14:50"],
    ]);
    assert.match(schedule[5].description!, /Full 6th Period: 11:50 AM–1:25 PM/);
    assert.match(schedule[6].description!, /Part of 6th Period \(11:50 AM–1:25 PM\)/);
    assert.equal(getCurrentPeriod(schedule, at("2026-10-16", "13:09:59")), schedule[5]);
    assert.equal(getTimeRemaining(schedule[5], at("2026-10-16", "13:09:59")), 1);
    assert.equal(getCurrentPeriod(schedule, at("2026-10-16", "13:10:00")), schedule[6]);
    assert.equal(getTimeRemaining(schedule[6], at("2026-10-16", "13:10:00")), 900);
    assert.equal(getPassingTimeInfo(schedule, at("2026-10-16", "13:10:00")), null);
  });

  for (const date of ["2026-10-15", "2026-10-16"]) {
    test(`${date} grades ${wave}: exact starts, ends, passing time and countdowns`, () => {
      const schedule = scheduleFor(date, wave);
      assert.equal(isBeforeSchool(schedule, at(date, "07:44:59")), true);
      assert.equal(getSchoolStartCountdown(schedule, at(date, "07:44:59")), 1);
      assert.equal(isBeforeSchool(schedule, at(date, "07:45:00")), false);
      schedule.forEach((period, index) => {
        const start = at(date, `${period.start}:00`);
        const end = at(date, `${period.end}:00`);
        assert.equal(getCurrentPeriod(schedule, start), period);
        assert.equal(getCurrentPeriod(schedule, new Date(end.getTime() - 1)), period);
        assert.equal(getPeriodProgress(period, start), 0);
        assert.equal(getPeriodProgress(period, end), 1);
        assert.equal(getTimeRemaining(period, end), 0);
        assert.equal(getNextPeriod(schedule, start), schedule[index + 1] ?? null);
        const next = schedule[index + 1];
        if (next) {
          const gap = timeToMinutes(next.start) - timeToMinutes(period.end);
          assert.ok(gap >= 0, "No overlapping countdown blocks");
          assert.equal(getCurrentPeriod(schedule, end), gap === 0 ? next : null);
          assert.deepEqual(getPassingTimeInfo(schedule, end), gap === 0 ? null : {
            nextPeriod: next, secondsUntil: gap * 60,
          });
        } else {
          assert.equal(getCurrentPeriod(schedule, end), null);
          assert.equal(isSchoolOver(schedule, new Date(end.getTime() - 1)), false);
          assert.equal(isSchoolOver(schedule, end), true);
        }
      });
    });
  }
}

test("Homecoming date boundaries and themes follow Eastern time", () => {
  for (const date of ["2026-10-15", "2026-10-16"]) {
    const midnight = at(date, "00:00:00");
    assert.equal(formatDateStr(midnight), date);
    assert.equal(getSchoolMinutes(midnight), 0);
    assert.equal(getDayType(getEffectiveDayOfWeek(midnight)), "homecoming");
    assert.notEqual(getEffectiveDayOfWeek(new Date(midnight.getTime() - 1)), getEffectiveDayOfWeek(midnight));
  }
  assert.equal(getEffectiveDayOfWeek(at("2026-10-17", "00:00:00")), 6);
  assert.equal(getSpiritWearTheme(at("2026-10-15")), "Bikers vs. Surfers");
  assert.equal(getSpiritWearTheme(at("2026-10-16")), "Spirit Wear");
  assert.equal(getSpiritWearTheme(at("2026-10-14")), undefined);
  assert.equal(getSpiritWearTheme(at("2026-10-17")), undefined);
  for (const wave of waves) {
    assert.deepEqual(scheduleFor("2026-10-22", wave), getScheduleForDay(4, wave));
    assert.deepEqual(scheduleFor("2026-10-23", wave), getScheduleForDay(5, wave));
  }
});

test("weekday tabs preview the other Homecoming dates, then revert the following week", () => {
  for (const current of ["2026-10-14", "2026-10-15", "2026-10-16"]) {
    assert.equal(formatDateStr(getScheduleDateForWeekday(at(current), 4)), "2026-10-15");
    assert.equal(formatDateStr(getScheduleDateForWeekday(at(current), 5)), "2026-10-16");
  }
  assert.equal(formatDateStr(getScheduleDateForWeekday(at("2026-10-19"), 4)), "2026-10-22");
});

test("calendar correction is idempotent and preserves unrelated events and record IDs", () => {
  const originals = [
    { id: "thu", date: "2026-10-15", name: "Homecoming Week — Assembly Schedule", description: "old" },
    { id: "fri", date: "2026-10-16", name: "Homecoming Week — 8 Period Day", description: "old" },
    { id: "game", date: "2026-10-16", name: "Homecoming Football Game and Senior Night", description: "6 p.m." },
    { id: "other", date: "2026-10-13", name: "Homecoming Week — Assembly Schedule", description: "untouched" },
  ];
  const updated = applyHomecomingCalendarUpdates(originals);
  assert.deepEqual(updated.map((event) => event.id), originals.map((event) => event.id));
  assert.equal(updated[2], originals[2]);
  assert.equal(updated[3], originals[3]);
  assert.deepEqual(applyHomecomingCalendarUpdates(updated), updated);
  assert.equal(originals[0].description, "old");
  assert.match(updated[0].description, /Bikers vs\. Surfers/);
  assert.match(updated[0].description, /Grades 9\/10:[\s\S]*12:20 PM–12:45 PM: Lunch/);
  assert.match(updated[0].description, /Grades 11\/12:[\s\S]*1:00 PM–1:25 PM: Lunch/);
  assert.match(updated[1].description, /Spirit Wear Theme: Spirit Wear/);
  assert.match(updated[1].description, /Grades 9–12/);
  assert.match(updated[1].description, /1:10 PM–1:25 PM: 6th Prep Talk - Special Edition/);
  assert.match(updated[1].description, /Full 6th Period: 11:50 AM–1:25 PM/);
  assert.doesNotMatch(updated[1].name, /8 Period/);
  for (const event of HOMECOMING_CALENDAR_EVENTS) {
    assert.deepEqual(WPS_2026_2027_EVENTS.find((seed) => seed.key === event.key), event);
    const sourceRecord = { date: event.date, name: "Old title", sourceKey: `wps-hs-2026-2027:${event.key}` };
    assert.equal(applyHomecomingCalendarUpdates([sourceRecord])[0].name, event.name);
  }
});
