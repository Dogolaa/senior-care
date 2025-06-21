import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResidentCommand } from 'src/application/commands/resident/deleteResident.command';
import { Resident } from 'src/domain/entities/resident.entity';
import { Repository } from 'typeorm';

@CommandHandler(DeleteResidentCommand)
export class DeleteResidentHandler
  implements ICommandHandler<DeleteResidentCommand>
{
  constructor(
    @InjectRepository(Resident)
    private readonly residentRepository: Repository<Resident>,
  ) {}

  async execute(command: DeleteResidentCommand): Promise<any> {
    const id = command.id;

    try {
      const user = await this.residentRepository.findOneBy({ id });

      if (!user) {
        throw new NotFoundException('Residente não encontrado');
      }

      await this.residentRepository.delete({ id });

      return { message: 'Residente deletado com sucesso', id };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erro ao deletar residente');
    }
  }
}
