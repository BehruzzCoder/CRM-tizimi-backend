import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity("payments")
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column()
  phone: string;

  @ManyToOne(() => User, { eager: true, nullable: true, onDelete: "SET NULL" })
  manager: User;

  @Column()
  stream: string;

  @Column()
  tariff: string;

  @Column("decimal", { precision: 15, scale: 2, default: 0 })
  amount: number;

  @Column("decimal", { precision: 15, scale: 2, default: 0 })
  debt: number;

  @Column({ type: "text", nullable: true })
  receipt: string | null;

  @Column()
  paymentType: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}