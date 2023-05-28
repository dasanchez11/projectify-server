import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import {
  postLoginUserController,
  postRegisterUserController,
} from "../auth.controller";
import { CustomError } from "../../shared/custom-error";
import { mockJwtUser } from "./mock-user";

describe("Test Auth Controller", () => {
  let mockRequest: Request;
  let mockReponse: Response;
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
    } as Request;

    mockReponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  describe("should postRegisterUserController", () => {
    test("should register user success", async () => {
      const mockAuth = jest
        .spyOn(authService, "registerUser")
        .mockResolvedValueOnce();
      await postRegisterUserController(mockRequest, mockReponse);
      expect(mockAuth).toHaveBeenCalledTimes(1);
      expect(mockReponse.status).toHaveBeenCalledWith(200);
      expect(mockReponse.json).toHaveBeenCalledWith({
        message: "user registered success",
      });
    });

    test("should register user  failure", async () => {
      const mockError = new CustomError("my message", 500);
      const mockAuth = jest
        .spyOn(authService, "registerUser")
        .mockRejectedValueOnce(mockError);
      await postRegisterUserController(mockRequest, mockReponse);
      expect(mockAuth).toHaveBeenCalledTimes(1);
      expect(mockReponse.status).toHaveBeenCalledWith(500);
      expect(mockReponse.json).toHaveBeenCalledWith({
        message: mockError.message,
      });
    });
  });

  describe("should postLoginUserController", () => {
    test("should login user success", async () => {
      const mockAuth = jest
        .spyOn(authService, "signInUser")
        .mockResolvedValueOnce(mockJwtUser);
      await postLoginUserController(mockRequest, mockReponse);
      expect(mockAuth).toHaveBeenCalledTimes(1);
      expect(mockAuth).toHaveBeenCalledWith(mockValidDTO);
      expect(mockReponse.status).toHaveBeenCalledWith(200);
      expect(mockReponse.json).toHaveBeenCalledWith({
        message: "Login success",
        data: mockJwtUser,
      });
    });

    test("should login user failure", async () => {
      const mockError = new CustomError("my message", 500);
      const mockAuth = jest
        .spyOn(authService, "signInUser")
        .mockRejectedValueOnce(mockError);
      await postLoginUserController(mockRequest, mockReponse);
      expect(mockAuth).toHaveBeenCalledTimes(1);
      expect(mockReponse.status).toHaveBeenCalledWith(500);
      expect(mockReponse.json).toHaveBeenCalledWith({
        message: mockError.message,
      });
    });
  });
});
