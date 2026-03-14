import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Plan, PlanType } from "./entities/plan.entity";
import { User } from "../users/entities/user.entity";
import { UserRole } from "../users/entities/user-role.enum";
import { CreatePlanDto } from "./dto/create-plan.dto";
import { UpdatePlanDto } from "./dto/update-plan.dto";
import { WriteFactDto } from "./dto/write-fact.dto";
import { UpdatePlanStatusDto } from "./dto/update-plan-status.dto";

@Injectable()
export class PlansService {
  updateStatuses(arg0: number, dto: UpdatePlanStatusDto) {
    throw new Error("Method not implemented.");
  }
  constructor(
    @InjectRepository(Plan)
    private readonly planRepo: Repository<Plan>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}

  private async findManagerUser(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId, role: UserRole.MANAGER },
    });

    if (!user) {
      throw new NotFoundException("Manager user topilmadi");
    }

    return user;
  }

  private calcPercent(plan: number, fact: number) {
    if (!plan || plan <= 0) return 0;
    return Number(((fact / plan) * 100).toFixed(2));
  }

  private calcOverallPercent(plan: Plan) {
    const values = [
      Number(plan.callsPercent),
      Number(plan.talksPercent),
      Number(plan.interestedPercent),
      Number(plan.salesCountPercent),
      Number(plan.cashSalesPercent),
      Number(plan.contractSalesPercent),
      Number(plan.debtPercent),
      Number(plan.totalCashPercent),
    ];

    const avg = values.reduce((sum, item) => sum + item, 0) / values.length;
    return Number(avg.toFixed(2));
  }

  private applyEligibility(plan: Plan) {
    plan.rewardEligible = Number(plan.overallPercent) >= 100;
    plan.penaltyEligible = Number(plan.overallPercent) < 100;
  }

  private buildSummary(rows: Plan[]) {
    return {
      totalPlans: rows.length,
      factWrittenCount: rows.filter((item) => item.factWritten).length,
      rewardEligibleCount: rows.filter((item) => item.rewardEligible).length,
      penaltyEligibleCount: rows.filter((item) => item.penaltyEligible).length,

      avgOverallPercent:
        rows.length > 0
          ? Number(
              (
                rows.reduce((sum, item) => sum + Number(item.overallPercent), 0) /
                rows.length
              ).toFixed(2)
            )
          : 0,

      totalPlanCalls: rows.reduce((sum, item) => sum + item.planCalls, 0),
      totalFactCalls: rows.reduce((sum, item) => sum + item.factCalls, 0),

      totalPlanTalks: rows.reduce((sum, item) => sum + item.planTalks, 0),
      totalFactTalks: rows.reduce((sum, item) => sum + item.factTalks, 0),

      totalPlanInterestedClients: rows.reduce(
        (sum, item) => sum + item.planInterestedClients,
        0
      ),
      totalFactInterestedClients: rows.reduce(
        (sum, item) => sum + item.factInterestedClients,
        0
      ),

      totalPlanSalesCount: rows.reduce(
        (sum, item) => sum + item.planSalesCount,
        0
      ),
      totalFactSalesCount: rows.reduce(
        (sum, item) => sum + item.factSalesCount,
        0
      ),

      totalPlanCashSales: rows.reduce(
        (sum, item) => sum + Number(item.planCashSales),
        0
      ),
      totalFactCashSales: rows.reduce(
        (sum, item) => sum + Number(item.factCashSales),
        0
      ),

      totalPlanContractSales: rows.reduce(
        (sum, item) => sum + Number(item.planContractSales),
        0
      ),
      totalFactContractSales: rows.reduce(
        (sum, item) => sum + Number(item.factContractSales),
        0
      ),

      totalPlanDebt: rows.reduce((sum, item) => sum + Number(item.planDebt), 0),
      totalFactDebt: rows.reduce((sum, item) => sum + Number(item.factDebt), 0),

      totalPlanTotalCash: rows.reduce(
        (sum, item) => sum + Number(item.planTotalCash),
        0
      ),
      totalFactTotalCash: rows.reduce(
        (sum, item) => sum + Number(item.factTotalCash),
        0
      ),
    };
  }

  async create(dto: CreatePlanDto) {
    const user = await this.findManagerUser(dto.userId);

    const existing = await this.planRepo.findOne({
      where: {
        user: { id: dto.userId },
        type: dto.type,
        startDate: dto.startDate,
      },
    });

    if (existing) {
      throw new ConflictException("Bu davr uchun plan allaqachon mavjud");
    }

    const plan = this.planRepo.create({
      user,
      type: dto.type,
      startDate: dto.startDate,
      endDate: dto.endDate || null,
      planCalls: dto.planCalls,
      planTalks: dto.planTalks,
      planInterestedClients: dto.planInterestedClients,
      planSalesCount: dto.planSalesCount,
      planCashSales: dto.planCashSales,
      planContractSales: dto.planContractSales,
      planDebt: dto.planDebt,
      planTotalCash: dto.planTotalCash,
      rewardName: dto.rewardName || null,
      penaltyTask: dto.penaltyTask || null,
    });

    return await this.planRepo.save(plan);
  }

  async findAll() {
    return await this.planRepo.find({
      order: { createdAt: "DESC" },
    });
  }

  async findOne(id: number) {
    const plan = await this.planRepo.findOne({
      where: { id },
    });

    if (!plan) {
      throw new NotFoundException("Plan topilmadi");
    }

    return plan;
  }

  async update(id: number, dto: UpdatePlanDto) {
    const plan = await this.findOne(id);

    if (dto.userId !== undefined) {
      const user = await this.findManagerUser(dto.userId);
      plan.user = user;
    }

    if (dto.type !== undefined) plan.type = dto.type;
    if (dto.startDate !== undefined) plan.startDate = dto.startDate;
    if (dto.endDate !== undefined) plan.endDate = dto.endDate ?? null;
    if (dto.planCalls !== undefined) plan.planCalls = dto.planCalls;
    if (dto.planTalks !== undefined) plan.planTalks = dto.planTalks;
    if (dto.planInterestedClients !== undefined) {
      plan.planInterestedClients = dto.planInterestedClients;
    }
    if (dto.planSalesCount !== undefined) {
      plan.planSalesCount = dto.planSalesCount;
    }
    if (dto.planCashSales !== undefined) {
      plan.planCashSales = dto.planCashSales;
    }
    if (dto.planContractSales !== undefined) {
      plan.planContractSales = dto.planContractSales;
    }
    if (dto.planDebt !== undefined) {
      plan.planDebt = dto.planDebt;
    }
    if (dto.planTotalCash !== undefined) {
      plan.planTotalCash = dto.planTotalCash;
    }
    if (dto.rewardName !== undefined) {
      plan.rewardName = dto.rewardName ?? null;
    }
    if (dto.penaltyTask !== undefined) {
      plan.penaltyTask = dto.penaltyTask ?? null;
    }

    return await this.planRepo.save(plan);
  }

  async writeFact(id: number, dto: WriteFactDto) {
  const plan = await this.findOne(id);

  if (plan.factWritten) {
    throw new ConflictException("Bu plan uchun fact allaqachon yozilgan");
  }

  plan.factCalls = dto.factCalls;
  plan.factTalks = dto.factTalks;
  plan.factInterestedClients = dto.factInterestedClients;
  plan.factSalesCount = dto.factSalesCount;
  plan.factCashSales = dto.factCashSales;
  plan.factContractSales = dto.factContractSales;
  plan.factDebt = dto.factDebt;
  plan.factTotalCash = dto.factTotalCash;
  plan.factWritten = true;

  plan.callsPercent = this.calcPercent(plan.planCalls, dto.factCalls);
  plan.talksPercent = this.calcPercent(plan.planTalks, dto.factTalks);
  plan.interestedPercent = this.calcPercent(
    plan.planInterestedClients,
    dto.factInterestedClients
  );
  plan.salesCountPercent = this.calcPercent(
    plan.planSalesCount,
    dto.factSalesCount
  );
  plan.cashSalesPercent = this.calcPercent(
    Number(plan.planCashSales),
    dto.factCashSales
  );
  plan.contractSalesPercent = this.calcPercent(
    Number(plan.planContractSales),
    dto.factContractSales
  );
  plan.debtPercent = this.calcPercent(
    Number(plan.planDebt),
    dto.factDebt
  );
  plan.totalCashPercent = this.calcPercent(
    Number(plan.planTotalCash),
    dto.factTotalCash
  );

  plan.overallPercent = this.calcOverallPercent(plan);
  this.applyEligibility(plan);

  return await this.planRepo.save(plan);
}

  async remove(id: number) {
    const plan = await this.findOne(id);
    await this.planRepo.delete(id);

    return {
      message: "Plan o‘chirildi",
      data: plan,
    };
  }

  async findByUser(userId: number) {
    return await this.planRepo.find({
      where: {
        user: { id: userId },
      },
      order: { createdAt: "DESC" },
    });
  }

  async findMine(userId: number) {
    return await this.planRepo.find({
      where: {
        user: { id: userId },
      },
      order: { createdAt: "DESC" },
    });
  }

  async summary() {
    const rows = await this.planRepo.find({
      order: { createdAt: "DESC" },
    });

    return this.buildSummary(rows);
  }

  async summaryByType(type: PlanType) {
    const rows = await this.planRepo.find({
      where: { type },
      order: { createdAt: "DESC" },
    });

    return this.buildSummary(rows);
  }

  async summaryByUser(userId: number) {
    const rows = await this.planRepo.find({
      where: {
        user: { id: userId },
      },
      order: { createdAt: "DESC" },
    });

    return this.buildSummary(rows);
  }

  async summaryMine(userId: number) {
    const rows = await this.planRepo.find({
      where: {
        user: { id: userId },
      },
      order: { createdAt: "DESC" },
    });

    return this.buildSummary(rows);
  }
  async createForCurrentUser(userId: number, dto: CreatePlanDto) {
  const user = await this.findManagerUser(userId);

  const existing = await this.planRepo.findOne({
    where: {
      user: { id: userId },
      type: dto.type,
      startDate: dto.startDate,
    },
  });

  if (existing) {
    throw new ConflictException("Bu davr uchun plan allaqachon mavjud");
  }

  const plan = this.planRepo.create({
    user,
    type: dto.type,
    startDate: dto.startDate,
    endDate: dto.endDate || null,
    planCalls: dto.planCalls,
    planTalks: dto.planTalks,
    planInterestedClients: dto.planInterestedClients,
    planSalesCount: dto.planSalesCount,
    planCashSales: dto.planCashSales,
    planContractSales: dto.planContractSales,
    planDebt: dto.planDebt,
    planTotalCash: dto.planTotalCash,
    rewardName: dto.rewardName || null,
    penaltyTask: dto.penaltyTask || null,
  });

  return await this.planRepo.save(plan);
}
}