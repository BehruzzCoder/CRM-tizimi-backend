import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";

import { AttendanceService } from "./attendance.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { multerConfig } from "../upload/multer.config";
import { CheckInDto } from "./dto/check-in.dto";
import { CheckOutDto } from "./dto/check-out.dto";
import { UserRole } from "../users/entities/user-role.enum";

@ApiTags("Attendance")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("attendance")
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post("check-in")
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @ApiOperation({ summary: "Keldi qilish" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        userId: { type: "number", example: 2 },
        image: { type: "string", format: "binary" },
      },
      required: ["userId", "image"],
    },
  })
  @UseInterceptors(FileInterceptor("image", multerConfig))
  checkIn(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CheckInDto
  ) {
    return this.attendanceService.checkIn(dto, file?.filename);
  }

  @Post("check-out")
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @ApiOperation({ summary: "Ketdi qilish" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        userId: { type: "number", example: 2 },
        image: { type: "string", format: "binary" },
      },
      required: ["userId", "image"],
    },
  })
  @UseInterceptors(FileInterceptor("image", multerConfig))
  checkOut(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CheckOutDto
  ) {
    return this.attendanceService.checkOut(dto, file?.filename);
  }

  @Get("me")
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @ApiOperation({ summary: "Meniki attendance" })
  findMine(@CurrentUser() user: any) {
    return this.attendanceService.findMine(user.userId);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Barcha attendance yozuvlari" })
  findAll() {
    return this.attendanceService.findAll();
  }

  @Get("by-date")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Sana bo‘yicha attendance olish" })
  @ApiQuery({ name: "date", required: true, example: "2026-03-14" })
  findByDate(@Query("date") date: string) {
    return this.attendanceService.findByDate(date);
  }

  @Get("user/:id")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "User bo‘yicha attendance olish" })
  findByUser(@Param("id") id: string) {
    return this.attendanceService.findByUser(+id);
  }
}