import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/domain/entities/user.entity';
import { Doctor } from 'src/domain/entities/doctor.entity';
import { DoctorController } from '../controllers/doctor.controller';
import { CreateDoctorHandler } from 'src/application/handlers/doctor/createDoctor.handler';
import { GetAllDoctorsHandler } from 'src/application/handlers/doctor/getAllDoctors.handler';
import { ListSpecificDoctorHandler } from 'src/application/handlers/doctor/listSpecificDoctor.handler';
import { DeleteDoctorHandler } from 'src/application/handlers/doctor/deleteDoctor.handler';
import { UpdateDoctorHandler } from 'src/application/handlers/doctor/updateDoctor.handler';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Doctor, User])],
  controllers: [DoctorController],
  providers: [
    CreateDoctorHandler,
    GetAllDoctorsHandler,
    ListSpecificDoctorHandler,
    DeleteDoctorHandler,
    UpdateDoctorHandler,
  ],
})
export class DoctorModule {}
