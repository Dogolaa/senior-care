import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserCommand } from 'src/application/commands/user/createUser.command';
import { User } from 'src/domain/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(command: CreateUserCommand): Promise<any> {
    try {
      const saltRounds = 10;
      const { name, email, cpf, phone, addressId, password, roleId } = command;

      const existingUser = await this.userRepository.findOne({
        where: [{ email }, { cpf }],
      });

      if (existingUser) {
        throw new BadRequestException(
          'Email ou CPF já estão em uso. Por favor, tente novamente com outros dados.',
        );
      }

      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const user = this.userRepository.create({
        name,
        email,
        cpf,
        phone,
        addressId,
        password: hashedPassword,
        roleId,
      });

      await this.userRepository.save(user);

      return {
        message: 'Usuário criado com sucesso',
        user: {
          name: user.name,
          email: user.email,
          cpf: user.cpf,
        },
      };
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Erro ao criar o usuário. Por favor, tente novamente.',
      );
    }
  }
}
