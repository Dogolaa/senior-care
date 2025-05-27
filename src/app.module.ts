import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './infrastructure/database/database.module';
import { UserModule } from './api/modules/user.module';
import { AddressModule } from './api/modules/address.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UserModule,
    AddressModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
