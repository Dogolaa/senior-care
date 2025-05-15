import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from 'src/application/commands/user/createUser.command';
import { CreateUserDTO } from 'src/application/dtos/user/createUser.dto';
import { ResponseCreateUserInterface } from 'src/domain/interfaces/user/responseCreateUser.interface';

@Controller('user')
export class UserController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('/create')
  async createUser(
    @Body() body: CreateUserDTO,
  ): Promise<ResponseCreateUserInterface> {
    const { name, email, phone, addressId, password, roleId } = body;

    const command = new CreateUserCommand(
      name,
      email,
      phone,
      addressId,
      password,
      roleId,
    );
    return await this.commandBus.execute(command);
  }
}
