import { Router } from "express";
import {
  postLoginUserController,
  postRegisterUserController,
} from "../auth.controller";
import { validationMiddleware } from "../../shared/middleware/validation.middleware";
import { CreateUserDTO } from "../dto/create-user.dto";
import { signInDTO } from "../dto/sign-in.dto";

export const authRouter = Router();

authRouter.post(
  "/register",
  validationMiddleware(CreateUserDTO),
  postRegisterUserController
);

authRouter.post(
  "/login",
  validationMiddleware(signInDTO),
  postLoginUserController
);
