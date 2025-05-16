import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from 'src/application/commands/user/createUser.command';
import { DeleteUserCommand } from 'src/application/commands/user/deleteUser.command';
import { CreateUserDTO } from 'src/application/dtos/user/createUser.dto';
import { GetAllUsersQuery } from 'src/application/query/user/getAllUsers.query';
import { ListSpecificUserQuery } from 'src/application/query/user/listSpecificUser.query';
import { ResponseCreateUserInterface } from 'src/domain/interfaces/user/responseCreateUser.interface';

@Controller('user')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('/create')
  async createUser(@Body() body: CreateUserDTO): Promise<any> {
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

  @Put('/:email')
  async listSpecificUser(@Param('email') email: string) {
    const query = new ListSpecificUserQuery(email);

    return await this.queryBus.execute(query);
  }

  @Delete('/:email')
  async deleteUser(@Param('email') email: string) {
    const command = new DeleteUserCommand(email);

    return await this.commandBus.execute(command);
  }
}
