import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Repository } from "typeorm";
import { DailyFact } from "./entities/daily-fact.entity";
import { CreateDailyFactDto } from "./dto/create-daily-fact.dto";
import { User } from "../users/entities/user.entity";
import { UserRole } from "../users/entities/user-role.enum";
import { MonthlyPlan } from "../monthly-plans/entities/monthly-plan.entity";

@Injectable()
export class DailyFactsService {
  constructor(
    @InjectRepository(DailyFact)
    private readonly dailyFactRepo: Repository<DailyFact>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(MonthlyPlan)
    private readonly monthlyPlanRepo: Repository<MonthlyPlan>
  ) {}

  private async findManagerUser(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId, role: UserRole.MANAGER },
    });

    if (!user) {
      throw new NotFoundException("Manager topilmadi");
    }

    return user;
  }

  private async findMonthlyPlan(monthlyPlanId: number) {
    const monthlyPlan = await this.monthlyPlanRepo.findOne({
      where: { id: monthlyPlanId },
    });

    if (!monthlyPlan) {
      throw new NotFoundException("Oylik plan topilmadi");
    }

    return monthlyPlan;
  }

  async createForCurrentUser(userId: number, dto: CreateDailyFactDto) {
    const user = await this.findManagerUser(userId);
    const monthlyPlan = await this.findMonthlyPlan(dto.monthlyPlanId);

    if (monthlyPlan.user.id !== userId) {
      throw new ConflictException("Bu oylik plan sizga tegishli emas");
    }

    const existing = await this.dailyFactRepo.findOne({
      where: {
        user: { id: userId },
        date: dto.date,
      },
    });

    if (existing) {
      throw new ConflictException("Bu sana uchun fact allaqachon yozilgan");
    }

    const factDate = new Date(dto.date);
    const factMonth = factDate.getMonth() + 1;
    const factYear = factDate.getFullYear();

    if (factMonth !== monthlyPlan.month || factYear !== monthlyPlan.year) {
      throw new ConflictException("Fact sanasi oylik plan oyiga mos emas");
    }

    const dailyFact = this.dailyFactRepo.create({
      user,
      monthlyPlan,
      date: dto.date,
      factCalls: dto.factCalls,
      factTalks: dto.factTalks,
      factSalesCount: dto.factSalesCount,
      factCashSales: dto.factCashSales,
      factContractSales: dto.factContractSales,
      factDebt: dto.factDebt,
      factTotalCash: dto.factTotalCash,
    });

    return await this.dailyFactRepo.save(dailyFact);
  }

  async hasFactForDate(userId: number, date: string) {
  const fact = await this.dailyFactRepo.findOne({
    where: {
      user: { id: userId },
      date,
    },
  });

  return !!fact;
}
  async findMine(userId: number) {
    return await this.dailyFactRepo.find({
      where: {
        user: { id: userId },
      },
      order: {
        date: "DESC",
        createdAt: "DESC",
      },
    });
  }

  async findTodayMine(userId: number) {
    const today = new Date().toISOString().slice(0, 10);

    const dailyFact = await this.dailyFactRepo.findOne({
      where: {
        user: { id: userId },
        date: today,
      },
    });

    return dailyFact;
  }

  async findByUser(userId: number) {
    return await this.dailyFactRepo.find({
      where: {
        user: { id: userId },
      },
      order: {
        date: "DESC",
        createdAt: "DESC",
      },
    });
  }

  async findByMonthlyPlan(monthlyPlanId: number) {
    return await this.dailyFactRepo.find({
      where: {
        monthlyPlan: { id: monthlyPlanId },
      },
      order: {
        date: "ASC",
      },
    });
  }

  async findByDateRange(userId: number, startDate: string, endDate: string) {
    return await this.dailyFactRepo.find({
      where: {
        user: { id: userId },
        date: Between(startDate, endDate),
      },
      order: {
        date: "ASC",
      },
    });
  }
}