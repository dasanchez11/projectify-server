import { Expose, Transform } from "class-transformer";
import { IsNumber, IsString, Max, Min } from "class-validator";

export class UpdateReportDTO {
  @Expose()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Max(45)
  @Min(1)
  hours: number;
}
