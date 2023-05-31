import * as mockSchema from "../schemas/project.schema";
import { mockProjects } from "./mock-project";
import * as projectService from "../services/project.service";
import { Project } from "../models/project.model";
jest.mock("../schemas/project.schema");

describe("Project Service Test ", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should getAllProjects", () => {
    const returnValue = [mockProjects];
    const mockModel = jest
      .spyOn(mockSchema.ProjectModel, "aggregate")
      .mockReturnValueOnce(returnValue as any);

    const result = projectService.getAllProjects();
    expect(result).toEqual(returnValue);
    expect(mockModel).toHaveBeenCalledTimes(1);
  });

  test("should getProjectById", () => {
    const returnValue = [mockProjects];
    const mockModel = jest
      .spyOn(mockSchema.ProjectModel, "findById")
      .mockReturnValueOnce(returnValue as any);
    const result = projectService.getProjectById("myId");
    expect(result).toEqual(returnValue);
    expect(mockModel).toHaveBeenCalledTimes(1);
  });

  describe("Should getProject", () => {
    test("should getProject when project found", async () => {
      const returnValue = mockProjects;
      const mockModel = jest
        .spyOn(mockSchema.ProjectModel, "findById")
        .mockReturnValueOnce(returnValue as any);
      const result = await projectService.getProject("myId");
      expect(result).toEqual(returnValue);
      expect(mockModel).toHaveBeenCalledTimes(1);
    });

    test("should getProject when project not found", async () => {
      const returnValue: any = null;
      const mockModel = jest
        .spyOn(mockSchema.ProjectModel, "findById")
        .mockReturnValueOnce(returnValue as any);
      try {
        const result = await projectService.getProject("myId");
        expect(mockModel).toHaveBeenCalledTimes(1);
        expect(result).toBeFalsy();
      } catch (error) {
        expect(error).toBeTruthy();
        expect(error.status).toEqual(404);
        expect(error.message).toEqual("Project not found");
      }
    });
  });

  describe("should createProject", () => {
    test("should createProject success", async () => {
      const mockCreatedProject = {
        value: mockProjects,
        save: jest.fn(),
      };
      const mockModel = jest
        .spyOn(mockSchema, "ProjectModel")
        .mockReturnValueOnce(mockCreatedProject as any);

      const result = await projectService.createProject({} as Project);
      expect(result).toMatchObject(mockCreatedProject);
      expect(mockCreatedProject.save).toHaveBeenCalledTimes(1);
      expect(mockModel).toHaveBeenCalledTimes(1);
    });

    test("should createProject failure", async () => {
      const value = new Error("value");
      const mockCreatedProject = {
        value: mockProjects,
        save: () => Promise.reject(value),
      };

      const mockModel = jest
        .spyOn(mockSchema, "ProjectModel")
        .mockReturnValueOnce(mockCreatedProject as any);

      try {
        await projectService.createProject({} as Project);
      } catch (error) {
        expect(error).toBeTruthy();
        expect(error.status).toBeUndefined;
        expect(error.message).toEqual("value");
      }
    });
  });

  describe("should delete Project", () => {
    test("should delete project success", async () => {
      const returnValue = [mockProjects];
      const mockget = jest
        .spyOn(projectService, "getProjectById")
        .mockReturnValue(returnValue as any);

      const mockModel = jest
        .spyOn(mockSchema.ProjectModel, "findByIdAndRemove")
        .mockReturnValueOnce({} as any);

      const result = await projectService.deleteProject("id");
      expect(result).toBeUndefined();
      expect(mockModel).toHaveBeenCalledTimes(1);
      expect(mockget).toHaveBeenCalledTimes(1);
    });

    test("should delete project failure", async () => {
      const returnValue: any = null;
      const mockget = jest
        .spyOn(projectService, "getProjectById")
        .mockReturnValue(returnValue as any);

      const mockModel = jest
        .spyOn(mockSchema.ProjectModel, "findByIdAndRemove")
        .mockReturnValueOnce({} as any);

      try {
        const result = await projectService.deleteProject("id");
        expect(result).toBeUndefined();
      } catch (error) {
        expect(mockget).toHaveBeenCalledTimes(1);
        expect(mockModel).toHaveBeenCalledTimes(0);
        expect(error).toBeTruthy();
        expect(error.status).toEqual(404);
        expect(error.message).toEqual("Project not found");
      }
    });
  });
});
