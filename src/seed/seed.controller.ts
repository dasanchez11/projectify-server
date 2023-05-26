import { NextFunction, Request, Response } from "express";
import { createSeedProject } from "./services/seed.service";
import { Project } from "../projects/models/project.model";
import { seedProjects } from "./util/seed.util";

export const createSeedController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const projects = seedProjects;
    await createSeedProject(projects);
    return res.status(200).json({ message: "Seed created success" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
