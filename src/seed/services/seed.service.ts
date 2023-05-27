import { CreateProjectDto } from "../../projects/dto/create-project.dto";
import { ProjectModel } from "../../projects/schemas/project.schema";

export const createSeedProject = async (projectArray: CreateProjectDto[]) => {
  try {
    const projects = await ProjectModel.insertMany(projectArray);
    return projects;
  } catch (error) {
    throw new Error(error.message);
  }
};
