import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { PaymentsModule } from 'src/payments/payments.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [RatingController],
  providers: [RatingService],
  imports: [PaymentsModule, UsersModule],
})
export class RatingModule {}
