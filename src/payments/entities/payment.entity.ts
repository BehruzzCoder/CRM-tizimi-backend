import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.payments, { onDelete: "CASCADE" })
  manager: User;

  @Column()
  managerId: number;

  @Column()
  clientName: string;

  @Column()
  phone: string;

  @Column()
  tariff: string;

  @Column()
  paymentType: string;

  @Column("decimal")
  amount: number;

  @Column("decimal", { default: 0 })
  contractAmount: number;

  @Column("decimal", { default: 0 })
  debt: number;

  @Column("simple-array", { nullable: true })
  receipts: string[];

  @Column({ default: false })
  bonusGiven: boolean;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}