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
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { UserRole } from "./entities/user-role.enum";

@ApiTags("Users")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Yangi user yaratish (faqat admin)" })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get("me")
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: "O‘z profilingni olish" })
  me(@CurrentUser() user: any) {
    return this.usersService.me(user.userId);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Barcha userlarni olish (faqat admin)" })
  findAll() {
    return this.usersService.findAll();
  }

  @Get("managers/:id")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Bitta userni olish (faqat admin)" })
  findOne(@Param("id") id: string) {
    return this.usersService.findById(+id);
  }

  @Put(":id")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Userni yangilash (faqat admin)" })
  update(@Param("id") id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(+id, dto);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Userni o‘chirish (faqat admin)" })
  remove(@Param("id") id: string) {
    return this.usersService.remove(+id);
  }
  @Get("managers")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Barcha managerlarni olish (faqat admin)" })
  findManagers() {
    return this.usersService.findManagers();
  }
}