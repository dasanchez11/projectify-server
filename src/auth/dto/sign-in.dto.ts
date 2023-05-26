import { Expose } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class signInDTO {
  @Expose()
  @IsNotEmpty()
  @IsString()
  email: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  password: string;
}
