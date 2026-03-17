import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { SalaryService } from "./salary.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { UserRole } from "../users/entities/user-role.enum";

@ApiTags("Salary")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("salary")
export class SalaryController {
  constructor(private readonly salaryService: SalaryService) {}

  @Get("me")
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @ApiOperation({ summary: "Mening oylik hisobim" })
  @ApiQuery({ name: "month", required: true, example: 3 })
  @ApiQuery({ name: "year", required: true, example: 2026 })
  getMySalary(
    @CurrentUser() user: any,
    @Query("month") month: string,
    @Query("year") year: string
  ) {
    return this.salaryService.calculateManagerSalary(
      user.userId,
      +month,
      +year
    );
  }

  @Get("user/:id")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Bitta managerning oylik hisoboti" })
  @ApiQuery({ name: "month", required: true, example: 3 })
  @ApiQuery({ name: "year", required: true, example: 2026 })
  getUserSalary(
    @Param("id") id: string,
    @Query("month") month: string,
    @Query("year") year: string
  ) {
    return this.salaryService.calculateManagerSalary(+id, +month, +year);
  }

  @Get("all")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Barcha managerlar oylik hisoboti" })
  @ApiQuery({ name: "month", required: true, example: 3 })
  @ApiQuery({ name: "year", required: true, example: 2026 })
  getAllManagersSalary(
    @Query("month") month: string,
    @Query("year") year: string
  ) {
    return this.salaryService.calculateAllManagersSalary(+month, +year);
  }
}