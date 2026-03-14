import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { PenaltiesService } from "./penalties.service";
import { CreatePenaltyDto } from "./dto/create-penalty.dto";
import { UpdatePenaltyDto } from "./dto/update-penalty.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { UserRole } from "../users/entities/user-role.enum";

@ApiTags("Penalties")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("penalties")
export class PenaltiesController {
  constructor(private readonly penaltiesService: PenaltiesService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "So‘z narxi qo‘shish" })
  create(@Body() dto: CreatePenaltyDto) {
    return this.penaltiesService.create(dto);
  }

  @Get("me")
  @Roles(UserRole.MANAGER, UserRole.ADMIN)
  @ApiOperation({ summary: "Meniki so‘z narxilar" })
  findMine(@CurrentUser() user: any) {
    return this.penaltiesService.findMine(user.userId);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Barcha so‘z narxilarni olish" })
  findAll() {
    return this.penaltiesService.findAll();
  }

  @Get(":id")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Bitta so‘z narxini olish" })
  findOne(@Param("id") id: string) {
    return this.penaltiesService.findOne(+id);
  }

  @Put(":id")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "So‘z narxini yangilash" })
  update(@Param("id") id: string, @Body() dto: UpdatePenaltyDto) {
    return this.penaltiesService.update(+id, dto);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "So‘z narxini o‘chirish" })
  remove(@Param("id") id: string) {
    return this.penaltiesService.remove(+id);
  }
}