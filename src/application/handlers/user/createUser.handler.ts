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
      const { name, email, phone, addressId, password, roleId } = command;

      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const user = this.userRepository.create({
        name,
        email,
        phone,
        addressId,
        password: hashedPassword,
        roleId,
      });

      return await this.userRepository.save(user);
    } catch {
      throw new BadRequestException();
    }
  }
}
