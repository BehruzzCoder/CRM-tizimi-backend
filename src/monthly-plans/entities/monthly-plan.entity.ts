import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { DailyFact } from "../../daily-facts/entities/daily-fact.entity";

@Entity("monthly_plans")
@Unique(["user", "month", "year"])
export class MonthlyPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true, onDelete: "CASCADE" })
  user: User;

  @Column({ type: "int" })
  month: number;

  @Column({ type: "int" })
  year: number;

  @Column({ type: "int", default: 0 })
  planCalls: number;

  @Column({ type: "int", default: 0 })
  planTalks: number;

  @Column({ type: "int", default: 0 })
  planSalesCount: number;

  @Column("decimal", { precision: 15, scale: 2, default: 0 })
  planCashSales: number;

  @Column("decimal", { precision: 15, scale: 2, default: 0 })
  planContractSales: number;

  @Column("decimal", { precision: 15, scale: 2, default: 0 })
  planDebt: number;

  @Column("decimal", { precision: 15, scale: 2, default: 0 })
  planTotalCash: number;

  @Column({ type: "text", nullable: true })
  rewardName: string | null;

  @Column({ type: "text", nullable: true })
  penaltyTask: string | null;

  @Column({ type: "text", default: "pending" })
  rewardStatus: string;

  @Column({ type: "text", default: "pending" })
  penaltyTaskStatus: string;

  @Column({ type: "text", nullable: true })
  adminComment: string | null;

  @OneToMany(() => DailyFact, (dailyFact) => dailyFact.monthlyPlan)
  dailyFacts: DailyFact[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}