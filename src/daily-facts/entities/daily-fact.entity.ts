import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { MonthlyPlan } from "../../monthly-plans/entities/monthly-plan.entity";

@Entity("daily_facts")
@Unique(["user", "date"])
export class DailyFact {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true, onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => MonthlyPlan, { eager: true, onDelete: "CASCADE" })
  monthlyPlan: MonthlyPlan;

  @Column({ type: "date" })
  date: string;

  @Column({ type: "int", default: 0 })
  factCalls: number;

  @Column({ type: "int", default: 0 })
  factTalks: number;

  @Column({ type: "int", default: 0 })
  factSalesCount: number;

  @Column("decimal", { precision: 15, scale: 2, default: 0 })
  factCashSales: number;

  @Column("decimal", { precision: 15, scale: 2, default: 0 })
  factContractSales: number;

  @Column("decimal", { precision: 15, scale: 2, default: 0 })
  factDebt: number;

  @Column("decimal", { precision: 15, scale: 2, default: 0 })
  factTotalCash: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}