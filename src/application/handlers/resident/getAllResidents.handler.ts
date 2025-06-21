import { BadRequestException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { GetAllResidentsQuery } from 'src/application/query/resident/getAllResidents.query';
import { Resident } from 'src/domain/entities/resident.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetAllResidentsQuery)
export class GetAllResidentsHandler
  implements IQueryHandler<GetAllResidentsQuery>
{
  constructor(
    @InjectRepository(Resident)
    private readonly residentRepository: Repository<Resident>,
  ) {}

  async execute(_query: GetAllResidentsQuery): Promise<Resident[]> {
    try {
      return await this.residentRepository.find({
        select: ['id', 'name', 'cpf', 'dateOfBirth', 'gender', 'admissionDate'],
      });
    } catch (error) {
      throw new BadRequestException('Erro ao buscar residentes');
    }
  }
}
