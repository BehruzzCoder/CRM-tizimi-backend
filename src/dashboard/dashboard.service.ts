import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { PaymentsService } from "../payments/payments.service";

@Injectable()
export class DashboardService {
  constructor(
    private usersService: UsersService,
    private paymentsService: PaymentsService
  ) {}

  async getStats() {
    const managers = await this.usersService.findManagers();
    const payments = await this.paymentsService.findAll();

    const totalCash = payments.reduce(
      (sum, p) => sum + Number(p.amount),
      0
    );

    return {
      managers: managers.length,
      payments: payments.length,
      totalCash,
    };
  }
}