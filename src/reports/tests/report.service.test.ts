import * as mockSchema from "../schema/report.schema";
import * as reportService from "../services/report.service";
import * as mongoose from "mongoose";
import {
  mockCreateReportDTO,
  mockReport,
  mockUpdateReportDTO,
  mockWeekResponse,
} from "./mock-report";
import { Report } from "../models/report.model";
import * as reportUtils from "../utils/week.utils";
import * as hourUtils from "../utils/count-hours.utils";

jest.mock("../schema/report.schema");

describe("Reports Service Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should getReportById", async () => {
    const returnValue = mockReport;
    const mockModel = jest
      .spyOn(mockSchema.ReportModel, "findById")
      .mockResolvedValueOnce(returnValue);
    const result = await reportService.getReportById("id");
    expect(result).toEqual(returnValue);
    expect(mockModel).toHaveBeenCalledTimes(1);
  });

  describe("should getReportByProjectIdAndUserId", () => {
    test("should get report by projectId and userId success", async () => {
      const returnValue = mockReport;
      const mockModel = jest
        .spyOn(mockSchema.ReportModel, "findOne")
        .mockResolvedValueOnce(returnValue);
      const result = await reportService.getReportByProjectIdAndUserId(
        "projectId",
        "userId"
      );
      expect(result).toEqual(returnValue);
      expect(mockModel).toHaveBeenCalledTimes(1);
    });

    test("should get report by projectId and userUd when no report found", async () => {
      const mockModel = jest
        .spyOn(mockSchema.ReportModel, "findOne")
        .mockResolvedValueOnce(null);
      try {
        const result = await reportService.getReportByProjectIdAndUserId(
          "projectId",
          "userId"
        );
        expect(result).toBeFalsy();
      } catch (error) {
        expect(error).toBeTruthy();
        expect(mockModel).toHaveBeenCalledTimes(1);
        expect(error.message).toEqual("Report Not Found");
        expect(error.status).toEqual(404);
      }
    });

    test("should get report by projectId and userUd when failure retrieving db", async () => {
      const mockError = new Error("my error");
      const mockModel = jest
        .spyOn(mockSchema.ReportModel, "findOne")
        .mockRejectedValueOnce(mockError);
      try {
        const result = await reportService.getReportByProjectIdAndUserId(
          "projectId",
          "userId"
        );
        expect(result).toBeFalsy();
      } catch (error) {
        expect(error).toBeTruthy();
        expect(mockModel).toHaveBeenCalledTimes(1);
        expect(error.message).toEqual(mockError.message);
        expect(error.status).toBeFalsy();
      }
    });
  });

  test("should getReportsByUserWeek", async () => {
    const returnValue = [mockWeekResponse];
    const mockConvertor = jest
      .spyOn(mongoose.Types, "ObjectId")
      .mockReturnValue("userId" as any);
    const mockModel = jest
      .spyOn(mockSchema.ReportModel, "aggregate")
      .mockResolvedValueOnce(returnValue);
    const result = await reportService.getReportsByUserWeek("userId", "week");
    expect(result).toEqual(returnValue);
    expect(mockConvertor).toHaveBeenCalledTimes(1);
    expect(mockModel).toHaveBeenCalledTimes(1);
  });

  test("should getReportByProjectUserAndWeek", async () => {
    const returnValue = [mockWeekResponse];
    const mockModel = jest
      .spyOn(mockSchema.ReportModel, "find")
      .mockResolvedValueOnce(returnValue);
    const result = await reportService.getReportByProjectUserAndWeek(
      "userId",
      "projectUd",
      "week"
    );
    expect(result).toEqual(returnValue);
    expect(mockModel).toHaveBeenCalledTimes(1);
  });

  describe("should createReport", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test("should create report success", async () => {
      const returnValue = [mockWeekResponse];
      const mockCreatedUser = {
        ...mockReport,
        save: jest.fn(),
      };
      const mockgetReport = jest
        .spyOn(reportService, "getReportByProjectUserAndWeek")
        .mockResolvedValueOnce([]);
      const mockUtils = jest
        .spyOn(reportUtils, "validEdit")
        .mockReturnValueOnce(true);
      const mockValidate = jest
        .spyOn(reportService, "validateHours")
        .mockResolvedValueOnce(true);
      const mockCompleteReport = jest
        .spyOn(reportService, "getCompleteReportById")
        .mockResolvedValue([mockWeekResponse]);
      const mockModel = jest
        .spyOn(mockSchema, "ReportModel")
        .mockReturnValueOnce(mockCreatedUser as any);

      const result = await reportService.createReport(
        mockCreateReportDTO,
        "userId"
      );
      expect(result).toEqual(returnValue);
      expect(mockgetReport).toHaveBeenCalledTimes(1);
      expect(mockUtils).toHaveBeenCalledTimes(1);
      expect(mockValidate).toHaveBeenCalledTimes(1);
      expect(mockCompleteReport).toHaveBeenCalledTimes(1);
      expect(mockModel).toHaveBeenCalledTimes(1);
    });

    test("should create report if user has already a project-report that week", async () => {
      const returnValue = [mockWeekResponse];
      const mockCreatedUser = {
        ...mockReport,
        save: jest.fn(),
      };
      const mockgetReport = jest
        .spyOn(reportService, "getReportByProjectUserAndWeek")
        .mockResolvedValueOnce([mockReport]);
      const mockUtils = jest
        .spyOn(reportUtils, "validEdit")
        .mockReturnValueOnce(true);
      const mockValidate = jest
        .spyOn(reportService, "validateHours")
        .mockResolvedValueOnce(true);
      const mockCompleteReport = jest
        .spyOn(reportService, "getCompleteReportById")
        .mockResolvedValue([mockWeekResponse]);
      const mockModel = jest
        .spyOn(mockSchema, "ReportModel")
        .mockReturnValueOnce(mockCreatedUser as any);

      try {
        const result = await reportService.createReport(
          mockCreateReportDTO,
          "userId"
        );
        expect(result).toBeFalsy();
      } catch (error) {
        expect(error).toBeTruthy();
        expect(error.status).toEqual(403);
        expect(error.message).toEqual(
          "User Already has hours for the project in the current week"
        );
        expect(mockgetReport).toHaveBeenCalledTimes(1);
        expect(mockUtils).toHaveBeenCalledTimes(0);
        expect(mockValidate).toHaveBeenCalledTimes(0);
        expect(mockCompleteReport).toHaveBeenCalledTimes(0);
        expect(mockModel).toHaveBeenCalledTimes(0);
      }
    });

    test("should create report if report is not allowed to edit", async () => {
      const mockgetReport = jest
        .spyOn(reportService, "getReportByProjectUserAndWeek")
        .mockResolvedValueOnce([]);
      const mockUtils = jest
        .spyOn(reportUtils, "validEdit")
        .mockReturnValueOnce(false);

      try {
        await reportService.createReport(mockCreateReportDTO, "userId");
      } catch (error) {
        expect(error).toBeTruthy();
        expect(error.status).toEqual(401);
        expect(error.message).toEqual("Not Authorized to edit report");
        expect(mockgetReport).toHaveBeenCalledTimes(1);
        expect(mockUtils).toHaveBeenCalledTimes(1);
      }
    });

    test("should create report if surpasses 45 weekly hour limit", async () => {
      const mockgetReport = jest
        .spyOn(reportService, "getReportByProjectUserAndWeek")
        .mockResolvedValueOnce([]);
      const mockUtils = jest
        .spyOn(reportUtils, "validEdit")
        .mockReturnValueOnce(true);
      const mockValidate = jest
        .spyOn(reportService, "validateHours")
        .mockResolvedValueOnce(false);
      try {
        await reportService.createReport(mockCreateReportDTO, "userId");
      } catch (error) {
        expect(error).toBeTruthy();
        expect(error.status).toEqual(403);
        expect(error.message).toEqual("Surpass 45 weekly hour limit");
        expect(mockgetReport).toHaveBeenCalledTimes(1);
        expect(mockUtils).toHaveBeenCalledTimes(1);
        expect(mockValidate).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe("Should updateReport", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    test("should update report success", async () => {
      const mockFoundReport = {
        ...mockReport,
        save: jest.fn(),
      };
      const mockgetReport = jest
        .spyOn(reportService, "getReportById")
        .mockResolvedValueOnce(mockFoundReport as any);
      const mockUtils = jest
        .spyOn(reportUtils, "validEdit")
        .mockReturnValueOnce(true);
      const mockValidate = jest
        .spyOn(reportService, "validateHours")
        .mockResolvedValueOnce(true);

      const result = await reportService.updateReport(
        mockUpdateReportDTO,
        mockFoundReport._id as any,
        mockFoundReport.userId as any
      );
      expect(result).toBeUndefined();
      expect(mockgetReport).toHaveBeenCalledTimes(1);
      expect(mockUtils).toHaveBeenCalledTimes(1);
      expect(mockValidate).toHaveBeenCalledTimes(1);
      expect(mockFoundReport.save).toHaveBeenCalledTimes(1);
    });

    test("should update report if report to update not found", async () => {
      const mockFoundReport = {
        ...mockReport,
        save: jest.fn(),
      };
      const mockgetReport = jest
        .spyOn(reportService, "getReportById")
        .mockResolvedValueOnce(null);

      try {
        await reportService.updateReport(
          mockUpdateReportDTO,
          mockFoundReport._id as any,
          mockFoundReport.userId as any
        );
      } catch (error) {
        expect(mockgetReport).toHaveBeenCalledTimes(1);
        expect(error).toBeTruthy();
        expect(error.status).toEqual(404);
        expect(error.message).toEqual("Report to update not found");
      }
    });

    test("should update report if report doesnt belong to user", async () => {
      const mockFoundReport = {
        ...mockReport,
        save: jest.fn(),
      };
      const mockgetReport = jest
        .spyOn(reportService, "getReportById")
        .mockResolvedValueOnce(mockFoundReport as any);

      try {
        await reportService.updateReport(
          mockUpdateReportDTO,
          mockFoundReport._id as any,
          "secondUserId" as any
        );
      } catch (error) {
        expect(mockgetReport).toHaveBeenCalledTimes(1);
        expect(error).toBeTruthy();
        expect(error.status).toEqual(401);
        expect(error.message).toEqual("Not Authorized to update report");
      }
    });
    test("should update report if week is not within a month", async () => {
      const mockFoundReport = {
        ...mockReport,
        save: jest.fn(),
      };
      const mockgetReport = jest
        .spyOn(reportService, "getReportById")
        .mockResolvedValueOnce(mockFoundReport as any);

      const mockUtils = jest
        .spyOn(reportUtils, "validEdit")
        .mockReturnValueOnce(false);

      try {
        await reportService.updateReport(
          mockUpdateReportDTO,
          mockFoundReport._id as any,
          mockFoundReport.userId as any
        );
      } catch (error) {
        expect(mockgetReport).toHaveBeenCalledTimes(1);
        expect(mockUtils).toHaveBeenCalledTimes(1);
        expect(error).toBeTruthy();
        expect(error.status).toEqual(401);
        expect(error.message).toEqual(
          "Not Authorized to update report for this week"
        );
      }
    });

    test("should update report if surpass 45 week-hour limit", async () => {
      const mockFoundReport = {
        ...mockReport,
        save: jest.fn(),
      };
      const mockgetReport = jest
        .spyOn(reportService, "getReportById")
        .mockResolvedValueOnce(mockFoundReport as any);

      const mockUtils = jest
        .spyOn(reportUtils, "validEdit")
        .mockReturnValueOnce(true);

      const mockValidate = jest
        .spyOn(reportService, "validateHours")
        .mockResolvedValueOnce(false);

      try {
        await reportService.updateReport(
          mockUpdateReportDTO,
          mockFoundReport._id as any,
          mockFoundReport.userId as any
        );
      } catch (error) {
        expect(mockgetReport).toHaveBeenCalledTimes(1);
        expect(mockUtils).toHaveBeenCalledTimes(1);
        expect(mockValidate).toHaveBeenCalledTimes(1);

        expect(error).toBeTruthy();
        expect(error.status).toEqual(403);
        expect(error.message).toEqual("Surpass 45 weekly hour limit");
      }
    });
  });

  describe("Shoud deleteReport", () => {
    test("should delete report success", async () => {
      const mockFoundReport = mockReport;
      const mockgetReport = jest
        .spyOn(reportService, "getReportById")
        .mockResolvedValueOnce(mockFoundReport as any);

      const mockUtils = jest
        .spyOn(reportUtils, "validEdit")
        .mockReturnValueOnce(true);

      const mockModel = jest
        .spyOn(mockSchema.ReportModel, "deleteOne")
        .mockResolvedValue({} as any);
      await reportService.deleteReport(
        mockFoundReport._id as any,
        mockFoundReport.userId as any
      );
      expect(mockgetReport).toHaveBeenCalledTimes(1);
      expect(mockUtils).toHaveBeenCalledTimes(1);
      expect(mockModel).toHaveBeenCalledTimes(1);
    });

    test("should delete report when report not found", async () => {
      const mockFoundReport = mockReport;
      const mockgetReport = jest
        .spyOn(reportService, "getReportById")
        .mockResolvedValueOnce(null);

      try {
        await reportService.deleteReport(
          mockFoundReport._id as any,
          mockFoundReport.userId as any
        );
      } catch (error) {
        expect(error).toBeTruthy();
        expect(mockgetReport).toHaveBeenCalledTimes(1);
        expect(error.status).toBe(404);
        expect(error.message).toBe("Report to delete not found");
      }
    });

    test("should delete report when diferent userId", async () => {
      const mockFoundReport = mockReport;
      const mockgetReport = jest
        .spyOn(reportService, "getReportById")
        .mockResolvedValueOnce(mockFoundReport as any);

      try {
        await reportService.deleteReport(
          mockFoundReport._id as any,
          "secondUserId" as any
        );
      } catch (error) {
        expect(error).toBeTruthy();
        expect(mockgetReport).toHaveBeenCalledTimes(1);
        expect(error.status).toBe(401);
        expect(error.message).toBe("Not Authorized to delete report");
      }
    });

    test("should delete report when week is not within a month", async () => {
      const mockFoundReport = mockReport;
      const mockgetReport = jest
        .spyOn(reportService, "getReportById")
        .mockResolvedValueOnce(mockFoundReport as any);

      const mockUtils = jest
        .spyOn(reportUtils, "validEdit")
        .mockReturnValueOnce(false);

      try {
        await reportService.deleteReport(
          mockFoundReport._id as any,
          mockFoundReport.userId as any
        );
      } catch (error) {
        expect(error).toBeTruthy();
        expect(mockgetReport).toHaveBeenCalledTimes(1);
        expect(mockUtils).toHaveBeenCalledTimes(1);
        expect(error.status).toBe(401);
        expect(error.message).toBe("Not Authorized to delete report");
      }
    });
  });

  test("should getCompleteReportById", async () => {
    const mockConvertor = jest
      .spyOn(mongoose.Types, "ObjectId")
      .mockReturnValue("userId" as any);
    const mockModel = jest
      .spyOn(mockSchema.ReportModel, "aggregate")
      .mockResolvedValueOnce([mockWeekResponse]);

    const result = await reportService.getCompleteReportById("userId");
    expect(result).toEqual([mockWeekResponse]);
    expect(mockConvertor).toHaveBeenCalledTimes(1);
    expect(mockModel).toHaveBeenCalledTimes(1);
  });

  describe("should validateHours", () => {
    test("should validateHours", async () => {
      const mockgetReport = jest
        .spyOn(reportService, "getReportsByUserWeek")
        .mockResolvedValueOnce([mockWeekResponse]);
      const mockAdd = jest
        .spyOn(hourUtils, "canAddHours")
        .mockReturnValueOnce(true);
      const result = await reportService.validateHours("userId", mockReport);
      expect(result).toEqual(true);
      expect(mockgetReport).toHaveBeenCalledTimes(1);
      expect(mockAdd).toHaveBeenCalledTimes(1);
    });

    test("should validateHours when error in db", async () => {
      const mockError = new Error("my error");
      const mockgetReport = jest
        .spyOn(reportService, "getReportsByUserWeek")
        .mockRejectedValue(mockError);
      try {
        await reportService.validateHours("userId", mockReport);
      } catch (error) {
        expect(mockgetReport).toHaveBeenCalledTimes(1);
        expect(error).toBeTruthy();
        expect(error.message).toEqual(mockError.message);
      }
    });
  });
});
