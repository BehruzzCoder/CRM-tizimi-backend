import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Penalty } from "./entities/penalty.entity";
import { PenaltiesController } from "./penalties.controller";
import { PenaltiesService } from "./penalties.service";
import { User } from "src/users/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Penalty, User])],
  controllers: [PenaltiesController],
  providers: [PenaltiesService],
  exports: [PenaltiesService],
})
export class PenaltiesModule {}
