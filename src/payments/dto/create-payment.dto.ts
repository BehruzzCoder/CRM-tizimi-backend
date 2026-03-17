import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";
import { Type } from "class-transformer";

export class CreatePaymentDto {
  @ApiProperty({ example: 2 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  managerId: number;

  @ApiProperty({ example: "Ali Valiyev" })
  @IsString()
  clientName: string;

  @ApiProperty({ example: "+998901234567" })
  @IsString()
  phone: string;

  @ApiProperty({ example: "VIP" })
  @IsString()
  tariff: string;

  @ApiProperty({ example: "Click" })
  @IsString()
  paymentType: string;

  @ApiProperty({ example: 12000000 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ example: 22000000 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  contractAmount: number;

  @ApiProperty({ example: 10000000 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  debt: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  bonusGiven?: boolean;

  @ApiPropertyOptional({ type: [String], example: [] })
  @IsOptional()
  @IsArray()
  receipts?: string[];
}