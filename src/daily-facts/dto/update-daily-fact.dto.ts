import { PartialType } from '@nestjs/swagger';
import { CreateDailyFactDto } from './create-daily-fact.dto';

export class UpdateDailyFactDto extends PartialType(CreateDailyFactDto) {}
