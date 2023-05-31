import { Expose, Transform } from "class-transformer";
import { IsNumber, IsString, Matches, Max, Min } from "class-validator";

export class CreateReportDTO {
  @Expose()
  @IsString()
  projectId: string;

  @Expose()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Max(45)
  @Min(1)
  hours: number;

  @Matches(/^20\d{2}-W(0[1-9]|[1-4][0-9]|5[0-3])$/, {
    message: 'A Valid week name in ISO 8601 E.g: "2023-W21" is required',
  })
  @Expose()
  @IsString()
  week: string;
}
