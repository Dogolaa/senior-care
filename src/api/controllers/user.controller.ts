import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserCommand } from 'src/application/commands/user/createUser.command';
import { DeleteUserCommand } from 'src/application/commands/user/deleteUser.command';
import { UpdateUserCommand } from 'src/application/commands/user/updateUser.command';
import { CreateUserDTO } from 'src/application/dtos/user/createUser.dto';
import { UpdateUserDTO } from 'src/application/dtos/user/updateUser.dto';
import { GetAllUsersQuery } from 'src/application/query/user/getAllUsers.query';
import { ListSpecificUserQuery } from 'src/application/query/user/listSpecificUser.query';
import { User } from 'src/domain/entities/user.entity';

@ApiTags('users')
@Controller('user')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('/create')
  @ApiOperation({ summary: 'Cria um novo usuário' })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso.',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Parâmetros inválidos ou e-mail/CPF já existente.',
  })
  async createUser(@Body() body: CreateUserDTO): Promise<User> {
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
  @ApiOperation({ summary: 'Lista todos os usuários' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários retornada com sucesso.',
    type: [User],
  })
  async getAllUsers(): Promise<User[]> {
    const query = new GetAllUsersQuery();
    return await this.queryBus.execute(query);
  }

  @Get('/:email')
  @ApiOperation({ summary: 'Busca um usuário específico pelo e-mail' })
  @ApiParam({
    name: 'email',
    description: 'E-mail do usuário a ser buscado',
    type: String,
  })
  @ApiResponse({ status: 200, description: 'Usuário encontrado.', type: User })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async listSpecificUser(@Param('email') email: string): Promise<User> {
    const query = new ListSpecificUserQuery(email);
    return await this.queryBus.execute(query);
  }

  @Delete('/delete/:email')
  @ApiOperation({ summary: 'Deleta um usuário pelo e-mail' })
  @ApiParam({
    name: 'email',
    description: 'E-mail do usuário a ser deletado',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário deletado com sucesso.',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Usuário deletado com sucesso.',
        },
        success: {
          type: 'boolean',
          example: true,
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async deleteUser(@Param('email') email: string): Promise<any> {
    const command = new DeleteUserCommand(email);
    return await this.commandBus.execute(command);
  }

  @Patch('/:email')
  @ApiOperation({ summary: 'Atualiza os dados de um usuário' })
  @ApiParam({
    name: 'email',
    description: 'E-mail do usuário a ser atualizado',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso.',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos fornecidos.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async updateUser(
    @Param('email') email: string,
    @Body() body: UpdateUserDTO,
  ): Promise<User> {
    const command = new UpdateUserCommand(email, body);
    return await this.commandBus.execute(command);
  }
}
