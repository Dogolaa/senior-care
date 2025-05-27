import { BadRequestException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { ListSpecificAddressQuery } from 'src/application/query/address/listSpecificAddress.query';
import { Address } from 'src/domain/entities/address.entity';
import { Repository } from 'typeorm';

@QueryHandler(ListSpecificAddressQuery)
export class ListSpecificAddressHandler
  implements IQueryHandler<ListSpecificAddressQuery>
{
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async execute(query: ListSpecificAddressQuery): Promise<Address[]> {
    const id = query.id;

    try {
      return await this.addressRepository.find({
        where: [{ id }],
      });
    } catch {
      throw new BadRequestException('Erro ao buscar endereço');
    }
  }
}
