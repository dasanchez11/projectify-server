import { Request, Response } from "express";
import { getAllProjects } from "./services/project.service";
import { createProject } from "./services/project.service";
import { deleteProject } from "./services/project.service";
import { handleErrorResponse } from "../shared/utils/shared.utils";

export const getAllProjectsController = async (req: Request, res: Response) => {
  try {
    const projects = await getAllProjects();
    return res
      .status(200)
      .json({ message: "success getting projects", data: projects });
  } catch (error) {
    return handleErrorResponse(error, res);
  }
};

export const postProjectController = async (req: Request, res: Response) => {
  const { validatedDto } = req.body;
  const project = validatedDto;
  try {
    const newProject = await createProject(project);
    return res
      .status(200)
      .json({ message: "success creating project", data: newProject });
  } catch (error) {
    return handleErrorResponse(error, res);
  }
};

export const deleteProjectController = async (req: Request, res: Response) => {
  const { projectId } = req.params;
  try {
    await deleteProject(projectId);
    return res.status(200).json({ message: "Project delete success" });
  } catch (error) {
    return handleErrorResponse(error, res);
  }
};
