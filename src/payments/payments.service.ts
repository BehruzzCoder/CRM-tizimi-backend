import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Payment } from "./entities/payment.entity";
import { CreatePaymentDto } from "./dto/create-payment.dto";

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>
  ) {}

  async create(dto: CreatePaymentDto) {
    const payment = this.paymentRepo.create(dto);
    return this.paymentRepo.save(payment);
  }

  async findAll() {
    return this.paymentRepo.find({
      relations: ["manager"],
      order: { createdAt: "DESC" },
    });
  }

  async findByManager(managerId: number) {
    return this.paymentRepo.find({
      where: { managerId },
      order: { createdAt: "DESC" },
    });
  }

  async totalCashByManager(managerId: number) {
    const payments = await this.paymentRepo.find({
      where: { managerId },
    });

    return payments.reduce((sum, p) => sum + Number(p.amount), 0);
  }

  async giveBonus(id: number) {
    const payment = await this.paymentRepo.findOne({ where: { id } });
    if (!payment) {
      throw new Error("Payment not found");
    }

    payment.bonusGiven = true;

    return this.paymentRepo.save(payment);
  }

  async remove(id: number) {
    return this.paymentRepo.delete(id);
  }
}