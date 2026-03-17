import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { MonthlyPlansService } from "./monthly-plans.service";
import { CreateMonthlyPlanDto } from "./dto/create-monthly-plan.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { UserRole } from "../users/entities/user-role.enum";

@ApiTags("Monthly Plans")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("monthly-plans")
export class MonthlyPlansController {
  constructor(private readonly monthlyPlansService: MonthlyPlansService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Admin manager uchun oylik plan yaratadi" })
  create(@Body() dto: CreateMonthlyPlanDto) {
    return this.monthlyPlansService.create(dto);
  }

  @Post("me")
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: "Manager o‘zi uchun oylik plan yaratadi" })
  createMine(@CurrentUser() user: any, @Body() dto: CreateMonthlyPlanDto) {
    return this.monthlyPlansService.createForCurrentUser(user.userId, dto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Barcha oylik planlar" })
  findAll() {
    return this.monthlyPlansService.findAll();
  }

  @Get("me")
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @ApiOperation({ summary: "Mening oylik planlarim" })
  findMine(@CurrentUser() user: any) {
    return this.monthlyPlansService.findMine(user.userId);
  }

  @Get("me/current")
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @ApiOperation({ summary: "Mening joriy oylik planim" })
  findCurrentMine(@CurrentUser() user: any) {
    return this.monthlyPlansService.findCurrentMine(user.userId);
  }

  @Get("user/:id")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Bitta managerning oylik planlari" })
  findByUser(@Param("id") id: string) {
    return this.monthlyPlansService.findByUser(+id);
  }

  @Get(":id")
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: "Bitta oylik plan" })
  findOne(@Param("id") id: string) {
    return this.monthlyPlansService.findOne(+id);
  }
}