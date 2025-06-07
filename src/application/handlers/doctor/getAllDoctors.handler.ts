import { BadRequestException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { GetAllDoctorsQuery } from 'src/application/query/doctor/getAllDoctors.query';
import { Doctor } from 'src/domain/entities/doctor.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetAllDoctorsQuery)
export class GetAllDoctorsHandler implements IQueryHandler<GetAllDoctorsQuery> {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  async execute(_query: GetAllDoctorsQuery): Promise<any> {
    try {
      return await this.doctorRepository.find({
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
      throw new BadRequestException(error.message || 'Erro ao buscar médico');
    }
  }
}
