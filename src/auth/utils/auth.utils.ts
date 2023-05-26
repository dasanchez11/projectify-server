import { hash } from "bcryptjs";

export const hashPassword = async (password: string): Promise<string> => {
  try {
    const hashPassword = await hash(password, 12);
    return hashPassword;
  } catch (error) {
    throw new Error(error.message);
  }
};
