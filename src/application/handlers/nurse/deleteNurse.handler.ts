import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteNurseCommand } from 'src/application/commands/nurse/deleteNurse.command';
import { Nurse } from 'src/domain/entities/nurse.entity';
import { Repository } from 'typeorm';

@CommandHandler(DeleteNurseCommand)
export class DeleteNurseHandler implements ICommandHandler<DeleteNurseCommand> {
  constructor(
    @InjectRepository(Nurse)
    private readonly nurseRepository: Repository<Nurse>,
  ) {}

  async execute(command: DeleteNurseCommand): Promise<any> {
    try {
      const { id } = command;

      const existingNurse = await this.nurseRepository.find({
        where: [{ id }],
      });

      if (!existingNurse) {
        throw new NotFoundException('Enfermeiro(a) não encontrado(a).');
      }

      await this.nurseRepository.delete({ id });

      return { message: 'Enfermeiro(a) deletado com sucesso', id };
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Erro ao deletar enfermeiro(a).',
      );
    }
  }
}
