import { BadRequestException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { GetAllRolesQuery } from 'src/application/query/role/getAllRoles.query';
import { Role } from 'src/domain/entities/role.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetAllRolesQuery)
export class GetAllRolesHandler implements IQueryHandler<GetAllRolesQuery> {
  constructor(
    @InjectRepository(Role)
    private readonly userRepository: Repository<Role>,
  ) {}

  async execute(): Promise<Role[]> {
    try {
      return await this.userRepository.find();
    } catch {
      throw new BadRequestException('Erro ao buscar roles');
    }
  }
}
