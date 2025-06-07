import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nurse } from 'src/domain/entities/nurse.entity';
import { NurseController } from '../controllers/nurse.controller';
import { CreateNurseHandler } from 'src/application/handlers/nurse/createNurse.handler';
import { User } from 'src/domain/entities/user.entity';
import { GetAllNursesHandler } from 'src/application/handlers/nurse/getAllNurses.handler';
import { ListSpecificNurseHandler } from 'src/application/handlers/nurse/listSpecificNurse.handler';
import { DeleteNurseHandler } from 'src/application/handlers/nurse/deleteNurse.handler';
import { UpdateNurseHandler } from 'src/application/handlers/nurse/updateNurse.handler';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Nurse, User])],
  controllers: [NurseController],
  providers: [
    CreateNurseHandler,
    GetAllNursesHandler,
    ListSpecificNurseHandler,
    DeleteNurseHandler,
    UpdateNurseHandler,
  ],
})
export class NurseModule {}
