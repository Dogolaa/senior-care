import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAddressCommand } from 'src/application/commands/address/createAddress.command';
import { Address } from 'src/domain/entities/address.entity';

@CommandHandler(CreateAddressCommand)
export class CreateAddressHandler
  implements ICommandHandler<CreateAddressCommand>
{
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async execute(command: CreateAddressCommand): Promise<any> {
    try {
      const {
        cep,
        country,
        state,
        city,
        district,
        street,
        number,
        complement,
      } = command;

      const address = this.addressRepository.create({
        cep,
        country,
        state,
        city,
        district,
        street,
        number,
        complement,
      });

      return await this.addressRepository.save(address);
    } catch (error) {
      throw new BadRequestException(
        error.message ||
          'Erro ao criar o endereço. Por favor, tente novamente.',
      );
    }
  }
}
