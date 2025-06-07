import { IsOptional, IsString } from 'class-validator';

export class UpdateNurseDTO {
  @IsOptional()
  @IsString()
  coren?: string;

  @IsOptional()
  @IsString()
  specialization?: string;

  @IsOptional()
  @IsString()
  shift?: string;
}
