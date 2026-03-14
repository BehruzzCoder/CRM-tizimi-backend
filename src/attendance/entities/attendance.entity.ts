import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity("attendances")
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true, onDelete: "CASCADE" })
  user: User;

  @Column({ type: "date" })
  date: string;

  @Column({ type: "time", nullable: true })
  checkInTime: string | null;

  @Column({ type: "time", nullable: true })
  checkOutTime: string | null;

  @Column({ type: "text", nullable: true })
  checkInImage: string | null;

  @Column({ type: "text", nullable: true })
  checkOutImage: string | null;

  @Column({ default: false })
  late: boolean;

  @Column({ type: "int", default: 0 })
  lateMinutes: number;

  @Column({ default: false })
  penaltyCreated: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}