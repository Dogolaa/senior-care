import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteAddressCommand } from 'src/application/commands/address/deleteAddress.command';
import { Address } from 'src/domain/entities/address.entity';
import { User } from 'src/domain/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
@CommandHandler(DeleteAddressCommand)
export class DeleteAddressHandler
  implements ICommandHandler<DeleteAddressCommand>
{
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(
    command: DeleteAddressCommand,
  ): Promise<{ message: string; id: string }> {
    const { id } = command;

    const address = await this.addressRepository.findOneBy({ id });

    if (!address) {
      throw new NotFoundException('Endereço não encontrado');
    }

    const linkedUser = await this.userRepository.findOne({
      where: { address: { id: id } },
    });

    if (linkedUser) {
      throw new ConflictException(
        'Este endereço está vinculado a um usuário e não pode ser excluído.',
      );
    }

    try {
      await this.addressRepository.delete(id);
      return { message: 'Endereço deletado com sucesso', id };
    } catch (error) {
      console.error(
        'Erro inesperado ao tentar deletar o endereço no banco:',
        error,
      );
      throw new InternalServerErrorException(
        `Ocorreu um erro no servidor ao tentar deletar o endereço. Detalhe: ${error.message}`,
      );
    }
  }
}
