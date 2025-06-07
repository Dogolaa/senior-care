import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  IsUUID,
} from 'class-validator';
import { IsCPF } from 'src/infrastructure/commom/validators/user/cpfValidator';

export class CreateUserDTO {
  @ApiProperty({
    description: 'Nome completo do usuário.',
    example: 'Maria Joaquina de Amaral Pereira Góis',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'E-mail único para login.',
    example: 'maria.gois@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'CPF válido do usuário, sem pontos ou traços.',
    example: '12345678901',
  })
  @IsNotEmpty()
  @IsCPF()
  cpf: string;

  @ApiProperty({
    description: 'Telefone de contato no formato E.164 (ex: +5535999998888).',
    example: '+5535999998888',
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    description: 'UUID do endereço vinculado ao usuário.',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsNotEmpty()
  @IsUUID()
  addressId: string;

  @ApiProperty({
    description:
      'Senha forte. Requer no mínimo 8 caracteres, uma maiúscula, uma minúscula, um número e um símbolo.',
    example: 'Senha@Forte123',
  })
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    description: 'UUID do perfil de acesso (Role) do usuário.',
    example: 'f0e9d8c7-b6a5-4321-fedc-ba9876543210',
  })
  @IsNotEmpty()
  @IsUUID()
  roleId: string;
}
