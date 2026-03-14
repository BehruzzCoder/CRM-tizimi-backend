import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";
import { Payment } from "./entities/payment.entity";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { UpdatePaymentDto } from "./dto/update-payment.dto";
import { User } from "../users/entities/user.entity";
import { UserRole } from "../users/entities/user-role.enum";

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}

  private async findManagerUser(managerId: number) {
    const manager = await this.userRepo.findOne({
      where: { id: managerId, role: UserRole.MANAGER },
    });

    if (!manager) {
      throw new NotFoundException("Manager topilmadi");
    }

    return manager;
  }

  async create(dto: CreatePaymentDto, fileName?: string) {
    const manager = await this.findManagerUser(dto.managerId);

    const payment = this.paymentRepo.create({
      fullName: dto.fullName,
      phone: dto.phone,
      manager,
      stream: dto.stream,
      tariff: dto.tariff,
      amount: dto.amount,
      debt: dto.debt,
      paymentType: dto.paymentType,
      receipt: fileName || null,
    });

    return await this.paymentRepo.save(payment);
  }

  async findAll() {
    return await this.paymentRepo.find({
      order: { createdAt: "DESC" },
    });
  }

  async search(q: string) {
    return await this.paymentRepo.find({
      where: [
        { fullName: ILike(`%${q}%`) },
        { phone: ILike(`%${q}%`) },
        { manager: { fullName: ILike(`%${q}%`) } },
      ],
      order: { createdAt: "DESC" },
    });
  }

  async findOne(id: number) {
    const payment = await this.paymentRepo.findOne({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException("To‘lov topilmadi");
    }

    return payment;
  }

  async update(id: number, dto: UpdatePaymentDto) {
    const payment = await this.findOne(id);

    if (dto.managerId !== undefined) {
      payment.manager = await this.findManagerUser(dto.managerId);
    }

    if (dto.fullName !== undefined) payment.fullName = dto.fullName;
    if (dto.phone !== undefined) payment.phone = dto.phone;
    if (dto.stream !== undefined) payment.stream = dto.stream;
    if (dto.tariff !== undefined) payment.tariff = dto.tariff;
    if (dto.amount !== undefined) payment.amount = dto.amount;
    if (dto.debt !== undefined) payment.debt = dto.debt;
    if (dto.paymentType !== undefined) payment.paymentType = dto.paymentType;

    return await this.paymentRepo.save(payment);
  }

  async delete(id: number) {
    const payment = await this.findOne(id);
    await this.paymentRepo.delete(id);

    return {
      message: "To‘lov o‘chirildi",
      data: payment,
    };
  }
}