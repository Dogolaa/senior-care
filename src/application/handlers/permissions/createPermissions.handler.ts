import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePermissionCommand } from 'src/application/commands/permissions/createPermission.command';
import { Permission } from 'src/domain/entities/permissions.entity';
import { Repository } from 'typeorm';

@CommandHandler(CreatePermissionCommand)
export class CreatePermissionHandler
  implements ICommandHandler<CreatePermissionCommand>
{
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async execute(command: CreatePermissionCommand): Promise<any> {
    try {
      const { permissionName } = command;

      const formattedName = permissionName.toUpperCase();

      const existingPermission = await this.permissionRepository.findOne({
        where: [{ permissionName: formattedName }],
      });

      if (existingPermission) {
        throw new BadRequestException(
          'Nome da permissão já em uso. Por favor, tente novamente com outros dados.',
        );
      }

      const permission = this.permissionRepository.create({
        permissionName: formattedName,
      });

      await this.permissionRepository.save(permission);

      return {
        message: 'Permissão criada com sucesso',
        permission: {
          permissionName: permission.permissionName,
        },
      };
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Erro ao criar permissão. Por favor, tente novamente.',
      );
    }
  }
}
