import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateAddressCommand } from 'src/application/commands/address/createAddress.command';
import { DeleteAddressCommand } from 'src/application/commands/address/deleteAddress.command';
import { UpdateAddressCommand } from 'src/application/commands/address/updateAddress.command';
import { CreateUserCommand } from 'src/application/commands/user/createUser.command';
import { DeleteUserCommand } from 'src/application/commands/user/deleteUser.command';
import { UpdateUserCommand } from 'src/application/commands/user/updateUser.command';
import { CreateAddressDTO } from 'src/application/dtos/address/createAddress.dto';
import { UpdateAddressDTO } from 'src/application/dtos/address/updateAddress.dto';
import { CreateUserDTO } from 'src/application/dtos/user/createUser.dto';
import { UpdateUserDTO } from 'src/application/dtos/user/updateUser.dto';
import { GetAllAddressQuery } from 'src/application/query/address/getAllAddress.query';
import { ListSpecificAddressQuery } from 'src/application/query/address/listSpecificAddress.query';
import { GetAllUsersQuery } from 'src/application/query/user/getAllUsers.query';
import { ListSpecificUserQuery } from 'src/application/query/user/listSpecificUser.query';
import { DeleteUserResponse } from 'src/domain/interfaces/user/deleteUserResponse.interface';

@Controller('address')
export class AddressController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('/create')
  async createUser(@Body() body: CreateAddressDTO): Promise<any> {
    const { cep, country, state, city, district, street, number, complement } =
      body;

    const command = new CreateAddressCommand(
      cep,
      country,
      state,
      city,
      district,
      street,
      number,
      complement,
    );
    return await this.commandBus.execute(command);
  }

  @Get('/')
  async getAllAddress(): Promise<any> {
    const query = new GetAllAddressQuery();

    return await this.queryBus.execute(query);
  }

  @Get('/:id')
  async listSpecificAddress(@Param('id') id: string): Promise<any> {
    const query = new ListSpecificAddressQuery(id);
    return await this.queryBus.execute(query);
  }

  @Delete('delete/:id')
  async deleteAddress(@Param('id') id: string): Promise<any> {
    const command = new DeleteAddressCommand(id);

    return await this.commandBus.execute(command);
  }

  @Patch('/:id')
  async updateAddress(
    @Param('id') id: string,
    @Body() body: UpdateAddressDTO,
  ): Promise<any> {
    const { cep, country, state, city, district, street, number, complement } =
      body;
    const command = new UpdateAddressCommand(
      id,
      cep,
      country,
      state,
      city,
      district,
      street,
      number,
      complement,
    );
    return await this.commandBus.execute(command);
  }
}
