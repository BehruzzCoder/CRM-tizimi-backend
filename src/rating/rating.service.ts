import { Injectable } from "@nestjs/common";
import { PaymentsService } from "../payments/payments.service";
import { UsersService } from "../users/users.service";
import { User } from "../users/entities/user.entity";

export interface RatingItem {
  rank: number;
  manager: User;
  totalCash: number;
}

@Injectable()
export class RatingService {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly usersService: UsersService
  ) {}

  async getRating(): Promise<RatingItem[]> {
    const managers = await this.usersService.findManagers();

    const rating: RatingItem[] = [];

    for (const manager of managers) {
      const totalCash = await this.paymentsService.totalCashByManager(
        manager.id
      );

      rating.push({
        rank: 0,
        manager,
        totalCash: Number(totalCash),
      });
    }

    rating.sort((a, b) => b.totalCash - a.totalCash);

    return rating.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
  }
}