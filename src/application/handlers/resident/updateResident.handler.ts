import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateResidentCommand } from 'src/application/commands/resident/updateResident.command';
import { Resident } from 'src/domain/entities/resident.entity';

@CommandHandler(UpdateResidentCommand)
export class UpdateResidentHandler
  implements ICommandHandler<UpdateResidentCommand>
{
  constructor(
    @InjectRepository(Resident)
    private readonly residentRepository: Repository<Resident>,
  ) {}

  async execute(command: UpdateResidentCommand): Promise<any> {
    const { id, updateData } = command;

    const resident = await this.residentRepository.findOneBy({ id });

    if (!resident) {
      throw new NotFoundException('Residente não encontrado');
    }

    Object.assign(resident, updateData);

    try {
      await this.residentRepository.save(resident);
      return { message: 'Residente atualizado com sucesso', resident };
    } catch (error) {
      throw new BadRequestException('Erro ao atualizar residente');
    }
  }
}
