import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Repository } from "typeorm";
import { User } from "../users/entities/user.entity";
import { UserRole } from "../users/entities/user-role.enum";
import { Payment } from "../payments/entities/payment.entity";
import { Attendance } from "../attendance/entities/attendance.entity";
import { MonthlyPlan } from "../monthly-plans/entities/monthly-plan.entity";
import { DailyFact } from "../daily-facts/entities/daily-fact.entity";
import { Penalty } from "../penalties/entities/penalty.entity";
import { Lead } from "../leads/entities/lead.entity";

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,

    @InjectRepository(Attendance)
    private readonly attendanceRepo: Repository<Attendance>,

    @InjectRepository(MonthlyPlan)
    private readonly monthlyPlanRepo: Repository<MonthlyPlan>,

    @InjectRepository(DailyFact)
    private readonly dailyFactRepo: Repository<DailyFact>,

    @InjectRepository(Penalty)
    private readonly penaltyRepo: Repository<Penalty>,

    @InjectRepository(Lead)
    private readonly leadRepo: Repository<Lead>
  ) {}

  private getDaysInMonth(year: number, month: number) {
    return new Date(year, month, 0).getDate();
  }

  async getDashboard(month?: number, year?: number) {
    const now = new Date();
    const selectedMonth = month || now.getMonth() + 1;
    const selectedYear = year || now.getFullYear();
    const today = now.toISOString().slice(0, 10);

    const startDate = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-01`;
    const endDate = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-${String(
      this.getDaysInMonth(selectedYear, selectedMonth)
    ).padStart(2, "0")}`;

    const [
      allUsers,
      payments,
      todayPayments,
      todayAttendance,
      monthlyPlans,
      dailyFacts,
      penalties,
      allLeads,
      todayLeads,
    ] = await Promise.all([
      this.userRepo.find(),
      this.paymentRepo.find(),
      this.paymentRepo.find({
        where: {
          createdAt: Between(
            new Date(`${today}T00:00:00.000Z` ),
            new Date(`${today}T23:59:59.999Z`)
          ),
        },
      }),
      this.attendanceRepo.find({
        where: { date: today },
      }),
      this.monthlyPlanRepo.find({
        where: {
          month: selectedMonth,
          year: selectedYear,
        },
      }),
      this.dailyFactRepo.find({
        where: {
          date: Between(startDate, endDate),
        },
      }),
      this.penaltyRepo.find(),
      this.leadRepo.find(),
      this.leadRepo.find({
        where: {
          date: today,
        } as any,
      }),
    ]);

    const managers = allUsers.filter((item) => item.role === UserRole.MANAGER);
    const admins = allUsers.filter((item) => item.role === UserRole.ADMIN);

    const totalCash = payments.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );

    const todayCash = todayPayments.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );

    const totalDebt = payments.reduce(
      (sum, item) => sum + Number(item.debt),
      0
    );

    const monthlyFactCash = dailyFacts.reduce(
      (sum, item) => sum + Number(item.factTotalCash),
      0
    );

    const monthlyPlanCash = monthlyPlans.reduce(
      (sum, item) => sum + Number(item.planTotalCash),
      0
    );

    const checkedInCount = todayAttendance.filter((item) => !!item.checkInTime).length;
    const checkedOutCount = todayAttendance.filter((item) => !!item.checkOutTime).length;
    const lateCount = todayAttendance.filter((item) => !!item.late).length;

    const totalPenaltyAmount = penalties.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );
const leadsStats = {
      total: allLeads.length,
      today: todayLeads.length,
      yangiLid: allLeads.reduce((sum, item: any) => sum + Number(item.yangiLid || 0), 0),
      ishgaOlindi: allLeads.reduce((sum, item: any) => sum + Number(item.ishgaOlindi || 0), 0),
      aloqa: allLeads.reduce((sum, item: any) => sum + Number(item.aloqa || 0), 0),
      konsultatsiya: allLeads.reduce((sum, item: any) => sum + Number(item.konsultatsiya || 0), 0),
      qiziqish: allLeads.reduce((sum, item: any) => sum + Number(item.qiziqish || 0), 0),
      hisob: allLeads.reduce((sum, item: any) => sum + Number(item.hisob || 0), 0),
      pre: allLeads.reduce((sum, item: any) => sum + Number(item.pre || 0), 0),
      toliq: allLeads.reduce((sum, item: any) => sum + Number(item.toliq || 0), 0),
      kotargan: allLeads.reduce((sum, item: any) => sum + Number(item.kotargan || 0), 0),
      kotarmagan: allLeads.reduce((sum, item: any) => sum + Number(item.kotarmagan || 0), 0),
    };

    return {
      users: {
        total: allUsers.length,
        admins: admins.length,
        managers: managers.length,
      },
      payments: {
        totalCount: payments.length,
        totalCash,
        totalDebt,
        todayCount: todayPayments.length,
        todayCash,
      },
      attendance: {
        todayCount: todayAttendance.length,
        checkedInCount,
        checkedOutCount,
        lateCount,
      },
      plans: {
        monthlyPlansCount: monthlyPlans.length,
        monthlyPlanCash,
        monthlyFactCash,
      },
      penalties: {
        totalCount: penalties.length,
        totalAmount: totalPenaltyAmount,
      },
      leads: leadsStats,
    };
  }

  async getManagerAnalytics(userId: number, month?: number, year?: number) {
    const now = new Date();
    const selectedMonth = month || now.getMonth() + 1;
    const selectedYear = year || now.getFullYear();
    const today = now.toISOString().slice(0, 10);

    const startDate = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-01`;
    const endDate = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-${String(
      this.getDaysInMonth(selectedYear, selectedMonth)
    ).padStart(2, "0")}`;

    const [payments, attendance, facts, penalties, monthlyPlan] = await Promise.all([
      this.paymentRepo.find({
        where: {
          managerId: userId,
          createdAt: Between(
            new Date(`${startDate}T00:00:00.000Z`),
            new Date(`${endDate}T23:59:59.999Z`)
          ),
        },
      }),
      this.attendanceRepo.find({
        where: {
          user: { id: userId },
          date: Between(startDate, endDate),
        },
      }),
      this.dailyFactRepo.find({
        where: {
          user: { id: userId },
          date: Between(startDate, endDate),
        },
      }),
      this.penaltyRepo.find({
        where: {
          user: { id: userId },
        },
      }),
      this.monthlyPlanRepo.findOne({
        where: {
          user: { id: userId },
          month: selectedMonth,
          year: selectedYear,
        },
      }),
    ]);

    const totalCash = payments.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );

    const totalDebt = payments.reduce(
      (sum, item) => sum + Number(item.debt),
      0
    );

    const factTotalCash = facts.reduce(
      (sum, item) => sum + Number(item.factTotalCash),
      0
    );

    const factCalls = facts.reduce((sum, item) => sum + Number(item.factCalls), 0);
    const factTalks = facts.reduce((sum, item) => sum + Number(item.factTalks), 0);
    const factSalesCount = facts.reduce(
      (sum, item) => sum + Number(item.factSalesCount),
      0
    );

    const checkedInCount = attendance.filter((item) => !!item.checkInTime).length;
    const checkedOutCount = attendance.filter((item) => !!item.checkOutTime).length;
    const lateCount = attendance.filter((item) => !!item.late).length;

    const totalPenaltyAmount = penalties.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );
return {
      managerId: userId,
      month: selectedMonth,
      year: selectedYear,
      payments: {
        count: payments.length,
        totalCash,
        totalDebt,
      },
      facts: {
        count: facts.length,
        factCalls,
        factTalks,
        factSalesCount,
        factTotalCash,
      },
      attendance: {
        checkedInCount,
        checkedOutCount,
        lateCount,
      },
      penalties: {
        count: penalties.length,
        totalAmount: totalPenaltyAmount,
      },
      monthlyPlan: monthlyPlan
        ? {
            id: monthlyPlan.id,
            planCalls: Number(monthlyPlan.planCalls),
            planTalks: Number(monthlyPlan.planTalks),
            planSalesCount: Number(monthlyPlan.planSalesCount),
            planTotalCash: Number(monthlyPlan.planTotalCash),
            rewardName: monthlyPlan.rewardName,
            penaltyTask: monthlyPlan.penaltyTask,
          }
        : null,
      today,
    };
  }
}