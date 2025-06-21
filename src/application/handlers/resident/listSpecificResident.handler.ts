import { BadRequestException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { ListSpecificResidentQuery } from 'src/application/query/resident/listSpecificResident.query';
import { Resident } from 'src/domain/entities/resident.entity';
import { Repository } from 'typeorm';

@QueryHandler(ListSpecificResidentQuery)
export class ListSpecificResidentHandler
  implements IQueryHandler<ListSpecificResidentQuery>
{
  constructor(
    @InjectRepository(Resident)
    private readonly residentRepository: Repository<Resident>,
  ) {}

  async execute(query: ListSpecificResidentQuery): Promise<Resident[]> {
    const id = query.id;

    try {
      return await this.residentRepository.find({
        select: ['id', 'name', 'cpf', 'dateOfBirth', 'gender', 'admissionDate'],
        where: [{ id }],
      });
    } catch {
      throw new BadRequestException('Erro ao buscar residente');
    }
  }
}
