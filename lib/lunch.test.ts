import assert from "node:assert/strict";
import test from "node:test";
import {
  type FlikDay,
  formatLunchDate,
  getWeekSunday,
  getWeekSundayFromDate,
  isLunchDate,
  parseFlikDay,
  shiftLunchDate,
} from "./lunch";
import {
  getFlikWeekUrl,
  hasPublishedLunchItems,
  shouldRefreshLunchMenu,
} from "./lunch-server";

const publishedDay: FlikDay = {
  date: "2026-08-31",
  menu_items: [
    { is_section_title: true, text: "Main Entrees" },
    {
      food: {
        name: "Chicken Tikka Masala",
        description: "Chicken in a tomato curry sauce",
        rounded_nutrition_info: { calories: 200 },
        icons: {
          food_icons: [{ synced_name: "Milk" }, { synced_name: "Wheat" }],
        },
      },
    },
  ],
};

test("formats dates and week starts in the school timezone", () => {
  const saturdayInFlorida = new Date("2026-08-30T03:30:00.000Z");
  const sundayInFlorida = new Date("2026-08-30T04:00:00.000Z");

  assert.equal(formatLunchDate(saturdayInFlorida), "2026-08-29");
  assert.equal(getWeekSunday(saturdayInFlorida), "2026-08-23");
  assert.equal(formatLunchDate(sundayInFlorida), "2026-08-30");
  assert.equal(getWeekSunday(sundayInFlorida), "2026-08-30");
});

test("validates and shifts calendar dates without runtime timezone drift", () => {
  assert.equal(isLunchDate("2028-02-29"), true);
  assert.equal(isLunchDate("2026-02-29"), false);
  assert.equal(isLunchDate("08/31/2026"), false);
  assert.equal(shiftLunchDate("2026-12-27", 7), "2027-01-03");
  assert.equal(getWeekSundayFromDate("2026-08-31"), "2026-08-30");
});

test("preserves FLIK station, nutrition, and allergen data", () => {
  assert.deepEqual(parseFlikDay(publishedDay), [
    {
      name: "Main Entrees",
      items: [
        {
          name: "Chicken Tikka Masala",
          description: "Chicken in a tomato curry sauce",
          calories: 200,
          allergens: ["Milk", "Wheat"],
        },
      ],
    },
  ]);
});

test("recognizes published and empty FLIK weeks", () => {
  assert.equal(hasPublishedLunchItems([publishedDay]), true);
  assert.equal(
    hasPublishedLunchItems([
      { date: "2026-08-30", menu_items: [] },
      { date: "2026-08-31", menu_items: [] },
    ]),
    false,
  );
  assert.equal(hasPublishedLunchItems({ days: [publishedDay] }), false);
});

test("builds the current FLIK endpoint and rejects non-Sunday dates", () => {
  assert.equal(
    getFlikWeekUrl("2026-08-30"),
    "https://wps.api.flikisdining.com/menu/api/weeks/school/windermere-prep-school/menu-type/lunch/2026/8/30/",
  );
  assert.throws(() => getFlikWeekUrl("2026-08-31"));
});

test("retries empty menus sooner than published menus", () => {
  const now = new Date("2026-08-31T16:00:00.000Z");

  assert.equal(
    shouldRefreshLunchMenu(
      {
        days: [],
        updatedAt: new Date("2026-08-31T15:44:59.000Z"),
      },
      now,
    ),
    true,
  );
  assert.equal(
    shouldRefreshLunchMenu(
      {
        days: [publishedDay],
        updatedAt: new Date("2026-08-31T10:00:01.000Z"),
      },
      now,
    ),
    false,
  );
  assert.equal(
    shouldRefreshLunchMenu(
      {
        days: [publishedDay],
        updatedAt: new Date("2026-08-31T10:00:00.000Z"),
      },
      now,
    ),
    true,
  );
});
