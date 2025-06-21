import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResidentController } from '../controllers/resident.controller';
import { Resident } from 'src/domain/entities/resident.entity';
import { CreateResidentHandler } from 'src/application/handlers/resident/createResident.handler';
import { GetAllResidentsHandler } from 'src/application/handlers/resident/getAllResidents.handler';
import { ListSpecificResidentHandler } from 'src/application/handlers/resident/listSpecificResident.handler';
import { DeleteResidentHandler } from 'src/application/handlers/resident/deleteResident.handler';
import { UpdateResidentHandler } from 'src/application/handlers/resident/updateResident.handler';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Resident])],
  controllers: [ResidentController],
  providers: [
    CreateResidentHandler,
    GetAllResidentsHandler,
    ListSpecificResidentHandler,
    DeleteResidentHandler,
    UpdateResidentHandler,
  ],
})
export class ResidentModule {}
