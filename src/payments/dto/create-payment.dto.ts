import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreatePaymentDto {
  @ApiProperty({ example: "Ali Valiyev" })
  @IsString()
  fullName: string;

  @ApiProperty({ example: "+998901234567" })
  @IsString()
  phone: string;

  @ApiProperty({ example: 2 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  managerId: number;

  @ApiProperty({ example: "Mart 2026" })
  @IsString()
  stream: string;

  @ApiProperty({ example: "Standart" })
  @IsString()
  tariff: string;

  @ApiProperty({ example: 1200000 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ example: 0 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  debt: number;

  @ApiProperty({ example: "FULL" })
  @IsString()
  paymentType: string;

  @ApiProperty({ required: false, example: "receipt.jpg" })
  @IsOptional()
  @IsString()
  receipt?: string;
}