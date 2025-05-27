import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateAddressDTO {
  @IsOptional()
  @IsString()
  cep: string;

  @IsOptional()
  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  state: string;

  @IsOptional()
  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  district: string;

  @IsOptional()
  @IsString()
  street: string;

  @IsOptional()
  @IsNumber()
  number: number;

  @IsOptional()
  @IsString()
  complement?: string;
}
