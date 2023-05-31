import { Request, Response } from "express";
import { registerUser, signInUser } from "./services/auth.service";
import { handleErrorResponse } from "../shared/utils/shared.utils";

export const postRegisterUserController = async (
  req: Request,
  res: Response
) => {
  const { validatedDto } = req.body;
  const user = validatedDto;
  try {
    await registerUser(user);
    return res.status(200).json({ message: "user registered success" });
  } catch (error) {
    return handleErrorResponse(error, res);
  }
};

export const postLoginUserController = async (req: Request, res: Response) => {
  const { validatedDto } = req.body;
  const creadentials = validatedDto;
  try {
    const authenticatedUSer = await signInUser(creadentials);
    res.status(200).json({ message: "Login success", data: authenticatedUSer });
  } catch (error) {
    return handleErrorResponse(error, res);
  }
};
