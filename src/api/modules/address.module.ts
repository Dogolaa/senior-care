import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateAddressHandler } from 'src/application/handlers/address/createAddress.handler';
import { Address } from 'src/domain/entities/address.entity';
import { AddressController } from '../controllers/address.controller';
import { GetAllAddressHandler } from 'src/application/handlers/address/getAllAddress.handler';
import { ListSpecificAddressHandler } from 'src/application/handlers/address/listSpecificAddress.handler';
import { DeleteAddressHandler } from 'src/application/handlers/address/deleteAddress.handler';
import { User } from 'src/domain/entities/user.entity';
import { UpdateAddressHandler } from 'src/application/handlers/address/updateAddress.handler';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Address, User])],
  controllers: [AddressController],
  providers: [
    CreateAddressHandler,
    GetAllAddressHandler,
    ListSpecificAddressHandler,
    DeleteAddressHandler,
    UpdateAddressHandler,
  ],
})
export class AddressModule {}
