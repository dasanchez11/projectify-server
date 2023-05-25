import { UserModel } from "../schema/user.schema";
import { CreateUserDTO } from "auth/dto/create-user.dto";

export const getUsers = () => {
  return UserModel.find();
};

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
      throw new Error("Email Already Exists");
    }
    const newUser = new UserModel(user);
    await newUser.save();
    return;
  } catch (error) {
    throw new Error(error.message);
  }
};
