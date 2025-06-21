import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { IsCPF } from 'src/infrastructure/commom/validators/user/cpfValidator';

export enum Gender {
  MALE = 'Masculino',
  FEMALE = 'Feminino',
  OTHER = 'Outro',
}

export class CreateResidentDTO {
  @ApiProperty({
    description: 'Nome completo do residente.',
    example: 'Maria Joaquina de Amaral Pereira Góis',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'CPF válido do residente, sem pontos ou traços.',
    example: '12345678901',
  })
  @IsNotEmpty()
  @IsCPF()
  cpf: string;

  @ApiProperty({
    description: 'Data de nascimento do residente no formato YYYY-MM-DD.',
    example: '2001-09-14',
  })
  @IsNotEmpty()
  @IsISO8601({ strict: true, strictSeparator: true })
  dateOfBirth: string;

  @ApiProperty({
    description: 'Gênero do residente.',
    example: 'Feminino',
    enum: Gender,
  })
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    description: 'Data de admissão do residente no formato YYYY-MM-DD.',
    example: '2025-09-10',
  })
  @IsNotEmpty()
  @IsISO8601({ strict: true, strictSeparator: true })
  admissionDate: string;
}
