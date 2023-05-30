import { Request, Response } from "express";
import * as projectSevice from "../services/project.service";
import { mockProjects } from "./mock-project";

import {
  deleteProjectController,
  getAllProjectsController,
  postProjectController,
} from "../project.controller";
import * as errorHandler from "../../shared/utils/shared.utils";

describe("Test Project Controller", () => {
  let mockRequest: Request;
  let mockReponse: Response;
  let mockError: any;
  const errorMessage: string = "my error";
  const errorStatus: number = 400;
  const mockValidDTO = {
    name: "name",
    other: "other",
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = {
      body: {
        validatedDto: mockValidDTO,
      },
      params: {
        projectId: 3,
      },
    } as unknown as Request;

    mockReponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  describe("Should getAllProjects", () => {
    test("should get all projects when success retrieving ", async () => {
      const returnValue = [mockProjects];
      const mockRes = jest
        .spyOn(projectSevice, "getAllProjects")
        .mockResolvedValueOnce(returnValue);
      await getAllProjectsController(mockRequest, mockReponse);
      expect(mockRes).toHaveBeenCalledTimes(1);
      expect(mockReponse.status).toHaveBeenCalledWith(200);
      expect(mockReponse.json).toHaveBeenCalledWith({
        message: "success getting projects",
        data: returnValue,
      });
    });

    test("should get all projects when failure retrieving ", async () => {
      mockError = jest
        .spyOn(errorHandler, "handleErrorResponse")
        .mockReturnValueOnce(
          mockReponse.status(errorStatus).json({ message: errorMessage })
        );

      const mockProject = jest
        .spyOn(projectSevice, "getAllProjects")
        .mockRejectedValueOnce(mockError);
      await getAllProjectsController(mockRequest, mockReponse);
      expect(mockProject).toHaveBeenCalledTimes(1);
      expect(mockReponse.json).toHaveBeenCalledWith({
        message: errorMessage,
      });
      expect(mockReponse.status).toHaveBeenCalledWith(errorStatus);
      expect(mockError).toHaveBeenCalledTimes(1);
    });
  });

  describe("should postProject controller", () => {
    test("should post project when success", async () => {
      const returnValue = mockProjects;
      const mockCreate = jest
        .spyOn(projectSevice, "createProject")
        .mockResolvedValueOnce(returnValue);

      await postProjectController(mockRequest, mockReponse);
      expect(mockCreate).toHaveBeenCalledTimes(1);
      expect(mockReponse.status).toHaveBeenCalledWith(200);
      expect(mockReponse.json).toHaveBeenCalledWith({
        message: "success creating project",
        data: returnValue,
      });
    });

    test("should post project when failure ", async () => {
      mockError = jest
        .spyOn(errorHandler, "handleErrorResponse")
        .mockReturnValueOnce(
          mockReponse.status(errorStatus).json({ message: errorMessage })
        );

      const mockProject = jest
        .spyOn(projectSevice, "createProject")
        .mockRejectedValueOnce(mockError);
      await postProjectController(mockRequest, mockReponse);
      expect(mockProject).toHaveBeenCalledTimes(1);
      expect(mockReponse.json).toHaveBeenCalledWith({
        message: errorMessage,
      });
      expect(mockReponse.status).toHaveBeenCalledWith(errorStatus);
      expect(mockError).toHaveBeenCalledTimes(1);
    });
  });

  describe("should deleteProject controller", () => {
    test("should delete project when success", async () => {
      const mockDelete = jest
        .spyOn(projectSevice, "deleteProject")
        .mockResolvedValueOnce();
      await deleteProjectController(mockRequest, mockReponse);
      expect(mockDelete).toHaveBeenCalledTimes(1);
      expect(mockReponse.status).toHaveBeenCalledWith(200);
      expect(mockReponse.json).toHaveBeenCalledWith({
        message: "Project delete success",
      });
    });

    test("should delete project when failure ", async () => {
      mockError = jest
        .spyOn(errorHandler, "handleErrorResponse")
        .mockReturnValueOnce(
          mockReponse.status(errorStatus).json({ message: errorMessage })
        );

      const mockProject = jest
        .spyOn(projectSevice, "deleteProject")
        .mockRejectedValueOnce(mockError);
      await deleteProjectController(mockRequest, mockReponse);
      expect(mockProject).toHaveBeenCalledTimes(1);
      expect(mockReponse.json).toHaveBeenCalledWith({
        message: errorMessage,
      });
      expect(mockReponse.status).toHaveBeenCalledWith(errorStatus);
      expect(mockError).toHaveBeenCalledTimes(1);
    });
  });
});
