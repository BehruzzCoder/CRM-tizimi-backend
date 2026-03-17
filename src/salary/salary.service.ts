import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Repository } from "typeorm";
import { Payment } from "../payments/entities/payment.entity";
import { MonthlyPlan } from "../monthly-plans/entities/monthly-plan.entity";
import { DailyFact } from "../daily-facts/entities/daily-fact.entity";
import { User } from "../users/entities/user.entity";
import { UserRole } from "../users/entities/user-role.enum";

export interface PercentBlock {
  callsPercent: number;
  talksPercent: number;
  salesCountPercent: number;
  cashSalesPercent: number;
  contractSalesPercent: number;
  debtPercent: number;
  totalCashPercent: number;
}

export interface SalaryResult {
  manager: User;
  userId?: number;
  month?: number;
  year?: number;
  overallPercent?: number;
  plan?: {
    planCalls: number;
    planTalks: number;
    planSalesCount: number;
    planCashSales: number;
    planContractSales: number;
    planDebt: number;
    planTotalCash: number;
  };
  fact?: {
    factCalls: number;
    factTalks: number;
    factSalesCount: number;
    factCashSales: number;
    factContractSales: number;
    factDebt: number;
    factTotalCash: number;
  };
  percent?: PercentBlock;
  kassagaTushganPul?: number;
  foizStavka?: number;
  conversionBonus?: number;
  monthlyTaskBonus?: number;
  oylikPercentMoney?: number;
  jami?: number;
  rewardName?: string | null;
  rewardStatus?: string;
  penaltyTask?: string | null;
  penaltyTaskStatus?: string;
  error?: string;
}

@Injectable()
export class SalaryService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,

    @InjectRepository(MonthlyPlan)
    private readonly monthlyPlanRepo: Repository<MonthlyPlan>,

    @InjectRepository(DailyFact)
    private readonly dailyFactRepo: Repository<DailyFact>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}

  
  private async findManager(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId, role: UserRole.MANAGER },
    });

    if (!user) {
      throw new NotFoundException("Manager topilmadi");
    }

    return user;
  }

  private async findMonthlyPlan(userId: number, month: number, year: number) {
    const monthlyPlan = await this.monthlyPlanRepo.findOne({
      where: {
        user: { id: userId },
        month,
        year,
      },
    });

    if (!monthlyPlan) {
      throw new NotFoundException("Bu oy uchun oylik plan topilmadi");
    }

    return monthlyPlan;
  }

  private getDaysInMonth(year: number, month: number) {
    return new Date(year, month, 0).getDate();
  }

  private calcPercent(plan: number, fact: number) {
    if (!plan || plan <= 0) return 0;
    return Number(((fact / plan) * 100).toFixed(2));
  }

  private sumFacts(facts: DailyFact[]) {
    return {
      factCalls: facts.reduce((sum, item) => sum + Number(item.factCalls), 0),
      factTalks: facts.reduce((sum, item) => sum + Number(item.factTalks), 0),
      factSalesCount: facts.reduce(
        (sum, item) => sum + Number(item.factSalesCount),
        0
      ),
      factCashSales: facts.reduce(
        (sum, item) => sum + Number(item.factCashSales),
        0
      ),
      factContractSales: facts.reduce(
        (sum, item) => sum + Number(item.factContractSales),
        0
      ),
      factDebt: facts.reduce((sum, item) => sum + Number(item.factDebt), 0),
      factTotalCash: facts.reduce(
        (sum, item) => sum + Number(item.factTotalCash),
        0
      ),
    };
  }

  private buildPercentBlock(plan: any, fact: any): PercentBlock {
    return {
      callsPercent: this.calcPercent(Number(plan.planCalls), Number(fact.factCalls)),
      talksPercent: this.calcPercent(Number(plan.planTalks), Number(fact.factTalks)),
salesCountPercent: this.calcPercent(
        Number(plan.planSalesCount),
        Number(fact.factSalesCount)
      ),
      cashSalesPercent: this.calcPercent(
        Number(plan.planCashSales),
        Number(fact.factCashSales)
      ),
      contractSalesPercent: this.calcPercent(
        Number(plan.planContractSales),
        Number(fact.factContractSales)
      ),
      debtPercent: this.calcPercent(
        Number(plan.planDebt),
        Number(fact.factDebt)
      ),
      totalCashPercent: this.calcPercent(
        Number(plan.planTotalCash),
        Number(fact.factTotalCash)
      ),
    };
  }

  private calcOverallPercent(percentBlock: PercentBlock) {
    const values = [
      percentBlock.callsPercent,
      percentBlock.talksPercent,
      percentBlock.salesCountPercent,
      percentBlock.cashSalesPercent,
      percentBlock.contractSalesPercent,
      percentBlock.debtPercent,
      percentBlock.totalCashPercent,
    ];

    return Number(
      (values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2)
    );
  }

  private getPercentRate(overallPercent: number) {
  if (overallPercent <= 80) return 0.01;
  if (overallPercent <= 90) return 0.02;
  if (overallPercent <= 100) return 0.03;
  if (overallPercent <= 120) return 0.04;
  if (overallPercent <= 150) return 0.05;
  return 0.055;
}

  private getConversionBonus(overallPercent: number) {
    return overallPercent > 80 ? 1_000_000 : 0;
  }

  private getMonthlyTaskBonus(overallPercent: number) {
    return overallPercent <= 80 ? 1_000_000 : 2_000_000;
  }

  async calculateManagerSalary(userId: number, month: number, year: number) {
    await this.findManager(userId);
    const monthlyPlan = await this.findMonthlyPlan(userId, month, year);

    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const endDate = `${year}-${String(month).padStart(2, "0")}-${String(
      this.getDaysInMonth(year, month)
    ).padStart(2, "0")}`;

    const facts = await this.dailyFactRepo.find({
      where: {
        user: { id: userId },
        date: Between(startDate, endDate),
      },
      order: { date: "ASC" },
    });

    const fact = this.sumFacts(facts);

    const planBlock = {
      planCalls: Number(monthlyPlan.planCalls),
      planTalks: Number(monthlyPlan.planTalks),
      planSalesCount: Number(monthlyPlan.planSalesCount),
      planCashSales: Number(monthlyPlan.planCashSales),
      planContractSales: Number(monthlyPlan.planContractSales),
      planDebt: Number(monthlyPlan.planDebt),
      planTotalCash: Number(monthlyPlan.planTotalCash),
    };

    const percentBlock = this.buildPercentBlock(planBlock, fact);
    const overallPercent = this.calcOverallPercent(percentBlock);

    const realPayments = await this.paymentRepo.find({
      where: {
        managerId: userId,
        createdAt: Between(
          new Date(`${startDate}T00:00:00.000Z`),
          new Date(`${endDate}T23:59:59.999Z`)
        ),
      },
    });

    const kassagaTushganPul = realPayments.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );

  const rate = this.getPercentRate(overallPercent);
const oylikPercentMoney = Math.round(kassagaTushganPul * rate);
const conversionBonus = this.getConversionBonus(overallPercent);
const monthlyTaskBonus = this.getMonthlyTaskBonus(overallPercent);
const jami = oylikPercentMoney + conversionBonus + monthlyTaskBonus;
    return {
      userId,
      month,
      year,
      overallPercent,
      plan: planBlock,
      fact,
      percent: percentBlock,
      kassagaTushganPul,
      foizStavka: rate,
      conversionBonus,
      monthlyTaskBonus,
      oylikPercentMoney,
      jami,
      rewardName: monthlyPlan.rewardName,
      rewardStatus: monthlyPlan.rewardStatus,
      penaltyTask: monthlyPlan.penaltyTask,
      penaltyTaskStatus: monthlyPlan.penaltyTaskStatus,
    };
  }
async calculateAllManagersSalary(month: number, year: number) {
    const managers = await this.userRepo.find({
      where: { role: UserRole.MANAGER },
      order: { id: "ASC" },
    });

    const result: SalaryResult[] = [];

    for (const manager of managers) {
      try {
        const item = await this.calculateManagerSalary(manager.id, month, year);

        result.push({
          manager,
          ...item,
        });
      } catch {
        result.push({
          manager,
          month,
          year,
          error: "Bu oy uchun plan topilmadi",
        });
      }
    }

    return result.sort((a, b) => {
      const aJami = a.jami ? Number(a.jami) : 0;
      const bJami = b.jami ? Number(b.jami) : 0;
      return bJami - aJami;
    });
  }
}