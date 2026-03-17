import { Controller, Get, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { RatingService } from "./rating.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../users/entities/user-role.enum";

@ApiTags("Rating")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("rating")
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Managerlar reytingi (kassaga tushgan pul bo‘yicha)" })
  getRating() {
    return this.ratingService.getRating();
  }
}