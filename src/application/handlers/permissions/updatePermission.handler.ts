import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  NotFoundException,
  Injectable,
  ConflictException,
} from '@nestjs/common';
import { UpdatePermissionCommand } from 'src/application/commands/permissions/updatePermission.command';
import { Permission } from 'src/domain/entities/permissions.entity';

@Injectable()
@CommandHandler(UpdatePermissionCommand)
export class UpdatePermissionHandler
  implements ICommandHandler<UpdatePermissionCommand>
{
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async execute(
    command: UpdatePermissionCommand,
  ): Promise<{ message: string; permission: Permission }> {
    const { id, permissionName } = command;

    const permission = await this.permissionRepository.findOneBy({ id });

    const formattedName = permissionName.toUpperCase();

    const existingName = await this.permissionRepository.findOneBy({
      permissionName: formattedName,
    });

    if (!permission) {
      throw new NotFoundException('Permissão não encontrada');
    }

    if (existingName) {
      throw new ConflictException('Nome já utilizado por outra permissão');
    }

    if (permissionName !== undefined) {
      permission.permissionName = formattedName;
    }

    try {
      const updatedPermission =
        await this.permissionRepository.save(permission);
      return {
        message: 'Permissão atualizada com sucesso',
        permission: updatedPermission,
      };
    } catch (error) {
      console.error('Erro ao atualizar permissões:', error);
      throw new BadRequestException(
        `Erro ao atualizar permissão. Detalhes: ${error.message || 'Erro desconhecido'}`,
      );
    }
  }
}
