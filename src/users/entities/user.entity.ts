import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserRole } from "./user-role.enum";

@Entity("users")
export class User {
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
}