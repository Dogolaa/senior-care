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
import { CreateRoleCommand } from 'src/application/commands/role/createRole.command';
import { DeleteRoleCommand } from 'src/application/commands/role/deleteRole.command';
import { UpdateRoleCommand } from 'src/application/commands/role/updateRole.command';
import { CreateRoleDTO } from 'src/application/dtos/role/createRole.dto';
import { UpdateRoleDTO } from 'src/application/dtos/role/updateRole.dto';
import { GetAllRolesQuery } from 'src/application/query/role/getAllRoles.query';
import { ListSpecificRoleQuery } from 'src/application/query/role/listSpecificRole.query';

@Controller('role')
export class RoleController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('/create')
  async createRole(@Body() body: CreateRoleDTO): Promise<any> {
    const { name } = body;

    const command = new CreateRoleCommand(name);
    return await this.commandBus.execute(command);
  }

  @Get('/')
  async getAllRoles(): Promise<any> {
    const query = new GetAllRolesQuery();

    return await this.queryBus.execute(query);
  }

  @Get('/:id')
  async listSpecificUser(@Param('id') id: string): Promise<any> {
    const query = new ListSpecificRoleQuery(id);

    return await this.queryBus.execute(query);
  }

  @Delete('delete/:id')
  async deleteRole(@Param('id') id: string): Promise<any> {
    const command = new DeleteRoleCommand(id);

    return await this.commandBus.execute(command);
  }

  @Patch('/:id')
  async updateRole(
    @Param('id') id: string,
    @Body() body: UpdateRoleDTO,
  ): Promise<any> {
    const { name } = body;
    const command = new UpdateRoleCommand(id, name);
    return await this.commandBus.execute(command);
  }
}
