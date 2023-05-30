import { canAddHours } from "../utils/count-hours.utils";

describe("Test Count Hours utils", () => {
  test("should canAddHours", () => {
    const mockWeekResponse = [
      { _id: 1, hours: 30 },
      { _id: 1, hours: 15 },
    ];
    const newReport = { _id: 2, hours: 1 };
    const result = canAddHours(mockWeekResponse as any, newReport as any);
    expect(result).toEqual(false);
  });

  test("should canAddHours", () => {
    const mockWeekResponse = [
      { _id: 1, hours: 30 },
      { _id: 2, hours: 15 },
    ];
    const newReport = { _id: 2, hours: 16 };
    const result = canAddHours(mockWeekResponse as any, newReport as any);
    expect(result).toEqual(false);
  });

  test("should canAddHours", () => {
    const mockWeekResponse = [
      { _id: 1, hours: 30 },
      { _id: 2, hours: 15 },
    ];
    const newReport = { _id: 2, hours: 14 };
    const result = canAddHours(mockWeekResponse as any, newReport as any);
    expect(result).toEqual(true);
  });
});
