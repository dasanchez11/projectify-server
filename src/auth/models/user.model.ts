export class User {
  _id: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
}

// Model for creating item in database.

export type UserCreate = Pick<
  User,
  "_id" | "firstname" | "lastname" | "username" | "email" | "password"
>;
