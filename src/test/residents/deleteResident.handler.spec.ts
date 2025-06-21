import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResidentCommand } from 'src/application/commands/resident/deleteResident.command';
import { Gender } from 'src/application/dtos/resident/createResident.dto';
import { DeleteResidentHandler } from 'src/application/handlers/resident/deleteResident.handler';
import { Resident } from 'src/domain/entities/resident.entity';
import { Repository } from 'typeorm';

const mockResident = {
  name: 'João da Silva',
  cpf: 'john.doe@example.com',
  dateOfBirth: '2001-09-14',
  gender: Gender.MALE,
  admissionDate: '2025-09-14',
} as Resident;

describe('DeleteResidentHandler', () => {
  let handler: DeleteResidentHandler;
  let residentRepository: Repository<Resident>;

  const mockResidentRepository = {
    findOneBy: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteResidentHandler,
        {
          provide: getRepositoryToken(Resident),
          useValue: mockResidentRepository,
        },
      ],
    }).compile();

    handler = module.get<DeleteResidentHandler>(DeleteResidentHandler);
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
    it('✅ deve retornar um objeto confirmando o delete de um residente com sucesso', async () => {
      const command = new DeleteResidentCommand(
        'd9ab0c94-f25b-4866-91e5-3476bb0bd280',
      );
      const expectedResult = {
        message: 'Residente deletado com sucesso',
        id: 'd9ab0c94-f25b-4866-91e5-3476bb0bd280',
      };

      mockResidentRepository.findOneBy.mockResolvedValue(mockResident);
      mockResidentRepository.delete.mockResolvedValue({});

      const result = await handler.execute(command);

      expect(result).toEqual(expectedResult);

      expect(mockResidentRepository.findOneBy).toHaveBeenCalledTimes(1);
      expect(mockResidentRepository.findOneBy).toHaveBeenCalledWith({
        id: command.id,
      });

      expect(mockResidentRepository.delete).toHaveBeenCalledTimes(1);
      expect(mockResidentRepository.delete).toHaveBeenCalledWith({
        id: command.id,
      });
    });
    // --- SAD PATH ---
    it('❌ deve lançar NotFoundException se o residente não for encontrado', async () => {
      const command = new DeleteResidentCommand(
        'd9ab0c94-f25b-4866-91e5-3476bb0bd280',
      );

      mockResidentRepository.findOneBy.mockResolvedValue(null);

      await expect(handler.execute(command)).rejects.toThrow(
        new NotFoundException('Residente não encontrado'),
      );
      expect(mockResidentRepository.delete).not.toHaveBeenCalled();
    });

    it('❌ deve lançar BadRequestExecption se o residente não for encontrado', async () => {
      const command = new DeleteResidentCommand(
        'd9ab0c94-f25b-4866-91e5-3476bb0bd290',
      );

      mockResidentRepository.findOneBy.mockResolvedValue(mockResident);
      mockResidentRepository.delete.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(handler.execute(command)).rejects.toThrow(
        new BadRequestException('Erro ao deletar residente'),
      );
    });
  });
});
