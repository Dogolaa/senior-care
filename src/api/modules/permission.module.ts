import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from 'src/domain/entities/permissions.entity';
import { CreatePermissionHandler } from 'src/application/handlers/permissions/createPermissions.handler';
import { PermissionController } from '../controllers/permissions.controller';
import { GetAllPermissionsHandler } from 'src/application/handlers/permissions/getAllPermissions.handler';
import { ListSpecificPermissionHandler } from 'src/application/handlers/permissions/listSpecificPermission.handler';
import { DeletePermissionHandler } from 'src/application/handlers/permissions/deletePermission.handler';
import { UpdatePermissionHandler } from 'src/application/handlers/permissions/updatePermission.handler';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Permission])],
  controllers: [PermissionController],
  providers: [
    CreatePermissionHandler,
    GetAllPermissionsHandler,
    ListSpecificPermissionHandler,
    DeletePermissionHandler,
    UpdatePermissionHandler,
  ],
})
export class PermissionModule {}
