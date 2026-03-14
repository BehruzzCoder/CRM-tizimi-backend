import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { PlansService } from "./plans.service";
import { CreatePlanDto } from "./dto/create-plan.dto";
import { UpdatePlanDto } from "./dto/update-plan.dto";
import { WriteFactDto } from "./dto/write-fact.dto";
import { UpdatePlanStatusDto } from "./dto/update-plan-status.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { PlanType } from "./entities/plan.entity";
import { UserRole } from "../users/entities/user-role.enum";

@ApiTags("Plans")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("plans")
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Plan yaratish" })
  create(@Body() dto: CreatePlanDto) {
    return this.plansService.create(dto);
  }

  @Get("me")
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @ApiOperation({ summary: "Meniki planlar" })
  findMine(@CurrentUser() user: any) {
    return this.plansService.findMine(user.userId);
  }

  @Get("me/summary")
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @ApiOperation({ summary: "Meniki plan summary" })
  summaryMine(@CurrentUser() user: any) {
    return this.plansService.summaryMine(user.userId);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Barcha planlarni olish" })
  findAll() {
    return this.plansService.findAll();
  }

  @Get("summary")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Barcha planlar bo‘yicha summary" })
  summary() {
    return this.plansService.summary();
  }

  @Get("summary/by-type")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Plan turi bo‘yicha summary" })
  @ApiQuery({
    name: "type",
    required: true,
    enum: PlanType,
  })
  summaryByType(@Query("type") type: PlanType) {
    return this.plansService.summaryByType(type);
  }

  @Get("summary/user/:id")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "User bo‘yicha summary" })
  summaryByUser(@Param("id") id: string) {
    return this.plansService.summaryByUser(+id);
  }

  @Get("user/:id")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "User bo‘yicha planlarni olish" })
  findByUser(@Param("id") id: string) {
    return this.plansService.findByUser(+id);
  }

  @Get(":id")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Bitta planni olish" })
  findOne(@Param("id") id: string) {
    return this.plansService.findOne(+id);
  }

  @Put(":id")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Planni yangilash" })
  update(@Param("id") id: string, @Body() dto: UpdatePlanDto) {
    return this.plansService.update(+id, dto);
  }

  @Post(":id/fact")
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @ApiOperation({ summary: "Plan uchun fact yozish" })
  writeFact(@Param("id") id: string, @Body() dto: WriteFactDto) {
    return this.plansService.writeFact(+id, dto);
  }

  @Put(":id/statuses")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Mukofot va so‘z narxi statuslarini yangilash" })
  updateStatuses(@Param("id") id: string, @Body() dto: UpdatePlanStatusDto) {
    return this.plansService.updateStatuses(+id, dto);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Planni o‘chirish" })
  remove(@Param("id") id: string) {
    return this.plansService.remove(+id);
  }
  @Post("me")
@Roles(UserRole.MANAGER, UserRole.ADMIN)
@ApiOperation({ summary: "O‘zim uchun plan yaratish" })
createMine(@CurrentUser() user: any, @Body() dto: CreatePlanDto) {
  return this.plansService.createForCurrentUser(user.userId, dto);
}
}