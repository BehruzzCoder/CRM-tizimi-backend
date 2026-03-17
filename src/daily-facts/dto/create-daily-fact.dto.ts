import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDateString, IsInt, IsNumber, Min } from "class-validator";

export class CreateDailyFactDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  monthlyPlanId: number;

  @ApiProperty({ example: "2026-03-14" })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 25 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  factCalls: number;

  @ApiProperty({ example: 14 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  factTalks: number;

  @ApiProperty({ example: 2 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  factSalesCount: number;

  @ApiProperty({ example: 10000000 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  factCashSales: number;

  @ApiProperty({ example: 12000000 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  factContractSales: number;

  @ApiProperty({ example: 1000000 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  factDebt: number;

  @ApiProperty({ example: 9000000 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  factTotalCash: number;
}