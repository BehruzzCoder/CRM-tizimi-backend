import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";
import { PlanType } from "../entities/plan.entity";

export class CreatePlanDto {
  @IsOptional()
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  userId: number;

  @ApiProperty({ enum: PlanType, example: PlanType.MONTHLY })
  @IsEnum(PlanType)
  type: PlanType;

  @ApiProperty({ example: "2026-03-05" })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: "2026-03-31", required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;

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
  planInterestedClients: number;

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

  @ApiProperty({ example: "17 Pro Max", required: false })
  @IsOptional()
  @IsString()
  rewardName?: string;

  @ApiProperty({ example: "2 etajni uborka qilish", required: false })
  @IsOptional()
  @IsString()
  penaltyTask?: string;
}
