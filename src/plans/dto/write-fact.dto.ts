import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, Min } from "class-validator";

export class WriteFactDto {
  @ApiProperty({ example: 700 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  factCalls: number;

  @ApiProperty({ example: 390 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  factTalks: number;

  @ApiProperty({ example: 18 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  factInterestedClients: number;

  @ApiProperty({ example: 17 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  factSalesCount: number;

  @ApiProperty({ example: 400000000 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  factCashSales: number;

  @ApiProperty({ example: 410000000 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  factContractSales: number;

  @ApiProperty({ example: 15000000 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  factDebt: number;

  @ApiProperty({ example: 220000000 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  factTotalCash: number;
}
