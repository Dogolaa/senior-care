import { BadRequestException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { GetAllNursesQuery } from 'src/application/query/nurse/getAllNurses.query';
import { Nurse } from 'src/domain/entities/nurse.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetAllNursesQuery)
export class GetAllNursesHandler implements IQueryHandler<GetAllNursesQuery> {
  constructor(
    @InjectRepository(Nurse)
    private readonly nurseRepository: Repository<Nurse>,
  ) {}

  async execute(_query: GetAllNursesQuery): Promise<any> {
    try {
      return await this.nurseRepository.find({
        select: {
          user: {
            id: true,
            name: true,
            email: true,
            cpf: true,
            phone: true,
            isActive: true,
            password: false,
            addressId: true,
            roleId: true,
          },
        },
        relations: ['user'],
      });
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Erro ao buscar enfermeira',
      );
    }
  }
}
