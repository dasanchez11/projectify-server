import { CustomError } from "../../shared/custom-error";
import { CreateReportDTO } from "../dto/create-report.dto";
import { ReportModel } from "../schema/report.schema";

export const getReportById = (id: string) => {
  return ReportModel.findById(id);
};

export const getReportByProjectIdAndUserId = async (
  projectId: string,
  userId: string
) => {
  try {
    const foundReport = await ReportModel.findOne({ projectId, userId });
    if (!foundReport) {
      throw new CustomError("Report Not Found", 404);
    }
    return foundReport;
  } catch (error) {
    throw error;
  }
};

export const getReportsByUserWeek = (userId: string, week: string) => {
  return ReportModel.find({ userId, week });
};

export const getReportByProjectUserAndWeek = (
  userId: string,
  projectId: string,
  week: string
) => {
  return ReportModel.find({ projectId, userId, week });
};

export const createReport = async (report: CreateReportDTO, userId: string) => {
  try {
    const hasProjectReport = await getReportByProjectUserAndWeek(
      userId,
      report.projectId,
      report.week
    );

    if (hasProjectReport.length > 0) {
      throw new CustomError(
        "User Already has hours for the project in the current week",
        403
      );
    }
    const projectToAdd = { ...report, userId };
    const newProject = new ReportModel(projectToAdd);
    await newProject.save();
    return;
  } catch (error) {
    throw error;
  }
};

export const updateReport = async (
  report: CreateReportDTO,
  reportId: string,
  userId: string
) => {
  try {
    const foundReport = await getReportById(reportId);

    if (!foundReport) {
      throw new CustomError("Report to update not found", 404);
    }

    if (foundReport.userId.toString() !== userId) {
      throw new CustomError("Not Authorized to update report", 404);
    }

    foundReport.hours = report.hours;
    await foundReport.save();
  } catch (error) {
    throw error;
  }
};

export const deleteReport = async (reportId: string, userId: string) => {
  try {
    const foundReport = await getReportById(reportId);
    if (!foundReport) {
      throw new CustomError("Report to update not found", 404);
    }
    if (foundReport.userId.toString() !== userId) {
      throw new CustomError("Not Authorized to delete report", 404);
    }
    await foundReport.deleteOne();
  } catch (error) {
    throw error;
  }
};
