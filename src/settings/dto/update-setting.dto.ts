import { PartialType } from '@nestjs/swagger';
import { UpdateSettingsDto } from 'src/settings/dto/create-setting.dto';

export class UpdateSettingDto extends PartialType(UpdateSettingsDto) {}