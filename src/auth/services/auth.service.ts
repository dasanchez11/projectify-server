import { ResponseError } from "../../shared/models/error.model";
import { signInDTO } from "../dto/sign-in.dto";
import { UserModel } from "../schema/user.schema";
import { CreateUserDTO } from "auth/dto/create-user.dto";
import { hashPassword } from "../utils/auth.utils";
import { compare } from "bcryptjs";
import { handleJwtSign } from "../utils/jwt.utils";

export const getUserByEmail = (email: string) => {
  return UserModel.findOne({ email }).lean();
};

export const getUserById = (id: string) => {
  return UserModel.findById(id);
};

export const registerUser = async (user: CreateUserDTO) => {
  try {
    const existingEmail = await getUserByEmail(user.email);
    if (existingEmail) {
      const error = new Error() as ResponseError;
      error.message = "Email Already Exists";
      error.status = 403;
      throw error;
    }
    const hashedPassword = await hashPassword(user.password);
    const hashedUser = { ...user, password: hashedPassword };

    const newUser = new UserModel(hashedUser);
    await newUser.save();
    return;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const signInUser = async (creadentials: signInDTO) => {
  const { email, password } = creadentials;
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      const error = new Error() as ResponseError;
      error.message = "User not found";
      error.status = 404;
      throw error;
    }

    const validPassword = await compare(password, user.password);
    if (!validPassword) {
      const error = new Error() as ResponseError;
      error.message = "Invalid combination of email and password";
      error.status = 401;
      throw error;
    }
    const result = handleJwtSign(user);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
