import { CustomError } from "../../shared/custom-error";
import { CreateProjectDto } from "../dto/create-project.dto";
import { Project } from "../models/project.model";
import { ProjectModel } from "../schemas/project.schema";

export const getAllProjects = () => {
  return ProjectModel.aggregate<Project>([
    {
      $lookup: {
        from: "reports",
        localField: "_id",
        foreignField: "projectId",
        as: "report",
      },
    },
    { $addFields: { hours: { $sum: "$report.hours" } } },
    {
      $project: {
        hours: 1,
        name: 1,
        description: 1,
      },
    },
  ]);
};

export const getProjectById = (id: string): Promise<Project | null> => {
  return ProjectModel.findById<Project | null>(id);
};

export const getProject = async (id: string): Promise<Project> => {
  try {
    const project = await ProjectModel.findById<Project | null>(id);
    if (!project) {
      throw new CustomError("Project not found", 404);
    }
    return project;
  } catch (error) {
    throw error;
  }
};

export const createProject = async (
  project: CreateProjectDto
): Promise<Project> => {
  try {
    const newProject = new ProjectModel(project);
    await newProject.save();
    return newProject;
  } catch (error) {
    throw error;
  }
};

export const deleteProject = async (id: string): Promise<void> => {
  try {
    const project = await getProjectById(id);
    if (!project) {
      throw new CustomError("Project not found", 404);
    }
    await ProjectModel.findByIdAndRemove(project._id);
    return;
  } catch (error) {
    throw error;
  }
};
