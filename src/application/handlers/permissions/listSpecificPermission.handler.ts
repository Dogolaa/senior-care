import { BadRequestException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { ListSpecificPermissionQuery } from 'src/application/query/permissions/listSpecificPermission.query';
import { Permission } from 'src/domain/entities/permissions.entity';
import { Repository } from 'typeorm';

@QueryHandler(ListSpecificPermissionQuery)
export class ListSpecificPermissionHandler
  implements IQueryHandler<ListSpecificPermissionQuery>
{
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async execute(query: ListSpecificPermissionQuery): Promise<Permission[]> {
    const id = query.id;

    try {
      return await this.permissionRepository.find({
        where: [{ id }],
      });
    } catch {
      throw new BadRequestException('Erro ao buscar permissão');
    }
  }
}
