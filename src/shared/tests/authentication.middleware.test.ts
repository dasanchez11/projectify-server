import { CustomError } from "../custom-error";
import * as authMiddle from "../middleware/authentication.middleware";
import * as jwt from "jsonwebtoken";
jest.mock("jsonwebtoken");

describe("Test Authentication Middleware", () => {
  const req = {
    body: {} as any,
    params: {},
    get: jest.fn(),
    headers: { authorization: null } as any,
  };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test("should return if there is no auth header", async () => {
    req.get.mockReturnValue(null);
    authMiddle.isAuthenticated(req as any, res as any, next);
    expect(req.get).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Authorization Error",
    });
  });

  test("should return if there is no auth authorization", async () => {
    req.get.mockReturnValue("authorization");
    authMiddle.isAuthenticated(req as any, res as any, next);
    expect(req.get).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Authentication Invalid",
    });
  });

  test("should return next if token valid", async () => {
    req.get.mockReturnValue("authorization");
    req.headers.authorization = "Bearer faketoken";
    const mockJwt = jest
      .spyOn(jwt, "verify")
      .mockResolvedValueOnce("validToken" as never);
    authMiddle.isAuthenticated(req as any, res as any, next);
    expect(mockJwt).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledTimes(1);
  });

  test("should return poblem authorizing if token not returned", async () => {
    req.get.mockReturnValue("authorization");
    req.headers.authorization = "Bearer faketoken";
    const mockJwt = jest.spyOn(authMiddle, "verifyToken").mockReturnValue(null);
    authMiddle.isAuthenticated(req as any, res as any, next);
    expect(mockJwt).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Problem Authorizing the request",
    });
  });

  test("should return custom error if problem verifying", async () => {
    const mockError = new CustomError("myerror", 500);
    req.get.mockReturnValue("authorization");
    req.headers.authorization = "Bearer faketoken";
    const mockJwt = jest
      .spyOn(authMiddle, "verifyToken")
      .mockImplementation(() => {
        throw mockError;
      });
    authMiddle.isAuthenticated(req as any, res as any, next);
    expect(mockJwt).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: mockError.message,
    });
  });

  test("should verifyToken success", () => {
    const mockVerify = jest
      .spyOn(jwt, "verify")
      .mockReturnValue("token" as any);
    const result = authMiddle.verifyToken("bearer token");
    expect(result).toEqual("token");
    expect(mockVerify).toHaveBeenCalledTimes(1);
  });

  test("should verifyToken failure", () => {
    const mockVerify = jest.spyOn(jwt, "verify").mockImplementation(() => {
      throw new Error("error");
    });
    try {
      authMiddle.verifyToken("bearer token");
    } catch (error) {
      expect(mockVerify).toHaveBeenCalledTimes(1);
      expect(error).toBeTruthy();
      expect(error.message).toEqual("Not Authorized");
      expect(error.status).toEqual(500);
    }
  });
});
