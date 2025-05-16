import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/domain/entities/user.entity';
import { UpdateUserCommand } from 'src/application/commands/user/updateUser.command';
import { BadRequestException, NotFoundException } from '@nestjs/common';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(command: UpdateUserCommand): Promise<any> {
    const { email, updateData } = command;

    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    Object.assign(user, updateData);

    try {
      await this.userRepository.save(user);
      return { message: 'Usuário atualizado com sucesso', user };
    } catch (error) {
      throw new BadRequestException('Erro ao atualizar usuário');
    }
  }
}
