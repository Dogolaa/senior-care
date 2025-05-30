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
import { CreatePermissionCommand } from 'src/application/commands/permissions/createPermission.command';
import { DeletePermissionCommand } from 'src/application/commands/permissions/deletePermission.command';
import { UpdatePermissionCommand } from 'src/application/commands/permissions/updatePermission.command';
import { CreatePermissionDTO } from 'src/application/dtos/permissions/createPermission.dto';
import { UpdatePermissionDTO } from 'src/application/dtos/permissions/updatePermission.dto';
import { GetAllPermissionsQuery } from 'src/application/query/permissions/getAllPermissions.query';
import { ListSpecificPermissionQuery } from 'src/application/query/permissions/listSpecificPermission.query';

@Controller('permissions')
export class PermissionController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('/create')
  async createPermission(@Body() body: CreatePermissionDTO): Promise<any> {
    const { permissionName } = body;

    const command = new CreatePermissionCommand(permissionName);
    return await this.commandBus.execute(command);
  }

  @Get('/')
  async getAllPermissions(): Promise<any> {
    const query = new GetAllPermissionsQuery();

    return await this.queryBus.execute(query);
  }

  @Get('/:id')
  async listSpecificPermission(@Param('id') id: string): Promise<any> {
    const query = new ListSpecificPermissionQuery(id);

    return await this.queryBus.execute(query);
  }

  @Delete('delete/:id')
  async deletePermission(@Param('id') id: string): Promise<any> {
    const command = new DeletePermissionCommand(id);

    return await this.commandBus.execute(command);
  }

  @Patch('/:id')
  async updatePermission(
    @Param('id') id: string,
    @Body() body: UpdatePermissionDTO,
  ): Promise<any> {
    const { permissionName } = body;
    const command = new UpdatePermissionCommand(id, permissionName);
    return await this.commandBus.execute(command);
  }
}
