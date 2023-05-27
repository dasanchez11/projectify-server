import { Router } from "express";
import { isAuthenticated } from "../../shared/middleware/authentication.middleware";
import { validationMiddleware } from "../../shared/middleware/validation.middleware";
import { CreateReportDTO } from "../dto/create-report.dto";
import {
  deleteUserReportController,
  getAllUserReportsPerWeekController,
  putUpdateUserReportController,
} from "../reports.controller";
import { postUserReportController } from "../reports.controller";
import { UpdateReportDTO } from "../dto/update-report.dto";

export const reportRouter = Router();

reportRouter.get("/:week", isAuthenticated, getAllUserReportsPerWeekController);
reportRouter.post(
  "",
  isAuthenticated,
  validationMiddleware(CreateReportDTO),
  postUserReportController
);
reportRouter.put(
  "/:reportId",
  isAuthenticated,
  validationMiddleware(UpdateReportDTO),
  putUpdateUserReportController
);

reportRouter.delete("/:reportId", isAuthenticated, deleteUserReportController);
