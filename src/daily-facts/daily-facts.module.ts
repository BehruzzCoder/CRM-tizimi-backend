import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DailyFact } from "./entities/daily-fact.entity";
import { DailyFactsService } from "./daily-facts.service";
import { DailyFactsController } from "./daily-facts.controller";
import { User } from "../users/entities/user.entity";
import { MonthlyPlan } from "../monthly-plans/entities/monthly-plan.entity";

@Module({
  imports: [TypeOrmModule.forFeature([DailyFact, User, MonthlyPlan])],
  providers: [DailyFactsService],
  controllers: [DailyFactsController],
  exports: [DailyFactsService],
})
export class DailyFactsModule {}