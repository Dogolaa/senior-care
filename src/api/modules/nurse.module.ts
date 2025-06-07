import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nurse } from 'src/domain/entities/nurse.entity';
import { NurseController } from '../controllers/nurse.controller';
import { CreateNurseHandler } from 'src/application/handlers/nurse/createNurse.handler';
import { User } from 'src/domain/entities/user.entity';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Nurse, User])],
  controllers: [NurseController],
  providers: [CreateNurseHandler],
})
export class NurseModule {}
