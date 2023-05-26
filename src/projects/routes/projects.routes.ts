import { Router } from "express";
import { validationMiddleware } from "../../shared/middleware/validation.middleware";
import { CreateProjectDto } from "../dto/create-project.dto";
import {
  deleteProjectController,
  getAllProjectsController,
  postProjectController,
} from "../project.controller";
import { isAuthenticated } from "../../shared/middleware/authentication.middleware";

export const projectRouter = Router();

projectRouter.get("", isAuthenticated, getAllProjectsController);
projectRouter.post(
  "",
  isAuthenticated,
  validationMiddleware(CreateProjectDto),
  postProjectController
);
projectRouter.delete("/:projectId", isAuthenticated, deleteProjectController);
