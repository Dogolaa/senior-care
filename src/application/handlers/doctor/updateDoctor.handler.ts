import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateDoctorCommand } from 'src/application/commands/doctor/updateDoctor.command';
import { Doctor } from 'src/domain/entities/doctor.entity';
import { Repository } from 'typeorm';

@CommandHandler(UpdateDoctorCommand)
export class UpdateDoctorHandler
  implements ICommandHandler<UpdateDoctorCommand>
{
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  async execute(command: UpdateDoctorCommand): Promise<any> {
    try {
      const { id, crm, specialization, shift } = command;

      const nurse = await this.doctorRepository.findOne({
        where: [{ id }],
      });

      if (!nurse) {
        throw new NotFoundException('Médico(a) não encontrado(a).');
      }

      if (crm && crm !== nurse.crm) {
        const existingCoren = await this.doctorRepository.findOne({
          where: [{ crm }],
        });

        if (existingCoren) {
          throw new ConflictException('CRM já cadastrado no sistema.');
        }
      }

      if (crm !== undefined) {
        nurse.crm = crm;
      }

      if (specialization !== undefined) {
        nurse.specialization = specialization;
      }

      if (shift !== undefined) {
        nurse.shift = shift;
      }

      return await this.doctorRepository.save(nurse);
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Erro ao atualizar médico(a).',
      );
    }
  }
}
