import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Gender } from 'src/application/dtos/resident/createResident.dto';
import { ListSpecificResidentHandler } from 'src/application/handlers/resident/listSpecificResident.handler';
import { ListSpecificResidentQuery } from 'src/application/query/resident/listSpecificResident.query';
import { Resident } from 'src/domain/entities/resident.entity';
import { Repository } from 'typeorm';

// Mock dos dados que esperamos que o repositório retorne
const mockResident: Partial<Resident>[] = [
  {
    name: 'João da Silva',
    cpf: '852.275.930-86',
    dateOfBirth: '2001-09-14',
    gender: Gender.MALE,
    admissionDate: '2025-09-15',
  },
  {
    name: 'Joana da Silva',
    cpf: '997.841.770-21',
    dateOfBirth: '2001-09-14',
    gender: Gender.FEMALE,
    admissionDate: '2025-09-15',
  },
];

describe('ListSpecificResidentHandler', () => {
  let handler: ListSpecificResidentHandler;
  let residentRepository: Repository<Resident>;

  const mockResidentRepository = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    // Limpa os mocks antes de cada teste para garantir a independência dos testes
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListSpecificResidentHandler,
        {
          provide: getRepositoryToken(Resident),
          useValue: mockResidentRepository, // Usa o mock em vez do repositório real
        },
      ],
    }).compile();

    handler = module.get<ListSpecificResidentHandler>(
      ListSpecificResidentHandler,
    );
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
    it('✅ deve retornar um array com um residente com sucesso', async () => {
      // Arrange: Configuração do cenário de teste
      const query = new ListSpecificResidentQuery(
        '7dea1211-20a0-440a-947a-e899dcd25505',
      );
      // Simula o repositório retornando a lista de usuários mockada com sucesso
      mockResidentRepository.find.mockResolvedValue(mockResident);

      // Act: Execução do método a ser testado
      const result = await handler.execute(query);

      expect(result).toEqual(mockResident);
      // 2. O método 'find' do repositório deve ter sido chamado uma vez
      expect(mockResidentRepository.find).toHaveBeenCalledTimes(1);
      // 3. Verifica se 'find' foi chamado com os parâmetros corretos (select e relations)
      expect(mockResidentRepository.find).toHaveBeenCalledWith({
        select: ['id', 'name', 'cpf', 'dateOfBirth', 'gender', 'admissionDate'],
        where: [{ id: '7dea1211-20a0-440a-947a-e899dcd25505' }],
      });
    });

    // --- SAD PATH ---
    it('❌ deve retornar um array vazio se o residente não for encontrado', async () => {
      const query = new ListSpecificResidentQuery(
        '7dea1211-20a0-440a-947a-e899dcd25504',
      );

      mockResidentRepository.find.mockResolvedValue([]);

      const result = await handler.execute(query);

      expect(result).toEqual([]);

      expect(mockResidentRepository.find).toHaveBeenCalledWith({
        select: ['id', 'name', 'cpf', 'dateOfBirth', 'gender', 'admissionDate'],
        where: [{ id: '7dea1211-20a0-440a-947a-e899dcd25504' }],
      });
    });

    it('❌ deve lançar uma BadRequestException se o repositório falhar', async () => {
      // Arrange
      const query = new ListSpecificResidentQuery(
        '7dea1211-20a0-440a-947a-e899dcd25504',
      );
      mockResidentRepository.find.mockRejectedValue(
        new Error('Database error'),
      );

      // Act & Assert
      await expect(handler.execute(query)).rejects.toThrow(
        new BadRequestException('Erro ao buscar residente'),
      );
      expect(mockResidentRepository.find).toHaveBeenCalledTimes(1);
    });
  });
});
