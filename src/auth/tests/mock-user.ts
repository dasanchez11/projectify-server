import { JwtUser } from "../models/jwt.model";
import { User } from "../models/user.model";

export const mockUser: User = {
  _id: "123456789",
  firstname: "John",
  lastname: "Doe",
  username: "johndoe",
  email: "johndoe@example.com",
  password: "password123",
};

export const mockJwtUser: JwtUser = {
  token: "token",
  firstname: "first",
  email: "email",
  userId: "userId",
  expiresAt: 100,
};
