import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MonthlyPlan } from "./entities/monthly-plan.entity";
import { CreateMonthlyPlanDto } from "./dto/create-monthly-plan.dto";
import { User } from "../users/entities/user.entity";
import { UserRole } from "../users/entities/user-role.enum";

@Injectable()
export class MonthlyPlansService {
  constructor(
    @InjectRepository(MonthlyPlan)
    private readonly monthlyPlanRepo: Repository<MonthlyPlan>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>
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

  async create(dto: CreateMonthlyPlanDto) {
    if (!dto.userId) {
      throw new ConflictException("userId yuborilishi kerak");
    }

    const user = await this.findManagerUser(dto.userId);

    const existing = await this.monthlyPlanRepo.findOne({
      where: {
        user: { id: dto.userId },
        month: dto.month,
        year: dto.year,
      },
    });

    if (existing) {
      throw new ConflictException("Bu oy uchun plan allaqachon mavjud");
    }

    const monthlyPlan = this.monthlyPlanRepo.create({
      user,
      month: dto.month,
      year: dto.year,
      planCalls: dto.planCalls,
      planTalks: dto.planTalks,
      planSalesCount: dto.planSalesCount,
      planCashSales: dto.planCashSales,
      planContractSales: dto.planContractSales,
      planDebt: dto.planDebt,
      planTotalCash: dto.planTotalCash,
      rewardName: dto.rewardName || null,
      penaltyTask: dto.penaltyTask || null,
    });

    return await this.monthlyPlanRepo.save(monthlyPlan);
  }

  async createForCurrentUser(userId: number, dto: CreateMonthlyPlanDto) {
    const user = await this.findManagerUser(userId);

    const existing = await this.monthlyPlanRepo.findOne({
      where: {
        user: { id: userId },
        month: dto.month,
        year: dto.year,
      },
    });

    if (existing) {
      throw new ConflictException("Bu oy uchun plan allaqachon mavjud");
    }

    const monthlyPlan = this.monthlyPlanRepo.create({
      user,
      month: dto.month,
      year: dto.year,
      planCalls: dto.planCalls,
      planTalks: dto.planTalks,
      planSalesCount: dto.planSalesCount,
      planCashSales: dto.planCashSales,
      planContractSales: dto.planContractSales,
      planDebt: dto.planDebt,
      planTotalCash: dto.planTotalCash,
      rewardName: dto.rewardName || null,
      penaltyTask: dto.penaltyTask || null,
    });

    return await this.monthlyPlanRepo.save(monthlyPlan);
  }

  async findAll() {
    return await this.monthlyPlanRepo.find({
      order: {
        year: "DESC",
        month: "DESC",
        createdAt: "DESC",
      },
    });
  }

  async findOne(id: number) {
    const monthlyPlan = await this.monthlyPlanRepo.findOne({
      where: { id },
    });

    if (!monthlyPlan) {
      throw new NotFoundException("Oylik plan topilmadi");
    }

    return monthlyPlan;
  }

  async findMine(userId: number) {
    return await this.monthlyPlanRepo.find({
      where: {
        user: { id: userId },
      },
      order: {
        year: "DESC",
        month: "DESC",
        createdAt: "DESC",
      },
    });
  }

  async findCurrentMine(userId: number) {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const monthlyPlan = await this.monthlyPlanRepo.findOne({
      where: {
        user: { id: userId },
        month,
        year,
      },
    });

    if (!monthlyPlan) {
      throw new NotFoundException("Joriy oy uchun plan topilmadi");
    }

    return monthlyPlan;
  }
    async findByUser(userId: number) {
    return await this.monthlyPlanRepo.find({
      where: {
        user: { id: userId },
      },
      order: {
        year: "DESC",
        month: "DESC",
        createdAt: "DESC",
      },
    });
  }
}