import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";
import { UserRole } from "../entities/user-role.enum";

export class CreateUserDto {
  @ApiProperty({ example: "Islombek Nurmatov" })
  @IsString()
  fullName: string;

  @ApiProperty({ example: "+998901234567" })
  @IsString()
  phone: string;

  @ApiProperty({ example: "islombek_manager" })
  @IsString()
  login: string;

  @ApiProperty({ example: "12345" })
  @IsString()
  password: string;

  @ApiProperty({ enum: UserRole, example: UserRole.MANAGER })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ required: false, example: "user.jpg" })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ required: false, example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ required: false, example: "10:00:00" })
  @IsOptional()
  @IsString()
  customStartTime?: string;
}