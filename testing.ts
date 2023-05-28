function getMonthDaysOfWeek(
  week: number,
  year: number,
  startDayOfWeek: number = 1
): number[] {
  const firstDayOfWeek = getFirstDayOfWeek(week, year, startDayOfWeek);
  const monthDays: number[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(
      firstDayOfWeek.getFullYear(),
      firstDayOfWeek.getMonth(),
      firstDayOfWeek.getDate() + i
    );
    monthDays.push(date.getDate());
  }

  return monthDays;
}

function getFirstDayOfWeek(
  week: number,
  year: number,
  startDayOfWeek: number = 0
): Date {
  // Create a new date object for the first day of the given year
  const date = new Date(year, 0, 1);

  // Adjust the date to the first day of the week
  const dayOfWeek = date.getDay();
  const diff = startDayOfWeek - dayOfWeek;
  const firstDayOfWeek = new Date(date.getFullYear(), 0, date.getDate() + diff);

  // Set the date to the first day of the target week
  firstDayOfWeek.setDate(firstDayOfWeek.getDate() + (week - 1) * 7);

  return firstDayOfWeek;
}
