import { ResponseError } from "../../shared/models/error.model";
import { CreateProjectDto } from "../dto/create-project.dto";
import { ProjectModel } from "../schemas/project.schema";

export const getAllProjects = () => {
  return ProjectModel.find({});
};

export const getProjectById = (id: string) => {
  return ProjectModel.findById(id);
};

export const getProject = async (id: string) => {
  try {
    const project = await ProjectModel.findById(id);
    if (!project) {
      const error = new Error() as ResponseError;
      error.message = "Project not found";
      error.status = 404;
      throw error;
    }
    return project;
  } catch (error) {
    throw new Error(error.message);
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
      const error = new Error() as ResponseError;
      error.message = "Project not found";
      error.status = 404;
      throw error;
    }
    await ProjectModel.deleteOne({ _id: project._id });
    return;
  } catch (error) {
    throw new Error(error.message);
  }
};
