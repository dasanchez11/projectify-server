import { ObjectId } from "mongodb";
import { Report } from "../models/report.model";
import { ReportWeekResponse } from "../models/report-response.model";
import { CreateReportDTO } from "../dto/create-report.dto";
import { UpdateReportDTO } from "../dto/update-report.dto";

export const mockReport = {
  _id: "id",
  projectId: "projectId",
  userId: "userId",
  hours: 100,
  week: "week",
} as unknown as Report;

export const mockWeekResponse = {
  _id: "id",
  projectId: "projectId",
  userId: "userId",
  hours: 100,
  week: "week",
  name: "name",
  description: "description",
} as unknown as ReportWeekResponse;

export const mockCreateReportDTO: CreateReportDTO = {
  projectId: "projectId",
  hours: 100,
  week: "week",
};

export const mockUpdateReportDTO: UpdateReportDTO = {
  hours: 100,
};
