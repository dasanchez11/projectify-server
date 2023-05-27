import { Expose } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateProjectDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  description: string;
}
