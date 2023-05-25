import { User } from "auth/models/user.model";
import { Schema, model, Model } from "mongoose";

// User Config
const UserSchema = new Schema<User>({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

export const UserModel: Model<User> = model("user", UserSchema);
