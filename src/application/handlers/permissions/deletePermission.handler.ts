import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { DeletePermissionCommand } from 'src/application/commands/permissions/deletePermission.command';
import { Permission } from 'src/domain/entities/permissions.entity';
import { Repository } from 'typeorm';

@Injectable()
@CommandHandler(DeletePermissionCommand)
export class DeletePermissionHandler
  implements ICommandHandler<DeletePermissionCommand>
{
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async execute(
    command: DeletePermissionCommand,
  ): Promise<{ message: string; id: string }> {
    const { id } = command;

    const permission = await this.permissionRepository.findOneBy({ id });

    if (!permission) {
      throw new NotFoundException('Permissão não encontrada');
    }

    try {
      await this.permissionRepository.delete(id);
      return { message: 'Permissão deletada com sucesso', id };
    } catch (error) {
      console.error(
        'Erro inesperado ao tentar deletar a permissão no banco:',
        error,
      );
      throw new InternalServerErrorException(
        `Ocorreu um erro no servidor ao tentar deletar a permissão. Detalhe: ${error.message}`,
      );
    }
  }
}
