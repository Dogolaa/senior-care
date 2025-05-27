import { BadRequestException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { GetAllAddressQuery } from 'src/application/query/address/getAllAddress.query';
import { Address } from 'src/domain/entities/address.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetAllAddressQuery)
export class GetAllAddressHandler implements IQueryHandler<GetAllAddressQuery> {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async execute(): Promise<Address[]> {
    try {
      return await this.addressRepository.find();
    } catch {
      throw new BadRequestException('Erro ao buscar endereços');
    }
  }
}
