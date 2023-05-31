import * as jwt from "jsonwebtoken";
import { mockUser } from "./mock-user";
import { handleJwtSign } from "../utils/jwt.utils";

jest.mock("jsonwebtoken", () => ({ sign: jest.fn(), decode: jest.fn() }));

describe("Test Jwt Utils", () => {
  test("should handleJwtSign", () => {
    const { firstname, email, _id } = mockUser;
    const expectedResult = {
      firstname,
      email,
      userId: _id,
      expiresAt: 1001,
      token: "token",
    };

    const decodedToken = {
      exp: 1001,
    };
    const mockjwt = jest.spyOn(jwt, "sign").mockReturnValue("token" as never);
    const mockDecode = jest
      .spyOn(jwt, "decode")
      .mockReturnValueOnce(decodedToken);
    const result = handleJwtSign(mockUser);
    expect(result).toEqual(expectedResult);
    expect(mockjwt).toHaveBeenCalledTimes(1);
    expect(mockDecode).toHaveBeenCalledTimes(1);
  });
});
