import { Request, Response } from "express";
import { registerUser, signInUser } from "./services/auth.service";

export const postRegisterUser = async (req: Request, res: Response) => {
  const { validatedDto } = req.body;
  const user = validatedDto;
  try {
    await registerUser(user);
    return res.status(200).json({ message: "user registered success" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const postLoginUser = async (req: Request, res: Response) => {
  const { validatedDto } = req.body;
  const creadentials = validatedDto;
  try {
    const authenticatedUSer = await signInUser(creadentials);
    res.status(200).json({ message: "Login success", user: authenticatedUSer });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
