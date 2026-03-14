import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";
import {
  RewardStatus,
  PenaltyTaskStatus,
} from "../entities/plan.entity";

export class UpdatePlanStatusDto {
  @ApiProperty({
    enum: RewardStatus,
    required: false,
    example: RewardStatus.GIVEN,
  })
  @IsOptional()
  @IsEnum(RewardStatus)
  rewardStatus?: RewardStatus;

  @ApiProperty({
    enum: PenaltyTaskStatus,
    required: false,
    example: PenaltyTaskStatus.DONE,
  })
  @IsOptional()
  @IsEnum(PenaltyTaskStatus)
  penaltyTaskStatus?: PenaltyTaskStatus;

  @ApiProperty({
    required: false,
    example: "Mukofot topshirildi",
  })
  @IsOptional()
  @IsString()
  adminComment?: string;
}
