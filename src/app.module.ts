import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './infrastructure/database/database.module';
import { UserModule } from './api/modules/user.module';
import { AddressModule } from './api/modules/address.module';
import { RoleModule } from './api/modules/role.module';
import { PermissionModule } from './api/modules/permission.module';
import { NurseModule } from './api/modules/nurse.module';
import { DoctorModule } from './api/modules/doctor.module';
import { ResidentModule } from './api/modules/resident.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UserModule,
    AddressModule,
    RoleModule,
    PermissionModule,
    NurseModule,
    DoctorModule,
    ResidentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
