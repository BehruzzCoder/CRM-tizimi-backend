import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserRole } from "./user-role.enum";
import { Payment } from "src/payments/entities/payment.entity";

@Entity("users")
export class User {
  [x: string]: any;
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  phone: string;

  @Column({ unique: true })
  login: string;

  @Column()
  password: string;
  @OneToMany(()=> Payment, (payment) => payment.manager)
  payments: Payment[];

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.MANAGER,
  })
  role: UserRole;

  @Column({ type: "text", nullable: true })
  image: string | null;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: "time", nullable: true })
  customStartTime: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  payment: any;
}