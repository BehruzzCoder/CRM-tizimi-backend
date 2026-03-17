import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { ProgressService } from "./progress.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { UserRole } from "../users/entities/user-role.enum";

@ApiTags("Progress")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("progress")
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  
  

  @Get("me/daily")
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @ApiOperation({ summary: "Mening kunlik progressim" })
  @ApiQuery({ name: "date", required: true, example: "2026-03-14" })
  getMyDaily(
    @CurrentUser() user: any,
    @Query("date") date: string
  ) {
    return this.progressService.getDailyProgress(user.userId, date);
  }

  @Get("me/weekly")
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @ApiOperation({ summary: "Mening haftalik progressim" })
  @ApiQuery({ name: "date", required: true, example: "2026-03-14" })
  getMyWeekly(
    @CurrentUser() user: any,
    @Query("date") date: string
  ) {
    return this.progressService.getWeeklyProgress(user.userId, date);
  }

  @Get("me/monthly")
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @ApiOperation({ summary: "Mening oylik progressim" })
  @ApiQuery({ name: "month", required: true, example: 3 })
  @ApiQuery({ name: "year", required: true, example: 2026 })
  getMyMonthly(
    @CurrentUser() user: any,
    @Query("month") month: string,
    @Query("year") year: string
  ) {
    return this.progressService.getMonthlyProgress(
      user.userId,
      +month,
      +year
    );
  }

  

  @Get("user/:id/daily")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Managerning kunlik progressi" })
  @ApiQuery({ name: "date", required: true, example: "2026-03-14" })
  getUserDaily(@Param("id") id: string, @Query("date") date: string) {
    return this.progressService.getDailyProgress(+id, date);
  }

  @Get("user/:id/weekly")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Managerning haftalik progressi" })
  @ApiQuery({ name: "date", required: true, example: "2026-03-14" })
  getUserWeekly(@Param("id") id: string, @Query("date") date: string) {
    return this.progressService.getWeeklyProgress(+id, date);
  }

  @Get("user/:id/monthly")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Managerning oylik progressi" })
  @ApiQuery({ name: "month", required: true, example: 3 })
  @ApiQuery({ name: "year", required: true, example: 2026 })
  getUserMonthly(
    @Param("id") id: string,
    @Query("month") month: string,
    @Query("year") year: string
  ) {
    return this.progressService.getMonthlyProgress(+id, +month, +year);
  }
}