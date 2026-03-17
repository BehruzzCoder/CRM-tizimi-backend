import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { DailyFactsService } from "./daily-facts.service";
import { CreateDailyFactDto } from "./dto/create-daily-fact.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { UserRole } from "../users/entities/user-role.enum";

@ApiTags("Daily Facts")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("daily-facts")
export class DailyFactsController {
  constructor(private readonly dailyFactsService: DailyFactsService) {}

  @Post("me")
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: "Manager o‘zi uchun kunlik fact yozadi" })
  createMine(@CurrentUser() user: any, @Body() dto: CreateDailyFactDto) {
    return this.dailyFactsService.createForCurrentUser(user.userId, dto);
  }

  @Get("me")
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @ApiOperation({ summary: "Mening barcha factlarim" })
  findMine(@CurrentUser() user: any) {
    return this.dailyFactsService.findMine(user.userId);
  }

  @Get("me/today")
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @ApiOperation({ summary: "Mening bugungi factim" })
  findTodayMine(@CurrentUser() user: any) {
    return this.dailyFactsService.findTodayMine(user.userId);
  }

  @Get("user/:id")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Bitta managerning factlari" })
  findByUser(@Param("id") id: string) {
    return this.dailyFactsService.findByUser(+id);
  }

  @Get("monthly-plan/:id")
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: "Bitta oylik plan factlari" })
  findByMonthlyPlan(@Param("id") id: string) {
    return this.dailyFactsService.findByMonthlyPlan(+id);
  }

  @Get("range")
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: "Sana oralig‘i bo‘yicha factlar" })
  @ApiQuery({ name: "userId", required: true, example: 2 })
  @ApiQuery({ name: "startDate", required: true, example: "2026-03-01" })
  @ApiQuery({ name: "endDate", required: true, example: "2026-03-07" })
  findByDateRange(
    @Query("userId") userId: string,
    @Query("startDate") startDate: string,
    @Query("endDate") endDate: string
  ) {
    return this.dailyFactsService.findByDateRange(+userId, startDate, endDate);
  }
}