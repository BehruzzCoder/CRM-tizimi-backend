import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { AnalyticsService } from "./analytics.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../users/entities/user-role.enum";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";

@ApiTags("Analytics")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("analytics")
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

@Get("me")
@Roles(UserRole.MANAGER, UserRole.ADMIN)
@ApiOperation({ summary: "Mening analyticsim" })
@ApiQuery({ name: "month", required: false, example: 3 })
@ApiQuery({ name: "year", required: false, example: 2026 })
getMyAnalytics(
  @CurrentUser() user: any,
  @Query("month") month?: string,
  @Query("year") year?: string
) {
  return this.analyticsService.getManagerAnalytics(
    user.userId,
    month ? +month : undefined,
    year ? +year : undefined
  );
}

  @Get("dashboard")
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: "Admin dashboard statistikasi" })
  @ApiQuery({ name: "month", required: false, example: 3 })
  @ApiQuery({ name: "year", required: false, example: 2026 })
  getDashboard(
    @Query("month") month?: string,
    @Query("year") year?: string
  ) {
    return this.analyticsService.getDashboard(
      month ? +month : undefined,
      year ? +year : undefined
    );
  }

  @Get("manager/:id")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Bitta manager analytics" })
  @ApiQuery({ name: "month", required: false, example: 3 })
  @ApiQuery({ name: "year", required: false, example: 2026 })
  getManagerAnalytics(
    @Param("id") id: string,
    @Query("month") month?: string,
    @Query("year") year?: string
  ) {
    return this.analyticsService.getManagerAnalytics(
      +id,
      month ? +month : undefined,
      year ? +year : undefined
    );
  }
  @Get("lead-dashboard")
 @UseGuards(JwtAuthGuard)
  getDashboardd(
  @Query("month") month?: number,
  @Query("year") year?: number
) {
  return this.analyticsService.getDashboard(month, year);
}
}