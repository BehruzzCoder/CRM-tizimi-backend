import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";

import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { SettingsModule } from "./settings/settings.module";
import { LeadsModule } from "./leads/leads.module";
import { PaymentsModule } from "./payments/payments.module";
import { AttendanceModule } from "./attendance/attendance.module";
import { PenaltiesModule } from "./penalties/penalties.module";
import { PlansModule } from "./plans/plans.module";
import { AnalyticsModule } from "./analytics/analytics.module";
import { JwtAuthGuard } from "./auth/guards/jwt-auth.guard";
import { RolesGuard } from "./auth/guards/roles.guard";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: "postgres",
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),

    UsersModule,
    AuthModule,
    SettingsModule,
    LeadsModule,
    PaymentsModule,
    AttendanceModule,
    PenaltiesModule,
    PlansModule,
    AnalyticsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}