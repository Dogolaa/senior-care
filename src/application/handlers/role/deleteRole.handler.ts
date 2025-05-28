import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteRoleCommand } from 'src/application/commands/role/deleteRole.command';
import { Role } from 'src/domain/entities/role.entity';
import { User } from 'src/domain/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
@CommandHandler(DeleteRoleCommand)
export class DeleteRoleHandler implements ICommandHandler<DeleteRoleCommand> {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(
    command: DeleteRoleCommand,
  ): Promise<{ message: string; id: string }> {
    const { id } = command;

    const role = await this.roleRepository.findOneBy({ id });

    if (!role) {
      throw new NotFoundException('Role não encontrada');
    }

    const linkedUser = await this.userRepository.findOne({
      where: { role: { id: id } },
    });

    if (linkedUser) {
      throw new ConflictException(
        'Esta role está vinculada a um usuário e não pode ser excluída.',
      );
    }

    try {
      await this.roleRepository.delete(id);
      return { message: 'Role deletada com sucesso', id };
    } catch (error) {
      console.error(
        'Erro inesperado ao tentar deletar a role no banco:',
        error,
      );
      throw new InternalServerErrorException(
        `Ocorreu um erro no servidor ao tentar deletar a role. Detalhe: ${error.message}`,
      );
    }
  }
}
