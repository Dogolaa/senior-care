import { BadRequestException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { GetAllPermissionsQuery } from 'src/application/query/permissions/getAllPermissions.query';
import { Permission } from 'src/domain/entities/permissions.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetAllPermissionsQuery)
export class GetAllPermissionsHandler
  implements IQueryHandler<GetAllPermissionsQuery>
{
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async execute(): Promise<Permission[]> {
    try {
      return await this.permissionRepository.find();
    } catch {
      throw new BadRequestException('Erro ao buscar permissões');
    }
  }
}
