import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  IsUUID,
} from 'class-validator';
import { IsCPF } from 'src/infrastructure/commom/validators/user/cpfValidator';

export class UpdateUserDTO {
  @ApiProperty({
    description: 'Novo nome completo do usuário.',
    example: 'Maria Joaquina de Amaral',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Novo e-mail único para login.',
    example: 'maria.amaral@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Novo CPF válido do usuário, sem pontos ou traços.',
    example: '98765432100',
    required: false,
  })
  @IsOptional()
  @IsCPF()
  cpf?: string;

  @ApiProperty({
    description: 'Novo telefone de contato no formato E.164.',
    example: '+5535988887777',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiProperty({
    description: 'Novo UUID do endereço vinculado ao usuário.',
    example: 'd4c3b2a1-f6e5-9087-4321-fedcba987654',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  addressId?: string;

  @ApiProperty({
    description: 'Nova senha forte.',
    example: 'NovaSenha@456',
    required: false,
  })
  @IsOptional()
  @IsStrongPassword()
  password?: string;

  @ApiProperty({
    description: 'Novo UUID do perfil de acesso (Role) do usuário.',
    example: 'fedcba98-7654-3210-b6a5-f0e9d8c7b6a5',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  roleId?: string;
}
