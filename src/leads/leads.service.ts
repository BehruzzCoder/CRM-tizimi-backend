import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Repository } from "typeorm";
import { Lead } from "./entities/lead.entity";
import { CreateLeadDto } from "./dto/create-lead.dto";
import { UpdateLeadDto } from "./dto/update-lead.dto";

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private readonly leadRepo: Repository<Lead>
  ) {}

  async create(dto: CreateLeadDto) {
    const existing = await this.leadRepo.findOne({
      where: { date: dto.date },
    });

    if (existing) {
      throw new ConflictException("Bu sana uchun statistika allaqachon mavjud");
    }

    const lead = this.leadRepo.create(dto);
    return await this.leadRepo.save(lead);
  }

  async findAll() {
    return await this.leadRepo.find({
      order: {
        date: "DESC",
      },
    });
  }

  async findOne(id: number) {
    const data = await this.leadRepo.findOne({
      where: { id },
    });

    if (!data) {
      throw new NotFoundException("Statistika topilmadi");
    }

    return data;
  }

  async findByDate(date: string) {
    const data = await this.leadRepo.findOne({
      where: { date },
    });

    if (!data) {
      throw new NotFoundException("Bu sana uchun statistika topilmadi");
    }

    return data;
  }

  async findRange(from: string, to: string) {
    return await this.leadRepo.find({
      where: {
        date: Between(from, to),
      },
      order: {
        date: "ASC",
      },
    });
  }

  async update(id: number, dto: UpdateLeadDto) {
    const oldLead = await this.findOne(id);

    if (dto.date && dto.date !== oldLead.date) {
      const existing = await this.leadRepo.findOne({
        where: { date: dto.date },
      });

      if (existing) {
        throw new ConflictException("Bu sana uchun statistika allaqachon mavjud");
      }
    }

    await this.leadRepo.update(id, dto);
    return await this.findOne(id);
  }

  async remove(id: number) {
    const lead = await this.findOne(id);
    await this.leadRepo.delete(id);

    return {
      message: "Statistika o‘chirildi",
      data: lead,
    };
  }

  async summary() {
    const rows = await this.leadRepo.find();

    return {
      jamiLid: rows.reduce((sum, item) => sum + item.yangiLid, 0),
      yangiLid: rows.reduce((sum, item) => sum + item.yangiLid, 0),
      ishgaOlindi: rows.reduce((sum, item) => sum + item.ishgaOlindi, 0),
      aloqaOrnatildi: rows.reduce((sum, item) => sum + item.aloqaOrnatildi, 0),
      konsultatsiyaBerildi: rows.reduce(
        (sum, item) => sum + item.konsultatsiyaBerildi,
        0
      ),
      qiziqishBildirdi: rows.reduce(
        (sum, item) => sum + item.qiziqishBildirdi,
        0
      ),
      hisobRaqamYuborildi: rows.reduce(
        (sum, item) => sum + item.hisobRaqamYuborildi,
        0
      ),
      preDaplata: rows.reduce((sum, item) => sum + item.preDaplata, 0),
      toliqTolov: rows.reduce((sum, item) => sum + item.toliqTolov, 0),
      kotargan: rows.reduce((sum, item) => sum + item.kotargan, 0),
      kotarmagan: rows.reduce((sum, item) => sum + item.kotarmagan, 0),
    };
  }
}
