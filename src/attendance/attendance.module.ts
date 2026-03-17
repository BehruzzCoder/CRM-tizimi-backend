import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Attendance } from "./entities/attendance.entity";
import { AttendanceService } from "./attendance.service";
import { AttendanceController } from "./attendance.controller";
import { User } from "../users/entities/user.entity";
import { Settings } from "../settings/entities/setting.entity";
import { PenaltiesModule } from "../penalties/penalties.module";
import { DailyFactsModule } from "../daily-facts/daily-facts.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Attendance, User, Settings]),
    PenaltiesModule,
    DailyFactsModule,
  ],
  providers: [AttendanceService],
  controllers: [AttendanceController],
  exports: [AttendanceService],
})
export class AttendanceModule {}