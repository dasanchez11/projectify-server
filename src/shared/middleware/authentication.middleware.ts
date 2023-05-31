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
    res.status(401);
    res.json({ message: "Authorization Error" });
    return res;
  }
  const authorization = req.headers.authorization;
  if (!authorization) {
    res.status(401);
    res.json({ message: "Authentication Invalid" });
    return res;
  }

  let token;
  try {
    token = verifyToken(authorization);
  } catch (error) {
    res.status(error.status);
    res.json({ message: error.message });
    return res;
  }

  if (!token) {
    res.status(401);
    res.json({ message: "Problem Authorizing the request" });
    return res;
  } else {
    req.user = token;
    next();
  }
};

export const verifyToken = (authorization: string) => {
  const token = authorization.slice(7);
  try {
    const tokenResponse = verify(token, process.env.SECRET_KEY);
    return tokenResponse;
  } catch (err) {
    throw new CustomError("Not Authorized", 500);
  }
};
