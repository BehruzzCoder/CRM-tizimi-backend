import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Repository } from "typeorm";
import dayjs from "dayjs";
import { Lead } from "../leads/entities/lead.entity";
import { Payment } from "../payments/entities/payment.entity";

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Lead)
    private readonly leadRepo: Repository<Lead>,

    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>
  ) {}

  private buildLeadSummary(rows: Lead[]) {
    return {
      jamiLid: rows.reduce((sum, item) => sum + item.yangiLid, 0),
      yangiLid: rows.reduce((sum, item) => sum + item.yangiLid, 0),
      ishgaOlindi: rows.reduce((sum, item) => sum + item.ishgaOlindi, 0),
      aloqaOrnatildi: rows.reduce((sum, item) => sum + item.aloqaOrnatildi, 0),
      konsultatsiyaBerildi: rows.reduce(
        (sum, item) => sum + item.konsultatsiyaBerildi,
        0
      ),
      qiziqishBildirdi: rows.reduce(
        (sum, item) => sum + item.qiziqishBildirdi,
        0
      ),
      hisobRaqamYuborildi: rows.reduce(
        (sum, item) => sum + item.hisobRaqamYuborildi,
        0
      ),
      preDaplata: rows.reduce((sum, item) => sum + item.preDaplata, 0),
      toliqTolov: rows.reduce((sum, item) => sum + item.toliqTolov, 0),
      kotargan: rows.reduce((sum, item) => sum + item.kotargan, 0),
      kotarmagan: rows.reduce((sum, item) => sum + item.kotarmagan, 0),
    };
  }

  async dashboard() {
    const leads = await this.leadRepo.find({
      order: { date: "ASC" },
    });

    const payments = await this.paymentRepo.find({
      order: { createdAt: "DESC" },
    });

    const leadSummary = this.buildLeadSummary(leads);

    const totalPaymentsCount = payments.length;
    const totalAmount = payments.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );
    const totalDebt = payments.reduce(
      (sum, item) => sum + Number(item.debt),
      0
    );

    return {
      ...leadSummary,
      paymentsCount: totalPaymentsCount,
      totalPaymentAmount: totalAmount,
      totalDebt,
    };
  }

  async byDateRange(from: string, to: string) {
    const rows = await this.leadRepo.find({
      where: {
        date: Between(from, to),
      },
      order: {
        date: "ASC",
      },
    });

    return {
      rows,
      summary: this.buildLeadSummary(rows),
    };
  }

  async today() {
    const todayDate = dayjs().format("YYYY-MM-DD");

    const row = await this.leadRepo.findOne({
      where: {
        date: todayDate,
      },
    });

    if (!row) {
      return {
        date: todayDate,
        yangiLid: 0,
        ishgaOlindi: 0,
        aloqaOrnatildi: 0,
        konsultatsiyaBerildi: 0,
        qiziqishBildirdi: 0,
        hisobRaqamYuborildi: 0,
        preDaplata: 0,
        toliqTolov: 0,
        kotargan: 0,
        kotarmagan: 0,
      };
    }

    return row;
  }

  async weekly() {
    const start = dayjs().startOf("week").format("YYYY-MM-DD");
    const end = dayjs().endOf("week").format("YYYY-MM-DD");

    return this.byDateRange(start, end);
  }

  async monthly() {
    const start = dayjs().startOf("month").format("YYYY-MM-DD");
    const end = dayjs().endOf("month").format("YYYY-MM-DD");

    return this.byDateRange(start, end);
  }

  async paymentSummary() {
    const payments = await this.paymentRepo.find({
      order: { createdAt: "DESC" },
    });

    const totalPaymentsCount = payments.length;
    const totalAmount = payments.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );
    const totalDebt = payments.reduce(
      (sum, item) => sum + Number(item.debt),
      0
    );

    return {
      paymentsCount: totalPaymentsCount,
      totalAmount,
      totalDebt,
    };
  }

  async paymentSummaryByManager() {
  const payments = await this.paymentRepo.find();

  const map = new Map<
    number,
    {
      managerId: number;
      manager: string;
      count: number;
      amount: number;
      debt: number;
    }
  >();

  for (const item of payments) {
    if (!item.manager) continue;

    const key = item.manager.id;

    if (!map.has(key)) {
      map.set(key, {
        managerId: item.manager.id,
        manager: item.manager.fullName,
        count: 0,
        amount: 0,
        debt: 0,
      });
    }

    const current = map.get(key)!;
    current.count += 1;
    current.amount += Number(item.amount);
    current.debt += Number(item.debt);
  }

  return Array.from(map.values()).sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return b.amount - a.amount;
  });
}
}
