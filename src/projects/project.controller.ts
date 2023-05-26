import { NextFunction, Request, Response } from "express";
import { getAllProjects } from "./services/project.service";
import { createProject } from "./services/project.service";
import { deleteProject } from "./services/project.service";

export const getAllProjectsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const projects = await getAllProjects();
    return res
      .status(200)
      .json({ message: "success getting projects", projects });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const postProjectController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { validatedDto } = req.body;
  const project = validatedDto;
  try {
    const newProject = await createProject(project);
    return res
      .status(200)
      .json({ message: "success creating project", project: newProject });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteProjectController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { projectId } = req.params;
  try {
    await deleteProject(projectId);
    return res.status(200).json({ message: "Project delete success" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
