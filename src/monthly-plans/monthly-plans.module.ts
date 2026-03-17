import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MonthlyPlan } from "./entities/monthly-plan.entity";
import { MonthlyPlansService } from "./monthly-plans.service";
import { MonthlyPlansController } from "./monthly-plans.controller";
import { User } from "../users/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([MonthlyPlan, User])],
  providers: [MonthlyPlansService],
  controllers: [MonthlyPlansController],
  exports: [MonthlyPlansService],
})
export class MonthlyPlansModule {}