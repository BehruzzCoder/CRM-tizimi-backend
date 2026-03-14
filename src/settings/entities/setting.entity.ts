import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("settings")
export class Settings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "time", default: "10:00:00" })
  workStartTime: string;

  @Column("decimal", { precision: 12, scale: 2, default: 100000 })
  defaultPenaltyAmount: number;

  @Column("decimal", { precision: 12, scale: 2, default: 50000 })
  repeatedPenaltyIncrease: number;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
