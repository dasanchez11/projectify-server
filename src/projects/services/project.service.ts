import { CustomError } from "../../shared/custom-error";
import { CreateProjectDto } from "../dto/create-project.dto";
import { ProjectModel } from "../schemas/project.schema";

export const getAllProjects = () => {
  return ProjectModel.aggregate([
    {
      $lookup: {
        from: "reports",
        localField: "_id",
        foreignField: "projectId",
        as: "reports",
        pipeline: [{ $project: { hours: "reports.hours" } }],
      },
    },
  ]);
};

export const getProjectById = (id: string) => {
  return ProjectModel.findById(id);
};

export const getProject = async (id: string) => {
  try {
    const project = await ProjectModel.findById(id);
    if (!project) {
      throw new CustomError("Project not found", 404);
    }
    return project;
  } catch (error) {
    throw error;
  }
};

export const createProject = async (project: CreateProjectDto) => {
  try {
    const newProject = new ProjectModel(project);
    await newProject.save();
    return newProject;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteProject = async (id: string) => {
  try {
    const project = await getProjectById(id);
    if (!project) {
      throw new CustomError("Project not found", 404);
    }
    await ProjectModel.deleteOne({ _id: project._id });
    return;
  } catch (error) {
    throw new Error(error.message);
  }
};
