import { mockWeekResponse } from "./mock-report";
import * as reportService from "../services/report.service";
import {
  deleteUserReportController,
  getAllUserReportsPerWeekController,
  postUserReportController,
  putUpdateUserReportController,
} from "../reports.controller";
import { mockJwtUser } from "../../auth/tests/mock-user";
import { AuthRequest } from "../../shared/models/auth-request.model";
import { Response } from "express";
import * as errorHandler from "../../shared/utils/shared.utils";

describe("Test Report Controller", () => {
  let mockRequest: AuthRequest;
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
      user: mockJwtUser,
      params: {
        week: "week",
        reportId: 3,
      },
    } as unknown as AuthRequest;

    mockReponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  describe("Should getAllUserReportsPerWeekController", () => {
    test("should get all reports when success retrieving ", async () => {
      const returnValue = [mockWeekResponse];
      const mockReport = jest
        .spyOn(reportService, "getReportsByUserWeek")
        .mockResolvedValueOnce(returnValue);
      await getAllUserReportsPerWeekController(mockRequest, mockReponse);
      expect(mockReport).toHaveBeenCalledTimes(1);
      expect(mockReport).toHaveBeenCalledWith(mockJwtUser.userId, "week");
      expect(mockReponse.status).toHaveBeenCalledWith(200);
      expect(mockReponse.json).toHaveBeenCalledWith({
        message: "success getting reports",
        data: returnValue,
      });
    });

    test("should get all reports when failure retrieving ", async () => {
      mockError = jest
        .spyOn(errorHandler, "handleErrorResponse")
        .mockReturnValueOnce(
          mockReponse.status(errorStatus).json({ message: errorMessage })
        );
      const mockReport = jest
        .spyOn(reportService, "getReportsByUserWeek")
        .mockRejectedValueOnce(mockError);
      await getAllUserReportsPerWeekController(mockRequest, mockReponse);
      expect(mockReport).toHaveBeenCalledTimes(1);
      expect(mockReponse.json).toHaveBeenCalledWith({
        message: errorMessage,
      });
      expect(mockReponse.status).toHaveBeenCalledWith(errorStatus);
      expect(mockError).toHaveBeenCalledTimes(1);
    });
  });

  describe("Should postUserReportController", () => {
    test("should post reports when success retrieving db ", async () => {
      const returnValue = [mockWeekResponse];
      const mockReport = jest
        .spyOn(reportService, "createReport")
        .mockResolvedValueOnce(returnValue);
      await postUserReportController(mockRequest, mockReponse);
      expect(mockReport).toHaveBeenCalledTimes(1);
      expect(mockReport).toHaveBeenCalledWith(mockValidDTO, mockJwtUser.userId);
      expect(mockReponse.status).toHaveBeenCalledWith(200);
      expect(mockReponse.json).toHaveBeenCalledWith({
        message: "Report created Success",
        data: returnValue,
      });
    });

    test("should post reports when failure retrieving ", async () => {
      mockError = jest
        .spyOn(errorHandler, "handleErrorResponse")
        .mockReturnValueOnce(
          mockReponse.status(errorStatus).json({ message: errorMessage })
        );
      const mockProject = jest
        .spyOn(reportService, "createReport")
        .mockRejectedValueOnce(mockError);
      await postUserReportController(mockRequest, mockReponse);
      expect(mockProject).toHaveBeenCalledTimes(1);
      expect(mockReponse.json).toHaveBeenCalledWith({
        message: errorMessage,
      });
      expect(mockReponse.status).toHaveBeenCalledWith(errorStatus);
      expect(mockError).toHaveBeenCalledTimes(1);
    });
  });

  describe("Should putUpdateUserReportController", () => {
    test("should update reports when success retrieving db ", async () => {
      const mockReport = jest
        .spyOn(reportService, "updateReport")
        .mockResolvedValueOnce();
      await putUpdateUserReportController(mockRequest, mockReponse);
      expect(mockReport).toHaveBeenCalledTimes(1);
      expect(mockReport).toHaveBeenCalledWith(
        mockValidDTO,
        3,
        mockJwtUser.userId
      );
      expect(mockReponse.status).toHaveBeenCalledWith(200);
      expect(mockReponse.json).toHaveBeenCalledWith({
        message: "Report updated Success",
      });
    });

    test("should update reports when failure retrieving ", async () => {
      mockError = jest
        .spyOn(errorHandler, "handleErrorResponse")
        .mockReturnValueOnce(
          mockReponse.status(errorStatus).json({ message: errorMessage })
        );
      const mockReport = jest
        .spyOn(reportService, "updateReport")
        .mockRejectedValueOnce(mockError);
      await putUpdateUserReportController(mockRequest, mockReponse);
      expect(mockReport).toHaveBeenCalledTimes(1);
      expect(mockReponse.json).toHaveBeenCalledWith({
        message: errorMessage,
      });
      expect(mockReponse.status).toHaveBeenCalledWith(errorStatus);
      expect(mockError).toHaveBeenCalledTimes(1);
    });
  });

  describe("Should deleteUserReportController", () => {
    test("should delete reports when success retrieving db ", async () => {
      const mockReport = jest
        .spyOn(reportService, "deleteReport")
        .mockResolvedValueOnce();
      await deleteUserReportController(mockRequest, mockReponse);
      expect(mockReport).toHaveBeenCalledTimes(1);
      expect(mockReport).toHaveBeenCalledWith(3, mockJwtUser.userId);
      expect(mockReponse.status).toHaveBeenCalledWith(200);
      expect(mockReponse.json).toHaveBeenCalledWith({
        message: "Report delete success",
      });
    });

    test("should delete reports when failure retrieving ", async () => {
      mockError = jest
        .spyOn(errorHandler, "handleErrorResponse")
        .mockReturnValueOnce(
          mockReponse.status(errorStatus).json({ message: errorMessage })
        );
      const mockReport = jest
        .spyOn(reportService, "deleteReport")
        .mockRejectedValueOnce(mockError);
      await deleteUserReportController(mockRequest, mockReponse);
      expect(mockReport).toHaveBeenCalledTimes(1);
      expect(mockReponse.json).toHaveBeenCalledWith({
        message: errorMessage,
      });
      expect(mockReponse.status).toHaveBeenCalledWith(errorStatus);
      expect(mockError).toHaveBeenCalledTimes(1);
    });
  });
});
