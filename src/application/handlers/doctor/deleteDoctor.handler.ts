import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteDoctorCommand } from 'src/application/commands/doctor/deleteDoctor.command';
import { Doctor } from 'src/domain/entities/doctor.entity';
import { Repository } from 'typeorm';

@CommandHandler(DeleteDoctorCommand)
export class DeleteDoctorHandler
  implements ICommandHandler<DeleteDoctorCommand>
{
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  async execute(command: DeleteDoctorCommand): Promise<any> {
    try {
      const { id } = command;

      const existingDoctor = await this.doctorRepository.find({
        where: [{ id }],
      });

      if (!existingDoctor) {
        throw new NotFoundException('Médico(a) não encontrado(a).');
      }

      await this.doctorRepository.delete({ id });

      return { message: 'Médico(a) deletado com sucesso', id };
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Erro ao deletar médico(a).',
      );
    }
  }
}
