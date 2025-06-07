import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDoctorDTO {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  crm: string;

  @IsNotEmpty()
  @IsString()
  specialization: string;

  @IsNotEmpty()
  @IsString()
  shift: string;
}
