import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SalaryService } from "./salary.service";
import { SalaryController } from "./salary.controller";
import { Payment } from "../payments/entities/payment.entity";
import { MonthlyPlan } from "../monthly-plans/entities/monthly-plan.entity";
import { DailyFact } from "../daily-facts/entities/daily-fact.entity";
import { User } from "../users/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Payment, MonthlyPlan, DailyFact, User])],
  providers: [SalaryService],
  controllers: [SalaryController],
  exports: [SalaryService],
})
export class SalaryModule {}