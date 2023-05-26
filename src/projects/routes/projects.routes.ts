import { Router } from "express";
import { validationMiddleware } from "../../shared/middleware/validation.middleware";
import { CreateProjectDto } from "../dto/create-project.dto";
import {
  deleteProjectController,
  getAllProjectsController,
  postProjectController,
} from "../project.controller";

export const projectRouter = Router();

projectRouter.get("", getAllProjectsController);
projectRouter.post(
  "",
  validationMiddleware(CreateProjectDto),
  postProjectController
);
projectRouter.delete("/:projectId", deleteProjectController);
