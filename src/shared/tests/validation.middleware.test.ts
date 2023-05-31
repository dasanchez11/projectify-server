import * as validationMidd from "../middleware/validation.middleware";
import * as classTransformer from "class-transformer";
import * as classValidator from "class-validator";
import { Request, Response, NextFunction } from "express";

describe("Validation Middleware Test", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  let requestObject = {
    name: "name",
    email: "email",
  };

  class MockSchema {
    name: string;
    email: string;
  }

  let mockValidationErrors = [
    {
      constraints: { email: "emailRequired" },
    },
  ];

  test("should validtate middleware ValidationMiddleware", () => {});

  test("should validate pipe validationPipe", async () => {
    const returnValue = [requestObject];
    const mockPlainToInstance = jest.spyOn(classTransformer, "plainToInstance");
    const mockValidate = jest
      .spyOn(classValidator, "validate")
      .mockResolvedValueOnce([]);

    const mockInstanceToPlain = jest
      .spyOn(classTransformer, "instanceToPlain")
      .mockReturnValue(returnValue);

    const result = await validationMidd.validationPipe(
      MockSchema,
      requestObject
    );
    expect(mockPlainToInstance).toHaveBeenCalledTimes(1);
    expect(mockValidate).toHaveBeenCalledTimes(1);
    expect(mockInstanceToPlain).toHaveBeenCalledTimes(1);
    expect(result).toEqual(returnValue);
  });

  test("should validate pipe when errors found", async () => {
    const returnValue = [requestObject];
    const mockPlainToInstance = jest.spyOn(classTransformer, "plainToInstance");
    const mockValidate = jest
      .spyOn(classValidator, "validate")
      .mockResolvedValueOnce([1 as any, 2 as any]);

    const mockInstanceToPlain = jest
      .spyOn(classTransformer, "instanceToPlain")
      .mockReturnValue([returnValue]);

    const result = await validationMidd.validationPipe(
      MockSchema,
      requestObject
    );
    expect(mockPlainToInstance).toHaveBeenCalledTimes(1);
    expect(mockValidate).toHaveBeenCalledTimes(1);
    expect(mockInstanceToPlain).toHaveBeenCalledTimes(0);
    expect(result).toEqual([1, 2]);
  });

  test("should getValidationError", () => {
    const result = validationMidd.getValidationErrors(
      mockValidationErrors as any
    );
    expect(result).toEqual(["emailRequired"]);
  });

  describe("Should apply validationMiddleware", () => {
    const req = { body: {} as any, params: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("should apply validationMiddleware success", async () => {
      const returnValue = { name: "name" };
      const mockPipe = jest
        .spyOn(validationMidd, "validationPipe")
        .mockResolvedValue(returnValue);
      await validationMidd.validationMiddleware(MockSchema)(
        req as any,
        res as any,
        next
      );
      expect(mockPipe).toHaveBeenCalledTimes(1);
      expect(req.body).toEqual({ validatedDto: returnValue });
      expect(next).toHaveBeenCalledTimes(1);
    });
    test("should apply validationMiddleware success when found errors in DTO", async () => {
      const returnValue = "email required";
      const mockPipe = jest
        .spyOn(validationMidd, "validationPipe")
        .mockResolvedValue([returnValue]);

      const mockValidation = jest
        .spyOn(validationMidd, "getValidationErrors")
        .mockReturnValue([returnValue]);

      await validationMidd.validationMiddleware(MockSchema)(
        req as any,
        res as any,
        next
      );
      expect(mockPipe).toHaveBeenCalledTimes(1);
      expect(mockValidation).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(0);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: [returnValue] });
    });
    test("should apply validationMiddleware failure when something fails", async () => {
      const returnValue = new Error("my error");
      const mockPipe = jest
        .spyOn(validationMidd, "validationPipe")
        .mockRejectedValue(returnValue);
      await validationMidd.validationMiddleware(MockSchema)(
        req as any,
        res as any,
        next
      );
      expect(mockPipe).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledTimes(0);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: returnValue.message });
    });
  });
});
