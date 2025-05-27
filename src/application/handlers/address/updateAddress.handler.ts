import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { UpdateAddressCommand } from 'src/application/commands/address/updateAddress.command';
import { Address } from 'src/domain/entities/address.entity';

@Injectable()
@CommandHandler(UpdateAddressCommand)
export class UpdateAddressHandler
  implements ICommandHandler<UpdateAddressCommand>
{
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async execute(
    command: UpdateAddressCommand,
  ): Promise<{ message: string; address: Address }> {
    const {
      id,
      cep,
      country,
      state,
      city,
      district,
      street,
      number,
      complement,
    } = command;

    const address = await this.addressRepository.findOneBy({ id });

    if (!address) {
      throw new NotFoundException('Endereço não encontrado');
    }

    if (cep !== undefined) {
      address.cep = cep;
    }
    if (country !== undefined) {
      address.country = country;
    }
    if (state !== undefined) {
      address.state = state;
    }
    if (city !== undefined) {
      address.city = city;
    }
    if (district !== undefined) {
      address.district = district;
    }
    if (street !== undefined) {
      address.street = street;
    }
    if (number !== undefined) {
      address.number = number;
    }
    if (command.hasOwnProperty('complement')) {
      address.complement = complement;
    }

    try {
      const updatedAddress = await this.addressRepository.save(address);
      return {
        message: 'Endereço atualizado com sucesso',
        address: updatedAddress,
      };
    } catch (error) {
      console.error('Erro ao atualizar endereço:', error);
      throw new BadRequestException(
        `Erro ao atualizar endereço. Detalhes: ${error.message || 'Erro desconhecido'}`,
      );
    }
  }
}
