import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  NotFoundException,
  Injectable,
  ConflictException,
} from '@nestjs/common';
import { UpdateRoleCommand } from 'src/application/commands/role/updateRole.command';
import { Role } from 'src/domain/entities/role.entity';

@Injectable()
@CommandHandler(UpdateRoleCommand)
export class UpdateRoleHandler implements ICommandHandler<UpdateRoleCommand> {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async execute(
    command: UpdateRoleCommand,
  ): Promise<{ message: string; role: Role }> {
    const { id, name } = command;

    const role = await this.roleRepository.findOneBy({ id });

    const formattedName = name.toUpperCase();

    const existingName = await this.roleRepository.findOneBy({
      name: formattedName,
    });

    if (!role) {
      throw new NotFoundException('Role não encontrada');
    }

    if (existingName) {
      throw new ConflictException('Nome já utilizado por outra role');
    }

    if (name !== undefined) {
      role.name = formattedName;
    }

    try {
      const updatedRole = await this.roleRepository.save(role);
      return {
        message: 'Role atualizada com sucesso',
        role: updatedRole,
      };
    } catch (error) {
      console.error('Erro ao atualizar role:', error);
      throw new BadRequestException(
        `Erro ao atualizar role. Detalhes: ${error.message || 'Erro desconhecido'}`,
      );
    }
  }
}
