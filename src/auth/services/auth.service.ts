import { signInDTO } from "../dto/sign-in.dto";
import { UserModel } from "../schema/user.schema";
import { CreateUserDTO } from "auth/dto/create-user.dto";
import { hashPassword } from "../utils/auth.utils";
import * as bcrypt from "bcryptjs";
import { handleJwtSign } from "../utils/jwt.utils";
import { CustomError } from "../../shared/custom-error";

export const getUserByEmail = (email: string) => {
  return UserModel.findOne({ email });
};

export const getUserById = (id: string) => {
  return UserModel.findById(id);
};

export const registerUser = async (user: CreateUserDTO) => {
  try {
    const existingEmail = await getUserByEmail(user.email);
    if (existingEmail) {
      throw new CustomError("Email Already Exists", 403);
    }
    const hashedPassword = await hashPassword(user.password);
    const hashedUser = { ...user, password: hashedPassword };

    const newUser = new UserModel(hashedUser);
    await newUser.save();
    return;
  } catch (error) {
    throw error;
  }
};

export const signInUser = async (creadentials: signInDTO) => {
  const { email, password } = creadentials;
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new CustomError("Invalid combination of email and password", 401);
    }
    const result = handleJwtSign(user);
    return result;
  } catch (error) {
    throw error;
  }
};
