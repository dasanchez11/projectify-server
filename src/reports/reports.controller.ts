import { NextFunction, Response } from "express";
import { AuthRequest } from "../shared/models/auth-request.model";
import {
  deleteReport,
  getReportsByUserWeek,
  updateReport,
} from "./services/report.service";
import { JwtUser } from "../auth/models/jwt.model";
import { createReport } from "./services/report.service";
import { handleErrorResponse } from "../shared/utils/utils";

export const getAllUserReportsPerWeekController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const user: JwtUser = req.user;
  const { week } = req.params;
  try {
    const reports = await getReportsByUserWeek(user.userId, week);
    return res
      .status(200)
      .json({ message: "success getting projects", data: reports });
  } catch (error) {
    return handleErrorResponse(error, res);
  }
};

export const postUserReportController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { validatedDto } = req.body;
  const report = validatedDto;
  const { userId }: JwtUser = req.user;
  try {
    const result = await createReport(report, userId);
    return res
      .status(200)
      .json({ message: "Report created Success", data: result });
  } catch (error) {
    return handleErrorResponse(error, res);
  }
};

export const putUpdateUserReportController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { validatedDto } = req.body;
  const report = validatedDto;
  const { userId }: JwtUser = req.user;
  const { reportId } = req.params;
  try {
    await updateReport(report, reportId, userId);
    return res.status(200).json({ message: "Report updated Success" });
  } catch (error) {
    return handleErrorResponse(error, res);
  }
};

export const deleteUserReportController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId }: JwtUser = req.user;
  const { reportId } = req.params;
  try {
    await deleteReport(reportId, userId);
    return res.status(200).json({ message: "Report delete success" });
  } catch (error) {
    return handleErrorResponse(error, res);
  }
};
