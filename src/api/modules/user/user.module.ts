import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from 'src/api/controllers/user/user.controller';
import { CreateUserHandler } from 'src/application/handlers/user/createUser.handler';
import { DeleteUserHandler } from 'src/application/handlers/user/deleteUser.handler';
import { GetAllUsersHandler } from 'src/application/handlers/user/getAllUsers.handler';
import { ListSpecificUserHandler } from 'src/application/handlers/user/listSpecificUser.handler';
import { UpdateUserHandler } from 'src/application/handlers/user/updateUser.handler';
import { User } from 'src/domain/entities/user.entity';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    CreateUserHandler,
    GetAllUsersHandler,
    ListSpecificUserHandler,
    DeleteUserHandler,
    UpdateUserHandler,
  ],
})
export class UserModule {}
