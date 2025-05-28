import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from '../controllers/role.controller';
import { Role } from 'src/domain/entities/role.entity';
import { CreateRoleHandler } from 'src/application/handlers/role/createRole.handler';
import { GetAllRolesHandler } from 'src/application/handlers/role/getAllRoles.handler';
import { ListSpecificRoleHandler } from 'src/application/handlers/role/listSpecificRole.handler';
import { DeleteRoleHandler } from 'src/application/handlers/role/deleteRole.handler';
import { User } from 'src/domain/entities/user.entity';
import { UpdateRoleHandler } from 'src/application/handlers/role/updateRole.handler';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Role, User])],
  controllers: [RoleController],
  providers: [
    CreateRoleHandler,
    GetAllRolesHandler,
    ListSpecificRoleHandler,
    DeleteRoleHandler,
    UpdateRoleHandler,
  ],
})
export class RoleModule {}
