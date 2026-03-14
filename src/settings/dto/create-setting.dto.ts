import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, Min } from "class-validator";

export class UpdateSettingsDto {
  @ApiProperty({ example: "10:00:00", required: false })
  @IsOptional()
  @IsString()
  workStartTime?: string;

  @ApiProperty({ example: 100000, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  defaultPenaltyAmount?: number;

  @ApiProperty({ example: 50000, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  repeatedPenaltyIncrease?: number;
}
