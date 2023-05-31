import { Expose } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDTO {
  @Expose()
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  lastname: string;

  @Expose()
  @IsEmail()
  @IsString()
  email: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
