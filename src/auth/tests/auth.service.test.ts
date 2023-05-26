import * as UserSchema from "../schema/user.schema";
import * as authService from "../services/auth.service";
import * as authUtils from "../utils/auth.utils";
import * as jwtUtils from "../utils/jwt.utils";
import { mockUser } from "./mock-user";

jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
}));

import * as bcrypt from "bcryptjs";

describe("Auth Service Test", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should getUserByEmail", async () => {
    const returnUser = mockUser;
    const spyModel = jest
      .spyOn(UserSchema.UserModel, "findOne")
      .mockResolvedValueOnce(returnUser);
    const result = await authService.getUserByEmail(mockUser.email);
    expect(result).toEqual(returnUser);
    expect(spyModel).toHaveBeenCalledTimes(1);
    expect(spyModel).toHaveBeenCalledWith({ email: returnUser.email });
  });

  test("should getUserById", async () => {
    const returnUser = mockUser;
    const spyModel = jest
      .spyOn(UserSchema.UserModel, "findById")
      .mockReturnValueOnce(Promise.resolve(returnUser) as any);
    const result = await authService.getUserById(mockUser._id);
    expect(result).toEqual(returnUser);
    expect(spyModel).toHaveBeenCalledTimes(1);
    expect(spyModel).toHaveBeenCalledWith(returnUser._id);
  });

  describe("Should Register User", () => {
    test("should register user success", async () => {
      const mockCreatedUser = {
        save: jest.fn(),
      };
      const password = "password";
      const mockModel = jest
        .spyOn(UserSchema, "UserModel")
        .mockReturnValueOnce(mockCreatedUser as any);
      const mockService = jest
        .spyOn(authService, "getUserByEmail")
        .mockReturnValueOnce(null);
      const mockHash = jest
        .spyOn(authUtils, "hashPassword")
        .mockResolvedValueOnce(password);
      await authService.registerUser(mockUser);
      expect(mockService).toHaveBeenCalledTimes(1);
      expect(mockCreatedUser.save).toHaveBeenCalledTimes(1);
      expect(mockModel).toHaveBeenCalledTimes(1);
      expect(mockHash).toHaveBeenCalledTimes(1);
    });

    test("should register user if email already exists", async () => {
      const mockService = jest
        .spyOn(authService, "getUserByEmail")
        .mockResolvedValue(mockUser as any);
      try {
        await authService.registerUser(mockUser);
        expect(mockService).toHaveBeenCalledTimes(1);
      } catch (error) {
        expect(error).toBeTruthy();
        expect(error.message).toBeTruthy();
        expect(error.status).toEqual(403);
      }
    });
  });

  describe("should sign in user", () => {
    test("should sing in success", async () => {
      jest.spyOn(bcrypt, "compare").mockResolvedValueOnce(true as never);
      const mockCredentials = { email: "email", password: "password" };
      const mockFoundUser = jest
        .spyOn(authService, "getUserByEmail")
        .mockResolvedValueOnce(mockUser as any);

      const mockJwtSign = jest
        .spyOn(jwtUtils, "handleJwtSign")
        .mockResolvedValueOnce(mockUser as never);
      const result = await authService.signInUser(mockCredentials);
      expect(mockFoundUser).toHaveBeenCalledTimes(1);
      expect(mockJwtSign).toBeCalledTimes(1);
      //   expect(mockCompare).toBeCalledTimes(1);
      expect(result).toEqual(mockUser);
    });

    test("should sign in if user not found", async () => {
      jest.spyOn(bcrypt, "compare").mockResolvedValueOnce(false as never);
      const mockCredentials = { email: "email", password: "password" };
      const mockFoundUser = jest
        .spyOn(authService, "getUserByEmail")
        .mockResolvedValueOnce(null);
      try {
        await authService.signInUser(mockCredentials);
        expect(mockFoundUser).toHaveBeenCalledTimes(1);
      } catch (error) {
        expect(error).toBeTruthy();
        expect(error.message).toBeTruthy();
        expect(error.status).toEqual(404);
      }
    });

    test("should should sign in user passwords don't match", async () => {
      jest.spyOn(bcrypt, "compare").mockResolvedValueOnce(false as never);

      const mockCredentials = { email: "email", password: "password" };

      const mockFoundUser = jest
        .spyOn(authService, "getUserByEmail")
        .mockResolvedValueOnce(mockUser as any);
      try {
        await authService.signInUser(mockCredentials);
        expect(mockFoundUser).toHaveBeenCalledTimes(1);
        expect(bcrypt.compare).toHaveBeenCalledTimes(1);
      } catch (error) {
        expect(error).toBeTruthy();
        expect(error.message).toBeTruthy();
        expect(error.status).toEqual(401);
      }
    });
  });
});
