import { ReportWeekResponse } from "../models/report-response.model";
import { Report } from "../models/report.model";

export const canAddHours = (
  reportRes: ReportWeekResponse[],
  newReport: Report
) => {
  const workedHours = reportRes
    .filter((report) => report._id.toString() !== newReport._id.toString())
    .reduce((hours, report) => (hours += report.hours), 0);

  return workedHours + newReport.hours <= 45;
};
