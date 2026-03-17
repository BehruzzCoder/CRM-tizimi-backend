import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { PaymentsService } from "./payments.service";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../users/entities/user-role.enum";

@ApiTags("Payments")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Yangi to‘lov yaratish" })
  create(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.create(dto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Barcha to‘lovlarni olish" })
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get("manager/:id")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Bitta managerning to‘lovlarini olish" })
  @ApiParam({ name: "id", example: 2 })
  findByManager(@Param("id") id: string) {
    return this.paymentsService.findByManager(+id);
  }

  @Get("manager/:id/total-cash")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Bitta managerning jami kassaga tushgan pulini olish" })
  @ApiParam({ name: "id", example: 2 })
  totalCashByManager(@Param("id") id: string) {
    return this.paymentsService.totalCashByManager(+id);
  }

  @Post("bonus/:id")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Payment uchun bonus berildi qilish" })
  @ApiParam({ name: "id", example: 1 })
  giveBonus(@Param("id") id: string) {
    return this.paymentsService.giveBonus(+id);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "To‘lovni o‘chirish" })
  @ApiParam({ name: "id", example: 1 })
  remove(@Param("id") id: string) {
    return this.paymentsService.remove(+id);
  }
}