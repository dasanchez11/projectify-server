import { CreateProjectDto } from "../dto/create-project.dto";
import { Project } from "../models/project.model";

export const mockProjects: Project = {
  _id: "id",
  name: "name",
  description: "description",
};

export const mockProjectCreateDTO: CreateProjectDto = {
  name: "name",
  description: "description",
};
