import { NextFunction, Response } from "express";
import { verify } from "jsonwebtoken";
import { AuthRequest } from "../models/auth-request.model";
import { CustomError } from "../custom-error";

export const isAuthenticated = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization Error" });
  }
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).json({ message: "Authentication Invalid" });
  }

  let token;
  try {
    token = verifyToken(authorization);
  } catch (error) {
    return res.status(error.status).json({ message: error.message });
  }

  if (!token) {
    return res.status(401).json({ message: "Problem Authorizing the request" });
  } else {
    req.user = token;
    next();
  }
};

const verifyToken = (authorization: string) => {
  const token = authorization.slice(7);
  try {
    const tokenResponse = verify(token, process.env.SECRET_KEY);
    return tokenResponse;
  } catch (err) {
    throw new CustomError("Not Authorized", 500);
  }
};