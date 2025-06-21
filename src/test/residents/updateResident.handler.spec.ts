import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UpdateResidentCommand } from 'src/application/commands/resident/updateResident.command';
import { Gender } from 'src/application/dtos/resident/createResident.dto';
import { UpdateResidentHandler } from 'src/application/handlers/resident/updateResident.handler';
import { Resident } from 'src/domain/entities/resident.entity';
import { Repository } from 'typeorm';

const mockResident = {
  id: '7dea1211-20a0-440a-947a-e899dcd25505',
  name: 'João da Silva',
  cpf: '852.275.930-86',
  dateOfBirth: '2020-08-20',
  gender: Gender.MALE,
  admissionDate: '2021-08-09',
} as Resident;

const updateData = {
  name: 'Lucas Dogo',
  cpf: '50894118838',
};

describe('UpdateResidentHandler', () => {
  let handler: UpdateResidentHandler;
  let residentRepository: Repository<Resident>;

  const mockResidentRepository = {
    findOneBy: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateResidentHandler,
        {
          provide: getRepositoryToken(Resident),
          useValue: mockResidentRepository,
        },
      ],
    }).compile();

    handler = module.get<UpdateResidentHandler>(UpdateResidentHandler);
    residentRepository = module.get<Repository<Resident>>(
      getRepositoryToken(Resident),
    );
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
    expect(residentRepository).toBeDefined();
  });

  describe('execute', () => {
    // --- HAPPY PATH ---
    it('✅ deve retornar um objeto confirmando o update de um residente com sucesso', async () => {
      const command = new UpdateResidentCommand(
        '7dea1211-20a0-440a-947a-e899dcd25505',
        updateData,
      );

      const updatedResident = {
        ...mockResident,
        ...updateData,
      };

      const expectedResult = {
        message: 'Residente atualizado com sucesso',
        resident: updatedResident,
      };

      mockResidentRepository.findOneBy.mockResolvedValue(mockResident);
      mockResidentRepository.save.mockResolvedValue(updatedResident);

      const result = await handler.execute(command);

      expect(result).toEqual(expectedResult);

      expect(mockResidentRepository.findOneBy).toHaveBeenCalledTimes(1);
      expect(mockResidentRepository.findOneBy).toHaveBeenCalledWith({
        id: command.id,
      });

      expect(mockResidentRepository.save).toHaveBeenCalledTimes(1);
      expect(mockResidentRepository.save).toHaveBeenCalledWith(updatedResident);
    });

    it('❌ deve lançar NotFoundException se o residente não for encontrado', async () => {
      const command = new UpdateResidentCommand(
        '7dea1211-20a0-440a-947a-e899dcd25504',
        updateData,
      );

      mockResidentRepository.findOneBy.mockResolvedValue(null);

      await expect(handler.execute(command)).rejects.toThrow(
        new NotFoundException('Residente não encontrado'),
      );
      expect(mockResidentRepository.save).not.toHaveBeenCalled();
    });

    it('❌ deve lançar BadRequestExecption se o residente não for encontrado', async () => {
      const command = new UpdateResidentCommand(
        '7dea1211-20a0-440a-947a-e899dcd25505',
        updateData,
      );

      mockResidentRepository.findOneBy.mockResolvedValue(mockResident);
      mockResidentRepository.save.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(handler.execute(command)).rejects.toThrow(
        new BadRequestException('Erro ao atualizar residente'),
      );
    });
  });
});
