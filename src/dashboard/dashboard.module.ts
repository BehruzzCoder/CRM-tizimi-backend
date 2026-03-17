import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { PaymentsModule } from 'src/payments/payments.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService],
  imports: [PaymentsModule, UsersModule],
})
export class DashboardModule {}
