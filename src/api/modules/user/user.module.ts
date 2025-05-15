import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from 'src/api/controllers/user/user.controller';
import { CreateUserHandler } from 'src/application/handlers/user/createUser.handler';
import { User } from 'src/domain/entities/user.entity';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [CreateUserHandler],
})
export class UserModule {}
