import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LoginDto {
  @ApiProperty({ example: "admin" })
  @IsString()
  login: string;

  @ApiProperty({ example: "12345" })
  @IsString()
  password: string;
}