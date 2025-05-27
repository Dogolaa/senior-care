import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from 'src/application/commands/user/createUser.command';
import { DeleteUserCommand } from 'src/application/commands/user/deleteUser.command';
import { UpdateUserCommand } from 'src/application/commands/user/updateUser.command';
import { CreateUserDTO } from 'src/application/dtos/user/createUser.dto';
import { UpdateUserDTO } from 'src/application/dtos/user/updateUser.dto';
import { GetAllUsersQuery } from 'src/application/query/user/getAllUsers.query';
import { ListSpecificUserQuery } from 'src/application/query/user/listSpecificUser.query';
import { DeleteUserResponse } from 'src/domain/interfaces/user/deleteUserResponse.interface';

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
  async getAllUsers(): Promise<any> {
    const query = new GetAllUsersQuery();

    return await this.queryBus.execute(query);
  }

  @Get('/:email')
  async listSpecificUser(@Param('email') email: string): Promise<any> {
    const query = new ListSpecificUserQuery(email);

    return await this.queryBus.execute(query);
  }

  @Delete('delete/:email')
  async deleteUser(@Param('email') email: string): Promise<DeleteUserResponse> {
    const command = new DeleteUserCommand(email);

    return await this.commandBus.execute(command);
  }

  @Patch('/:email')
  async updateUser(
    @Param('email') email: string,
    @Body() body: UpdateUserDTO,
  ): Promise<any> {
    const command = new UpdateUserCommand(email, body);
    return await this.commandBus.execute(command);
  }
}
