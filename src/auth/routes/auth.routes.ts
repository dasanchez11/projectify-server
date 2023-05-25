import { Router } from "express";
import { postRegisterUser } from "../auth.controller";

export const authRouter = Router();

authRouter.post("/register", postRegisterUser);
