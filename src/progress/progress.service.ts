import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Repository } from "typeorm";
import { MonthlyPlan } from "../monthly-plans/entities/monthly-plan.entity";
import { DailyFact } from "../daily-facts/entities/daily-fact.entity";
import { Lead } from "src/leads/entities/lead.entity";

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(MonthlyPlan)
    private readonly monthlyPlanRepo: Repository<MonthlyPlan>,

    @InjectRepository(DailyFact)
    private readonly dailyFactRepo: Repository<DailyFact>,
    @InjectRepository(Lead)
    private readonly leadRepo: Repository<Lead>
  ) {}

  private async findCurrentMonthlyPlan(userId: number, month: number, year: number) {
    const monthlyPlan = await this.monthlyPlanRepo.findOne({
      where: {
        user: { id: userId },
        month,
        year,
      },
      relations: ["user"],
    });

    if (!monthlyPlan) {
      throw new NotFoundException("Bu oy uchun oylik plan topilmadi");
    }

    return monthlyPlan;
  }

  private getDaysInMonth(year: number, month: number) {
    return new Date(year, month, 0).getDate();
  }

  private getWeekRange(date: Date) {
    const current = new Date(date);
    const day = current.getDay();
    const diffToMonday = day === 0 ? 6 : day - 1;

    const start = new Date(current);
    start.setDate(current.getDate() - diffToMonday);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }

  private formatDate(date: Date) {
    return date.toISOString().slice(0, 10);
  }

  private roundPlanBlock(plan: {
    planCalls: number;
    planTalks: number;
    planSalesCount: number;
    planCashSales: number;
    planContractSales: number;
    planDebt: number;
    planTotalCash: number;
  }) {
    return {
      planCalls: Math.round(plan.planCalls),
      planTalks: Math.round(plan.planTalks),
      planSalesCount: Math.round(plan.planSalesCount),
      planCashSales: Math.round(plan.planCashSales),
      planContractSales: Math.round(plan.planContractSales),
      planDebt: Math.round(plan.planDebt),
      planTotalCash: Math.round(plan.planTotalCash),
    };
  }

  private sumFacts(facts: DailyFact[]) {
    return {
      factCalls: facts.reduce((sum, item) => sum + Number(item.factCalls), 0),
      factTalks: facts.reduce((sum, item) => sum + Number(item.factTalks), 0),
      factSalesCount: facts.reduce((sum, item) => sum + Number(item.factSalesCount), 0),
      factCashSales: facts.reduce((sum, item) => sum + Number(item.factCashSales), 0),
      factContractSales: facts.reduce((sum, item) => sum + Number(item.factContractSales), 0),
      factDebt: facts.reduce((sum, item) => sum + Number(item.factDebt), 0),
      factTotalCash: facts.reduce((sum, item) => sum + Number(item.factTotalCash), 0),
    };
  }

  private calcPercent(plan: number, fact: number) {
    if (!plan || plan <= 0) return 0;
    return Number(((fact / plan) * 100).toFixed(2));
  }

  private buildPercent(plan: any, fact: any) {
    return {
      callsPercent: this.calcPercent(Number(plan.planCalls), Number(fact.factCalls)),
      talksPercent: this.calcPercent(Number(plan.planTalks), Number(fact.factTalks)),
      salesCountPercent: this.calcPercent(Number(plan.planSalesCount), Number(fact.factSalesCount)),
      cashSalesPercent: this.calcPercent(Number(plan.planCashSales), Number(fact.factCashSales)),
      contractSalesPercent: this.calcPercent(
        Number(plan.planContractSales),
        Number(fact.factContractSales)
      ),
      debtPercent: this.calcPercent(Number(plan.planDebt), Number(fact.factDebt)),
      totalCashPercent: this.calcPercent(Number(plan.planTotalCash), Number(fact.factTotalCash)),
    };
  }

  private calcOverallPercent(percentBlock: {
    callsPercent: number;
talksPercent: number;
    salesCountPercent: number;
    cashSalesPercent: number;
    contractSalesPercent: number;
    debtPercent: number;
    totalCashPercent: number;
  }) {
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

  async getDailyProgress(userId: number, date?: string) {
    const targetDate = date ? new Date(date) : new Date();
    const month = targetDate.getMonth() + 1;
    const year = targetDate.getFullYear();
    const targetDateString = this.formatDate(targetDate);

    const monthlyPlan = await this.findCurrentMonthlyPlan(userId, month, year);
    const daysInMonth = this.getDaysInMonth(year, month);

    const dailyPlan = this.roundPlanBlock({
      planCalls: Number(monthlyPlan.planCalls) / daysInMonth,
      planTalks: Number(monthlyPlan.planTalks) / daysInMonth,
      planSalesCount: Number(monthlyPlan.planSalesCount) / daysInMonth,
      planCashSales: Number(monthlyPlan.planCashSales) / daysInMonth,
      planContractSales: Number(monthlyPlan.planContractSales) / daysInMonth,
      planDebt: Number(monthlyPlan.planDebt) / daysInMonth,
      planTotalCash: Number(monthlyPlan.planTotalCash) / daysInMonth,
    });

    const facts = await this.dailyFactRepo.find({
      where: {
        user: { id: userId },
        date: targetDateString,
      },
      relations: ["user", "monthlyPlan"],
      order: { date: "ASC" },
    });

    const dailyFact = this.sumFacts(facts);
    const percent = this.buildPercent(dailyPlan, dailyFact);
    const overallPercent = this.calcOverallPercent(percent);

    return {
      type: "daily",
      monthlyPlanId: monthlyPlan.id,
      date: targetDateString,
      plan: dailyPlan,
      fact: dailyFact,
      percent,
      overallPercent,
      facts,
      rewardName: monthlyPlan.rewardName,
      rewardStatus: monthlyPlan.rewardStatus,
      penaltyTask: monthlyPlan.penaltyTask,
      penaltyTaskStatus: monthlyPlan.penaltyTaskStatus,
      adminComment: monthlyPlan.adminComment,
    };
  }

  async getWeeklyProgress(userId: number, date?: string) {
    const targetDate = date ? new Date(date) : new Date();
    const month = targetDate.getMonth() + 1;
    const year = targetDate.getFullYear();

    const monthlyPlan = await this.findCurrentMonthlyPlan(userId, month, year);
    const { start, end } = this.getWeekRange(targetDate);

    const weeklyPlan = this.roundPlanBlock({
      planCalls: Number(monthlyPlan.planCalls) / 4,
      planTalks: Number(monthlyPlan.planTalks) / 4,
      planSalesCount: Number(monthlyPlan.planSalesCount) / 4,
      planCashSales: Number(monthlyPlan.planCashSales) / 4,
      planContractSales: Number(monthlyPlan.planContractSales) / 4,
      planDebt: Number(monthlyPlan.planDebt) / 4,
      planTotalCash: Number(monthlyPlan.planTotalCash) / 4,
    });

    const facts = await this.dailyFactRepo.find({
      where: {
        user: { id: userId },
        date: Between(this.formatDate(start), this.formatDate(end)),
      },
      relations: ["user", "monthlyPlan"],
      order: { date: "ASC" },
    });

    const weeklyFact = this.sumFacts(facts);
    const percent = this.buildPercent(weeklyPlan, weeklyFact);
    const overallPercent = this.calcOverallPercent(percent);

    return {
      type: "weekly",
      monthlyPlanId: monthlyPlan.id,
      week: 1,
      startDate: this.formatDate(start),
      endDate: this.formatDate(end),
      plan: weeklyPlan,
      fact: weeklyFact,
      percent,
      overallPercent,
      facts,
      rewardName: monthlyPlan.rewardName,
      rewardStatus: monthlyPlan.rewardStatus,
      penaltyTask: monthlyPlan.penaltyTask,
      penaltyTaskStatus: monthlyPlan.penaltyTaskStatus,
      adminComment: monthlyPlan.adminComment,
    };
  }
async getMonthlyProgress(userId: number, month?: number, year?: number) {
    const now = new Date();
    const currentMonth = month || now.getMonth() + 1;
    const currentYear = year || now.getFullYear();

    const monthlyPlan = await this.findCurrentMonthlyPlan(userId, currentMonth, currentYear);

    const startDate = `${currentYear}-${String(currentMonth).padStart(2, "0")}-01`;
    const endDate = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(
      this.getDaysInMonth(currentYear, currentMonth)
    ).padStart(2, "0")}`;

    const facts = await this.dailyFactRepo.find({
      where: {
        user: { id: userId },
        date: Between(startDate, endDate),
      },
      relations: ["user", "monthlyPlan"],
      order: { date: "ASC" },
    });

    const monthlyFact = this.sumFacts(facts);

    const monthlyPlanBlock = {
      planCalls: Number(monthlyPlan.planCalls),
      planTalks: Number(monthlyPlan.planTalks),
      planSalesCount: Number(monthlyPlan.planSalesCount),
      planCashSales: Number(monthlyPlan.planCashSales),
      planContractSales: Number(monthlyPlan.planContractSales),
      planDebt: Number(monthlyPlan.planDebt),
      planTotalCash: Number(monthlyPlan.planTotalCash),
    };

    const percent = this.buildPercent(monthlyPlanBlock, monthlyFact);
    const overallPercent = this.calcOverallPercent(percent);

    return {
      type: "monthly",
      monthlyPlanId: monthlyPlan.id,
      month: currentMonth,
      year: currentYear,
      plan: monthlyPlanBlock,
      fact: monthlyFact,
      percent,
      overallPercent,
      facts,
      rewardName: monthlyPlan.rewardName,
      rewardStatus: monthlyPlan.rewardStatus,
      penaltyTask: monthlyPlan.penaltyTask,
      penaltyTaskStatus: monthlyPlan.penaltyTaskStatus,
      adminComment: monthlyPlan.adminComment,
    };
  }

  async getMyDashboard(userId: number) {
    const now = new Date();
    const today = this.formatDate(now);
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const [daily, weekly, monthly] = await Promise.all([
      this.getDailyProgress(userId, today),
      this.getWeeklyProgress(userId, today),
      this.getMonthlyProgress(userId, month, year),
    ]);

    return {
      daily,
      weekly,
      monthly,
    };
  }

  async getUserDashboard(userId: number) {
    return this.getMyDashboard(userId);
  }


}