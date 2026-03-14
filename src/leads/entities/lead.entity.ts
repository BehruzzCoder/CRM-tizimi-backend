import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("leads")
export class Lead {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "date", unique: true })
  date: string;

  @Column({ default: 0 })
  yangiLid: number;

  @Column({ default: 0 })
  ishgaOlindi: number;

  @Column({ default: 0 })
  aloqaOrnatildi: number;

  @Column({ default: 0 })
  konsultatsiyaBerildi: number;

  @Column({ default: 0 })
  qiziqishBildirdi: number;

  @Column({ default: 0 })
  hisobRaqamYuborildi: number;

  @Column({ default: 0 })
  preDaplata: number;

  @Column({ default: 0 })
  toliqTolov: number;

  @Column({ default: 0 })
  kotargan: number;

  @Column({ default: 0 })
  kotarmagan: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
