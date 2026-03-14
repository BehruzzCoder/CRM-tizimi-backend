import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDateString, IsInt, Min } from "class-validator";

export class CreateLeadDto {
  @ApiProperty({ example: "2026-03-11" })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 25 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  yangiLid: number;

  @ApiProperty({ example: 18 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  ishgaOlindi: number;

  @ApiProperty({ example: 11 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  aloqaOrnatildi: number;

  @ApiProperty({ example: 7 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  konsultatsiyaBerildi: number;

  @ApiProperty({ example: 4 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  qiziqishBildirdi: number;

  @ApiProperty({ example: 3 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  hisobRaqamYuborildi: number;

  @ApiProperty({ example: 2 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  preDaplata: number;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  toliqTolov: number;

  @ApiProperty({ example: 14 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  kotargan: number;

  @ApiProperty({ example: 11 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  kotarmagan: number;
}
