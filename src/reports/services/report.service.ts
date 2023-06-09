import { Aggregate, HydratedDocument, Query, Types } from "mongoose";
import { CustomError } from "../../shared/custom-error";
import { CreateReportDTO } from "../dto/create-report.dto";
import { ReportModel } from "../schema/report.schema";
import { canAddHours } from "../utils/count-hours.utils";
import { ReportWeekResponse } from "../models/report-response.model";
import { validEdit } from "../utils/week.utils";
import { UpdateReportDTO } from "../dto/update-report.dto";
import { Report } from "../models/report.model";

export const getReportById = (
  id: string
): Promise<HydratedDocument<Report> | null> => {
  return ReportModel.findById(id);
};

export const getReportByProjectIdAndUserId = async (
  projectId: string,
  userId: string
): Promise<HydratedDocument<Report>> => {
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

export const getReportsByUserWeek = (
  idUser: string,
  week: string
): Aggregate<ReportWeekResponse[]> => {
  const userId = new Types.ObjectId(idUser);
  return ReportModel.aggregate<ReportWeekResponse>([
    { $match: { userId, week } },
    {
      $lookup: {
        from: "projects",
        localField: "projectId",
        foreignField: "_id",
        as: "project",
      },
    },
    { $unwind: "$project" },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: ["$project", "$$ROOT"],
        },
      },
    },
    {
      $project: {
        project: 0,
      },
    },
  ]);
};

export const getReportByProjectUserAndWeek = (
  userId: string,
  projectId: string,
  week: string
): Query<Report[], Report, {}, Report, "find"> => {
  return ReportModel.find<Report>({ projectId, userId, week });
};

export const createReport = async (
  report: CreateReportDTO,
  userId: string
): Promise<ReportWeekResponse[]> => {
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

    const canEdit = validEdit(report.week);
    if (!canEdit) {
      throw new CustomError("Not Authorized to edit report", 401);
    }

    const projectToAdd = { ...report, userId };
    const newProject = new ReportModel(projectToAdd);

    const validNewReportHours = await validateHours(userId, newProject);
    if (!validNewReportHours) {
      throw new CustomError("Surpass 45 weekly hour limit", 403);
    }

    await newProject.save();
    return getCompleteReportById(newProject._id.toString());
  } catch (error) {
    throw error;
  }
};

export const updateReport = async (
  report: UpdateReportDTO,
  reportId: string,
  userId: string
): Promise<void> => {
  try {
    const foundReport = await getReportById(reportId);

    if (!foundReport) {
      throw new CustomError("Report to update not found", 404);
    }

    if (foundReport.userId.toString() !== userId) {
      throw new CustomError("Not Authorized to update report", 401);
    }

    const canEdit = validEdit(foundReport.week);
    if (!canEdit) {
      throw new CustomError(
        "Not Authorized to update report for this week",
        401
      );
    }

    foundReport.hours = report.hours;
    const validNewReportHours = await validateHours(userId, foundReport);
    if (!validNewReportHours) {
      throw new CustomError("Surpass 45 weekly hour limit", 403);
    }

    await foundReport.save();
    return;
  } catch (error) {
    throw error;
  }
};

export const deleteReport = async (
  reportId: string,
  userId: string
): Promise<void> => {
  try {
    const foundReport = await getReportById(reportId);
    if (!foundReport) {
      throw new CustomError("Report to delete not found", 404);
    }

    if (foundReport.userId.toString() !== userId) {
      throw new CustomError("Not Authorized to delete report", 401);
    }

    const canEdit = validEdit(foundReport.week);
    if (!canEdit) {
      throw new CustomError("Not Authorized to delete report", 401);
    }
    await ReportModel.deleteOne({ _id: foundReport._id });
    return;
  } catch (error) {
    throw error;
  }
};

export const getCompleteReportById = (
  id: string
): Aggregate<ReportWeekResponse[]> => {
  const reportId = new Types.ObjectId(id);
  return ReportModel.aggregate<ReportWeekResponse>([
    { $match: { _id: reportId } },
    {
      $lookup: {
        from: "projects",
        localField: "projectId",
        foreignField: "_id",
        as: "project",
      },
    },
    { $unwind: "$project" },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: ["$project", "$$ROOT"],
        },
      },
    },
    {
      $project: {
        project: 0,
      },
    },
  ]);
};

export const validateHours = async (
  userId: string,
  report: Report
): Promise<boolean> => {
  try {
    const userReports = (await getReportsByUserWeek(
      userId,
      report.week
    )) as ReportWeekResponse[];

    return canAddHours(userReports, report);
  } catch (error) {
    throw error;
  }
};
