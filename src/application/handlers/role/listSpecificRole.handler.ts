import { BadRequestException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { ListSpecificRoleQuery } from 'src/application/query/role/listSpecificRole.query';
import { Role } from 'src/domain/entities/role.entity';
import { Repository } from 'typeorm';

@QueryHandler(ListSpecificRoleQuery)
export class ListSpecificRoleHandler
  implements IQueryHandler<ListSpecificRoleQuery>
{
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async execute(query: ListSpecificRoleQuery): Promise<Role[]> {
    const id = query.id;

    try {
      return await this.roleRepository.find({
        where: [{ id }],
      });
    } catch {
      throw new BadRequestException('Erro ao buscar role');
    }
  }
}
