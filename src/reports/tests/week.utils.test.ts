import {
  getDateFromWeekAndYear,
  getDateMinusThreeWeeks,
  getIsoDateFromCurrentDate,
  getYearAndWeekFromInput,
  validEdit,
} from "../utils/week.utils";

describe("Week utils tests", () => {
  test("should validEdit", () => {
    const now = "2023-W22";
    const nextYear = "2024-W22";
    const behindThirdWeek = "2023-W19";
    const editNow = validEdit(now);
    expect(editNow).toBe(true);
    const editNextYear = validEdit(nextYear);
    expect(editNextYear).toBe(false);
    const editThreeWeeks = validEdit(behindThirdWeek);
    expect(editThreeWeeks).toBe(true);
  });

  test("should getIsoDateFromCurrentDate", () => {
    const { weekNumber, year } = getIsoDateFromCurrentDate();
    expect(year).toEqual(2023);
    expect(weekNumber).toEqual(22);
  });

  test("should getYearAndWeekFromInput", () => {
    const input = "2025-W32";
    const result = getYearAndWeekFromInput(input);
    expect(result.yearResult).toEqual(2025);
    expect(result.weekResult).toEqual(32);
  });

  test("should getDateFromWeekAndYear", () => {
    const result = getDateFromWeekAndYear(22, 2023);
    const time = new Date("2023-05-29T07:00:00.000Z");
    expect(result).toEqual(time);
    const secondResult = getDateFromWeekAndYear(21, 2023);
    const secondTime = new Date("2023-05-22T07:00:00.000Z");
    expect(secondResult).toEqual(secondTime);
  });

  test("should getDateMinusThreeWeeks", () => {
    const result = getDateMinusThreeWeeks(22, 2023);
    const time = new Date("2023-05-07T07:00:00.000Z");
    expect(result).toEqual(time);
    const secondResult = getDateMinusThreeWeeks(21, 2023);
    const secondtime = new Date("2023-04-30T07:00:00.000Z");
    expect(secondResult).toEqual(secondtime);
  });
});
