import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProgressService } from "./progress.service";
import { ProgressController } from "./progress.controller";
import { MonthlyPlan } from "../monthly-plans/entities/monthly-plan.entity";
import { DailyFact } from "../daily-facts/entities/daily-fact.entity";
import { User } from "../users/entities/user.entity";
import { Lead } from "src/leads/entities/lead.entity";

@Module({
  imports: [TypeOrmModule.forFeature([MonthlyPlan, DailyFact, User, Lead])],
  providers: [ProgressService],
  controllers: [ProgressController],
  exports: [ProgressService],
})
export class ProgressModule {}