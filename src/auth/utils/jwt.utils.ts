import { JwtUser } from "../models/jwt.model";
import { User } from "../models/user.model";
import { sign, decode, JwtPayload } from "jsonwebtoken";

export const handleJwtSign = (user: User): JwtUser => {
  const { _id, email, firstname } = user;
  const token = sign(
    {
      email: email,
      userId: _id.toString(),
      name: firstname,
    },
    process.env.SECRET_KEY,
    { expiresIn: "1h" }
  );

  const decodedToken = decode(token) as JwtPayload;
  const expiresAt = decodedToken.exp;

  return { token, firstname, email, userId: _id.toString(), expiresAt };
};
