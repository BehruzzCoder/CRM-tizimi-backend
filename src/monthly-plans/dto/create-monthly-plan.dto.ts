import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";

export class CreateMonthlyPlanDto {
  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  userId?: number;

  @ApiProperty({ example: 3 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @ApiProperty({ example: 2026 })
  @Type(() => Number)
  @IsInt()
  @Min(2024)
  year: number;

  @ApiProperty({ example: 750 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  planCalls: number;

  @ApiProperty({ example: 440 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  planTalks: number;

  @ApiProperty({ example: 20 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  planSalesCount: number;

  @ApiProperty({ example: 430000000 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  planCashSales: number;

  @ApiProperty({ example: 430000000 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  planContractSales: number;

  @ApiProperty({ example: 20000000 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  planDebt: number;

  @ApiProperty({ example: 235000000 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  planTotalCash: number;

  @ApiPropertyOptional({ example: "17 Pro Max" })
  @IsOptional()
  @IsString()
  rewardName?: string;

  @ApiPropertyOptional({ example: "2 etajni tozalash" })
  @IsOptional()
  @IsString()
  penaltyTask?: string;
}