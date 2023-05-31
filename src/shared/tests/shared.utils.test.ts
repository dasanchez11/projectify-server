import { CustomError } from "../custom-error";
import { handleErrorResponse } from "../utils/shared.utils";
import { Response } from "express";

describe("Test Share Utils", () => {
  test("should handle Error response if status", () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const error = new CustomError("my error", 500);
    handleErrorResponse(error, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "my error" });
  });

  test("should handle Error response if status", () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const error = new Error("my second error");
    handleErrorResponse(error, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "my second error" });
  });
});
