import { Router } from "express";
import { postLoginUser, postRegisterUser } from "../auth.controller";
import { validationMiddleware } from "../../shared/middleware/validation.middleware";
import { CreateUserDTO } from "../dto/create-user.dto";
import { signInDTO } from "../dto/sign-in.dto";

export const authRouter = Router();

authRouter.post(
  "/register",
  validationMiddleware(CreateUserDTO),
  postRegisterUser
);

authRouter.post("/login", validationMiddleware(signInDTO), postLoginUser);
