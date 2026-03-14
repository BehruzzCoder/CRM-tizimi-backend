import { Controller, Get, Query, UseGuards } from "@nestjs/common";
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

@ApiTags("Analytics")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("analytics")
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get("dashboard")
  @ApiOperation({ summary: "Umumiy dashboard statistikasi" })
  getDashboard() {
    return this.analyticsService.dashboard();
  }

  @Get("range")
  @ApiOperation({ summary: "Sana oralig‘i bo‘yicha analytics" })
  @ApiQuery({ name: "from", required: true, example: "2026-03-01" })
  @ApiQuery({ name: "to", required: true, example: "2026-03-05" })
  getRange(@Query("from") from: string, @Query("to") to: string) {
    return this.analyticsService.byDateRange(from, to);
  }

  @Get("today")
  @ApiOperation({ summary: "Bugungi statistika" })
  getToday() {
    return this.analyticsService.today();
  }

  @Get("weekly")
  @ApiOperation({ summary: "Haftalik statistika" })
  getWeekly() {
    return this.analyticsService.weekly();
  }

  @Get("monthly")
  @ApiOperation({ summary: "Oylik statistika" })
  getMonthly() {
    return this.analyticsService.monthly();
  }

  @Get("payments-summary")
  @ApiOperation({ summary: "To‘lovlar bo‘yicha umumiy statistika" })
  getPaymentSummary() {
    return this.analyticsService.paymentSummary();
  }

  @Get("payments-by-manager")
  @ApiOperation({ summary: "Manager bo‘yicha to‘lov statistikasi" })
  getPaymentSummaryByManager() {
    return this.analyticsService.paymentSummaryByManager();
  }
}