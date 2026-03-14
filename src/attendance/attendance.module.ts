import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Attendance } from "./entities/attendance.entity";
import { AttendanceController } from "./attendance.controller";
import { AttendanceService } from "./attendance.service";
import { PenaltiesModule } from "../penalties/penalties.module";
import { Settings } from "src/settings/entities/setting.entity";
import { User } from "src/users/entities/user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Attendance, User, Settings]),
    PenaltiesModule,
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService],
  exports: [AttendanceService],
})
export class AttendanceModule {}
