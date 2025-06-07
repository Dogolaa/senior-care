import { IsOptional, IsString } from 'class-validator';

export class UpdateDoctorDTO {
  @IsOptional()
  @IsString()
  crm?: string;

  @IsOptional()
  @IsString()
  specialization?: string;

  @IsOptional()
  @IsString()
  shift?: string;
}
