import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteUserCommand } from 'src/application/commands/user/deleteUser.command';
import { User } from 'src/domain/entities/user.entity';
import { Repository } from 'typeorm';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(command: DeleteUserCommand): Promise<any> {
    const email = command.email;

    try {
      const user = await this.userRepository.findOneBy({ email });

      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }

      await this.userRepository.delete({ email });

      return { message: 'Usuário deletado com sucesso', email };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erro ao deletar usuário');
    }
  }
}
