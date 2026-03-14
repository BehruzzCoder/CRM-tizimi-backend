import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Payment } from "./entities/payment.entity";
import { PaymentsController } from "./payments.controller";
import { PaymentsService } from "./payments.service";
import { User } from "../users/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Payment, User])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}