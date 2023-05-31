import { hashPassword } from "../utils/auth.utils";
jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
}));

import * as bcrypt from "bcryptjs";

describe("Test Auth Utils", () => {
  test("should hash password success", async () => {
    const hashed = "hashed";
    const mockHash = jest
      .spyOn(bcrypt, "hash")
      .mockResolvedValueOnce(hashed as never);
    const result = await hashPassword("password");
    expect(result).toEqual(hashed);
    expect(mockHash).toHaveBeenCalledTimes(1);
  });

  test("should hash password failure", async () => {
    const mockHash = jest
      .spyOn(bcrypt, "hash")
      .mockRejectedValueOnce(new Error("bad request") as never);
    try {
      await hashPassword("password");
      expect(mockHash).toHaveBeenCalledTimes(1);
    } catch (error) {
      expect(error).toBeTruthy();
      expect(error.message).toEqual("bad request");
    }
  });
});
