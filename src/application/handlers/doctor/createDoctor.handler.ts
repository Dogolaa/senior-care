import { BadRequestException, ConflictException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDoctorCommand } from 'src/application/commands/doctor/createDoctor.command';
import { Doctor } from 'src/domain/entities/doctor.entity';
import { User } from 'src/domain/entities/user.entity';
import { Repository } from 'typeorm';

@CommandHandler(CreateDoctorCommand)
export class CreateDoctorHandler
  implements ICommandHandler<CreateDoctorCommand>
{
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(command: CreateDoctorCommand): Promise<any> {
    try {
      const { userId, crm, specialization, shift } = command;

      const existingUser = await this.userRepository.findOne({
        where: [{ id: userId }],
      });

      if (!existingUser) {
        throw new ConflictException('User não cadastrado no sistema');
      }

      const existingDoctor = await this.doctorRepository.findOne({
        where: [{ crm }],
      });

      if (existingDoctor) {
        throw new ConflictException('CRM já cadastrado no sistema');
      }

      const doctor = this.doctorRepository.create({
        user: userId,
        crm,
        specialization,
        shift,
      });

      return await this.doctorRepository.save(doctor);
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Erro ao criar médico. Por favor, tente novamente.',
      );
    }
  }
}
