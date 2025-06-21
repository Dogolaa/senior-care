import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateResidentCommand } from 'src/application/commands/resident/createResident.command';
import { Resident } from 'src/domain/entities/resident.entity';

@CommandHandler(CreateResidentCommand)
export class CreateResidentHandler
  implements ICommandHandler<CreateResidentCommand>
{
  constructor(
    @InjectRepository(Resident)
    private readonly residentRepository: Repository<Resident>,
  ) {}

  async execute(command: CreateResidentCommand): Promise<any> {
    try {
      const { name, cpf, dateOfBirth, gender, admissionDate } = command;

      const existingResident = await this.residentRepository.findOne({
        where: [{ cpf }],
      });

      if (existingResident) {
        throw new BadRequestException(
          'CPF já estão em uso. Por favor, tente novamente com outros dados.',
        );
      }

      const resident = this.residentRepository.create({
        name,
        cpf,
        dateOfBirth,
        gender,
        admissionDate,
      });

      await this.residentRepository.save(resident);

      return {
        message: 'Residente criado com sucesso',
        resident: {
          name: resident.name,
          cpf: resident.cpf,
        },
      };
    } catch (error) {
      throw new BadRequestException(
        error.message ||
          'Erro ao criar o residente. Por favor, tente novamente.',
      );
    }
  }
}
