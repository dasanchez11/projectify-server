import { CreateUserDTO } from "./dto/create-user.dto";
import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import { registerUser } from "./services/user.service";

export const postRegisterUser = async (req: Request, res: Response) => {
  const user = new CreateUserDTO();
  user.email = req.body.email;
  user.firstname = req.body.firstname;
  user.lastname = req.body.lastname;
  user.password = req.body.password;
  user.username = req.body.username;

  try {
    const errors = await validate(user);
    if (errors.length) {
      return res.status(403).json({ error: errors });
    }
    await registerUser(user);
    return res.status(200).json({ message: "user registered success" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
