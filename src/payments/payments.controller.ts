import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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
  ApiParam,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";

import { PaymentsService } from "./payments.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { multerConfig } from "../upload/multer.config";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { UpdatePaymentDto } from "./dto/update-payment.dto";
import { UserRole } from "../users/entities/user-role.enum";

@ApiTags("Payments")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @ApiOperation({ summary: "Yangi to‘lov qo‘shish" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        fullName: { type: "string", example: "Ali Valiyev" },
        phone: { type: "string", example: "+998901234567" },
        manager: { type: "string", example: "Behruz" },
        stream: { type: "string", example: "Mart 2026" },
        tariff: { type: "string", example: "Standart" },
        amount: { type: "number", example: 1200000 },
        debt: { type: "number", example: 0 },
        paymentType: { type: "string", example: "FULL" },
        receipt: { type: "string", format: "binary" },
      },
      required: [
        "fullName",
        "phone",
        "manager",
        "stream",
        "tariff",
        "amount",
        "debt",
        "paymentType",
      ],
    },
  })
  @UseInterceptors(FileInterceptor("receipt", multerConfig))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreatePaymentDto
  ) {
    return this.paymentsService.create(dto, file?.filename);
  }

  @Get()
  @ApiOperation({ summary: "Barcha to‘lovlarni olish" })
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get("search")
  @ApiOperation({ summary: "Ism yoki telefon bo‘yicha qidirish" })
  @ApiQuery({ name: "q", required: true, example: "Ali" })
  search(@Query("q") q: string) {
    return this.paymentsService.search(q);
  }

  @Get(":id")
  @ApiOperation({ summary: "ID bo‘yicha to‘lovni olish" })
  findOne(@Param("id") id: string) {
    return this.paymentsService.findOne(+id);
  }

  @Put(":id")
  @ApiOperation({ summary: "To‘lovni yangilash" })
  @ApiParam({ name: "id", required: true, example: 1 })
  update(@Param("id") id: string, @Body() dto: UpdatePaymentDto) {
    return this.paymentsService.update(+id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "To‘lovni o‘chirish" })
  @ApiParam({ name: "id", required: true, example: 1 })
  remove(@Param("id") id: string) {
    return this.paymentsService.delete(+id);
  }
}