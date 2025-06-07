import { BadRequestException, ConflictException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNurseCommand } from 'src/application/commands/nurse/createNurse.command';
import { Nurse } from 'src/domain/entities/nurse.entity';
import { User } from 'src/domain/entities/user.entity';
import { Repository } from 'typeorm';

@CommandHandler(CreateNurseCommand)
export class CreateNurseHandler implements ICommandHandler<CreateNurseCommand> {
  constructor(
    @InjectRepository(Nurse)
    private readonly nurseRepository: Repository<Nurse>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(command: CreateNurseCommand): Promise<any> {
    try {
      const { userId, coren, specialization, shift } = command;

      const existingUser = await this.userRepository.findOne({
        where: [{ id: userId }],
      });

      if (!existingUser) {
        throw new ConflictException('User não cadastrado no sistema');
      }

      const existingNurse = await this.nurseRepository.findOne({
        where: [{ coren }],
      });

      if (existingNurse) {
        throw new ConflictException('COREN já cadastrado no sistema');
      }

      const nurse = this.nurseRepository.create({
        user: userId,
        coren,
        specialization,
        shift,
      });

      return await this.nurseRepository.save(nurse);
    } catch (error) {
      throw new BadRequestException(
        error.message ||
          'Erro ao criar enfermeira. Por favor, tente novamente.',
      );
    }
  }
}
