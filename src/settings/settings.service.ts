import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Settings } from "./entities/setting.entity";
import { UpdateSettingsDto } from "./dto/create-setting.dto";


@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Settings)
    private readonly settingsRepo: Repository<Settings>
  ) {}

  async getSettings() {
    let settings = await this.settingsRepo.findOne({
      where: { id: 1 },
    });

    if (!settings) {
      settings = this.settingsRepo.create({
        id: 1,
        workStartTime: "10:00:00",
        defaultPenaltyAmount: 100000,
        repeatedPenaltyIncrease: 50000,
      });

      settings = await this.settingsRepo.save(settings);
    }

    return settings;
  }

  async updateSettings(dto: UpdateSettingsDto) {
    const settings = await this.getSettings();

    await this.settingsRepo.update(settings.id, dto);

    return await this.getSettings();
  }
}
