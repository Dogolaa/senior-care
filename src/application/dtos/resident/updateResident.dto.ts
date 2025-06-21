import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsString, IsEnum, IsOptional } from 'class-validator';
import { IsCPF } from 'src/infrastructure/commom/validators/user/cpfValidator';

export enum Gender {
  MALE = 'Masculino',
  FEMALE = 'Feminino',
  OTHER = 'Outro',
}

export class UpdateResidentDTO {
  @ApiProperty({
    description: 'Novo nome completo do residente.',
    example: 'Maria Joaquina de Amaral Pereira Góis',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Novo CPF válido do residente.',
    example: '12345678901',
  })
  @IsOptional()
  @IsCPF()
  cpf?: string;

  @ApiProperty({
    description: 'Nova data de nascimento do residente no formato YYYY-MM-DD.',
    example: '2001-09-15',
  })
  @IsOptional()
  @IsISO8601({ strict: true, strictSeparator: true })
  dateOfBirth?: string;

  @ApiProperty({
    description: 'Novo gênero do residente.',
    example: 'Feminino',
    enum: Gender,
  })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiProperty({
    description: 'Data de admissão do residente no formato YYYY-MM-DD.',
    example: '2025-09-10',
  })
  @IsOptional()
  @IsISO8601({ strict: true, strictSeparator: true })
  admissionDate?: string;
}
