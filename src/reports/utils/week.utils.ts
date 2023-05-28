export const validEdit = (dateInput: string) => {
  //Current
  const { weekNumber: currentWeek, year: currentYear } =
    getIsoDateFromCurrentDate();
  const currentDate = getDateFromWeekAndYear(currentWeek, currentYear);

  //Input
  const { weekResult: inputWeek, yearResult: inputYear } =
    getYearAndWeekFromInput(dateInput);
  const inputDate = getDateFromWeekAndYear(inputWeek, inputYear);

  //current Week - 3weeks
  const before3Weeks = getDateMinusThreeWeeks(currentWeek, currentYear);

  return inputDate <= currentDate && inputDate >= before3Weeks;
};

const getIsoDateFromCurrentDate = () => {
  const currentDate = new Date() as any;
  const startDate = new Date(currentDate.getFullYear(), 0, 1) as any;
  const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil(days / 7);
  const year = currentDate.getFullYear();
  return { weekNumber, year };
};

const getDateFromWeekAndYear = (week: number, year: number) => {
  const date = new Date(year, 0, 1 + (week - 1) * 7);
  const day = date.getDay();
  date.setDate(date.getDate() - day + 1);
  return date;
};

const getYearAndWeekFromInput = (input: string) => {
  const split = input.split("-");
  const yearResult = +split[0];
  const weekResult = +split[1].slice(1);
  return { yearResult, weekResult };
};

const getDateMinusThreeWeeks = (week: number, year: number) => {
  const date = new Date(year, 0, 1 + (week - 1) * 7);
  date.setDate(date.getDate() - 21);
  return date;
};
