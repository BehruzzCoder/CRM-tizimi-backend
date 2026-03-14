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
import { LeadsService } from "./leads.service";
import { CreateLeadDto } from "./dto/create-lead.dto";
import { UpdateLeadDto } from "./dto/update-lead.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../users/entities/user-role.enum";

@ApiTags("Lead Statistics")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("leads")
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @ApiOperation({ summary: "Kunlik lead statistikani qo‘shish" })
  create(@Body() dto: CreateLeadDto) {
    return this.leadsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: "Barcha lead statistikalarni olish" })
  findAll() {
    return this.leadsService.findAll();
  }

  @Get("summary")
  @ApiOperation({ summary: "Umumiy lead summary" })
  summary() {
    return this.leadsService.summary();
  }

  @Get("by-date")
  @ApiOperation({ summary: "Bitta sana bo‘yicha statistika" })
  @ApiQuery({
    name: "date",
    required: true,
    example: "2026-03-11",
  })
  findByDate(@Query("date") date: string) {
    return this.leadsService.findByDate(date);
  }

  @Get("range")
  @ApiOperation({ summary: "Sana oralig‘i bo‘yicha statistika" })
  @ApiQuery({ name: "from", required: true, example: "2026-03-01" })
  @ApiQuery({ name: "to", required: true, example: "2026-03-05" })
  findRange(@Query("from") from: string, @Query("to") to: string) {
    return this.leadsService.findRange(from, to);
  }

  @Get(":id")
  @ApiOperation({ summary: "ID bo‘yicha statistikani olish" })
  findOne(@Param("id") id: string) {
    return this.leadsService.findOne(+id);
  }

  @Put(":id")
  @ApiOperation({ summary: "Lead statistikani yangilash" })
  update(@Param("id") id: string, @Body() dto: UpdateLeadDto) {
    return this.leadsService.update(+id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Lead statistikani o‘chirish" })
  remove(@Param("id") id: string) {
    return this.leadsService.remove(+id);
  }
}