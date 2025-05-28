import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoleCommand } from 'src/application/commands/role/createRole.command';
import { Role } from 'src/domain/entities/role.entity';
import { Repository } from 'typeorm';

@CommandHandler(CreateRoleCommand)
export class CreateRoleHandler implements ICommandHandler<CreateRoleCommand> {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async execute(command: CreateRoleCommand): Promise<any> {
    try {
      const { name } = command;

      const formattedName = name.toUpperCase();

      const existingRole = await this.roleRepository.findOne({
        where: [{ name: formattedName }],
      });

      if (existingRole) {
        throw new BadRequestException(
          'Nome de role já em uso. Por favor, tente novamente com outros dados.',
        );
      }

      const role = this.roleRepository.create({
        name: formattedName,
      });

      await this.roleRepository.save(role);

      return {
        message: 'Role criada com sucesso',
        role: {
          name: role.name,
        },
      };
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Erro ao criar role. Por favor, tente novamente.',
      );
    }
  }
}
