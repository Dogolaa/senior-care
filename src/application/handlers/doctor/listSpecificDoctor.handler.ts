import { BadRequestException, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { ListSpecificDoctorQuery } from 'src/application/query/doctor/listSpecificDoctor.query';
import { Doctor } from 'src/domain/entities/doctor.entity';
import { Repository } from 'typeorm';

@QueryHandler(ListSpecificDoctorQuery)
export class ListSpecificDoctorHandler
  implements IQueryHandler<ListSpecificDoctorQuery>
{
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  async execute(query: ListSpecificDoctorQuery): Promise<any> {
    try {
      const { id } = query;

      const existingNurse = await this.doctorRepository.find({
        where: [{ id }],
      });

      if (!existingNurse) {
        throw new NotFoundException('Médico(a) não encontrado(a).');
      }

      return this.doctorRepository.findOne({
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
        error.message || 'Erro ao buscar médico(a)',
      );
    }
  }
}
