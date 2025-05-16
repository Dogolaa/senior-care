import { Body, Controller, Get, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from 'src/application/commands/user/createUser.command';
import { CreateUserDTO } from 'src/application/dtos/user/createUser.dto';
import { GetAllUsersQuery } from 'src/application/query/user/getAllUsers.query';
import { ResponseCreateUserInterface } from 'src/domain/interfaces/user/responseCreateUser.interface';

@Controller('user')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('/create')
  async createUser(
    @Body() body: CreateUserDTO,
  ): Promise<ResponseCreateUserInterface> {
    const { name, email, cpf, phone, addressId, password, roleId } = body;

    const command = new CreateUserCommand(
      name,
      email,
      cpf,
      phone,
      addressId,
      password,
      roleId,
    );
    return await this.commandBus.execute(command);
  }

  @Get('/')
  async getAllUsers() {
    const query = new GetAllUsersQuery();

    return await this.queryBus.execute(query);
  }
}
