import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateNurseCommand } from 'src/application/commands/nurse/updateNurse.command';
import { Nurse } from 'src/domain/entities/nurse.entity';
import { Repository } from 'typeorm';

@CommandHandler(UpdateNurseCommand)
export class UpdateNurseHandler implements ICommandHandler<UpdateNurseCommand> {
  constructor(
    @InjectRepository(Nurse)
    private readonly nurseRepository: Repository<Nurse>,
  ) {}

  async execute(command: UpdateNurseCommand): Promise<any> {
    try {
      const { id, coren, specialization, shift } = command;

      const nurse = await this.nurseRepository.findOne({
        where: [{ id }],
      });

      if (!nurse) {
        throw new NotFoundException('Enfermeiro(a) não encontrado(a).');
      }

      if (coren && coren !== nurse.coren) {
        const existingCoren = await this.nurseRepository.findOne({
          where: [{ coren }],
        });

        if (existingCoren) {
          throw new ConflictException('COREN já cadastrado no sistema.');
        }
      }

      if (coren !== undefined) {
        nurse.coren = coren;
      }

      if (specialization !== undefined) {
        nurse.specialization = specialization;
      }

      if (shift !== undefined) {
        nurse.shift = shift;
      }

      return await this.nurseRepository.save(nurse);
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Erro ao atualizar enfermeiro(a).',
      );
    }
  }
}
