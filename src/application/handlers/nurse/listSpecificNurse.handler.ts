import { BadRequestException, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { ListSpecificNurseQuery } from 'src/application/query/nurse/listSpecificNurse.query';
import { Nurse } from 'src/domain/entities/nurse.entity';
import { Repository } from 'typeorm';

@QueryHandler(ListSpecificNurseQuery)
export class ListSpecificNurseHandler
  implements IQueryHandler<ListSpecificNurseQuery>
{
  constructor(
    @InjectRepository(Nurse)
    private readonly nurseRepository: Repository<Nurse>,
  ) {}

  async execute(query: ListSpecificNurseQuery): Promise<any> {
    try {
      const { id } = query;

      const existingNurse = await this.nurseRepository.find({
        where: [{ id }],
      });

      if (!existingNurse) {
        throw new NotFoundException('Enfermeiro(a) não encontrado(a).');
      }

      return this.nurseRepository.findOne({
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
        where: { id },
        relations: ['user'],
      });
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Erro ao buscar enfermeiro(a)',
      );
    }
  }
}
