import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AnalyticsService } from "./analytics.service";
import { AnalyticsController } from "./analytics.controller";
import { User } from "../users/entities/user.entity";
import { Payment } from "../payments/entities/payment.entity";
import { Attendance } from "../attendance/entities/attendance.entity";
import { MonthlyPlan } from "../monthly-plans/entities/monthly-plan.entity";
import { DailyFact } from "../daily-facts/entities/daily-fact.entity";
import { Penalty } from "../penalties/entities/penalty.entity";
import { Lead } from "src/leads/entities/lead.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Payment,
      Attendance,
      MonthlyPlan,
      DailyFact,
      Penalty,
      Lead,
    ]),
  ],
  providers: [AnalyticsService],
  controllers: [AnalyticsController],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}