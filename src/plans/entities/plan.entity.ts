import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";

export enum PlanType {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
}

export enum RewardStatus {
  PENDING = "pending",
  GIVEN = "given",
  NOT_GIVEN = "not_given",
}

export enum PenaltyTaskStatus {
  PENDING = "pending",
  DONE = "done",
  NOT_DONE = "not_done",
}

@Entity("plans")
export class Plan {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true, onDelete: "CASCADE" })
  user: User;

  @Column({
    type: "enum",
    enum: PlanType,
  })
  type: PlanType;

  @Column({ type: "date" })
  startDate: string;

  @Column({ type: "date", nullable: true })
  endDate: string | null;

  @Column({ default: 0 })
  planCalls: number;

  @Column({ default: 0 })
  planTalks: number;

  @Column({ default: 0 })
  planInterestedClients: number;

  @Column({ default: 0 })
  planSalesCount: number;

  @Column("decimal", { precision: 15, scale: 2, default: 0 })
  planCashSales: number;

  @Column("decimal", { precision: 15, scale: 2, default: 0 })
  planContractSales: number;

  @Column("decimal", { precision: 15, scale: 2, default: 0 })
  planDebt: number;

  @Column("decimal", { precision: 15, scale: 2, default: 0 })
  planTotalCash: number;

  @Column({ default: 0 })
  factCalls: number;

  @Column({ default: 0 })
  factTalks: number;

  @Column({ default: 0 })
  factInterestedClients: number;

  @Column({ default: 0 })
  factSalesCount: number;

  @Column("decimal", { precision: 15, scale: 2, default: 0 })
  factCashSales: number;

  @Column("decimal", { precision: 15, scale: 2, default: 0 })
  factContractSales: number;

  @Column("decimal", { precision: 15, scale: 2, default: 0 })
  factDebt: number;

  @Column("decimal", { precision: 15, scale: 2, default: 0 })
  factTotalCash: number;

  @Column({ default: false })
  factWritten: boolean;

  @Column("decimal", { precision: 6, scale: 2, default: 0 })
  callsPercent: number;

  @Column("decimal", { precision: 6, scale: 2, default: 0 })
  talksPercent: number;

  @Column("decimal", { precision: 6, scale: 2, default: 0 })
  interestedPercent: number;

  @Column("decimal", { precision: 6, scale: 2, default: 0 })
  salesCountPercent: number;

  @Column("decimal", { precision: 6, scale: 2, default: 0 })
  cashSalesPercent: number;

  @Column("decimal", { precision: 6, scale: 2, default: 0 })
  contractSalesPercent: number;

  @Column("decimal", { precision: 6, scale: 2, default: 0 })
  debtPercent: number;

  @Column("decimal", { precision: 6, scale: 2, default: 0 })
  totalCashPercent: number;

  @Column("decimal", { precision: 6, scale: 2, default: 0 })
  overallPercent: number;

  @Column({ type: "text", nullable: true })
  rewardName: string | null;

  @Column({
    type: "enum",
    enum: RewardStatus,
    default: RewardStatus.PENDING,
  })
  rewardStatus: RewardStatus;

  @Column({ default: false })
  rewardEligible: boolean;

  @Column({ type: "text", nullable: true })
  penaltyTask: string | null;

  @Column({
    type: "enum",
    enum: PenaltyTaskStatus,
    default: PenaltyTaskStatus.PENDING,
  })
  penaltyTaskStatus: PenaltyTaskStatus;

  @Column({ default: false })
  penaltyEligible: boolean;

  @Column({ type: "text", nullable: true })
  adminComment?: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}