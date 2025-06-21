import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Gender } from 'src/application/dtos/resident/createResident.dto';
import { GetAllResidentsHandler } from 'src/application/handlers/resident/getAllResidents.handler';
import { GetAllResidentsQuery } from 'src/application/query/resident/getAllResidents.query';
import { Resident } from 'src/domain/entities/resident.entity';
import { Repository } from 'typeorm';

// Mock dos dados que esperamos que o repositório retorne
const mockResidents: Partial<Resident>[] = [
  {
    name: 'João da Silva',
    cpf: '852.275.930-86',
    dateOfBirth: '2020-08-20',
    gender: Gender.MALE,
    admissionDate: '2021-08-09',
  },
  {
    name: 'Joana da Silva',
    cpf: '994.054.510-06',
    dateOfBirth: '2020-08-20',
    gender: Gender.FEMALE,
    admissionDate: '2021-08-09',
  },
];

describe('GetAllResidentsHandler', () => {
  let handler: GetAllResidentsHandler;
  let residentRepository: Repository<Resident>;

  // Mock do repositório. Usamos 'find' pois é o método que o handler chama.
  const mockResidentRepository = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    // Limpa os mocks antes de cada teste para garantir a independência dos testes
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllResidentsHandler,
        {
          provide: getRepositoryToken(Resident),
          useValue: mockResidentRepository, // Usa o mock em vez do repositório real
        },
      ],
    }).compile();

    handler = module.get<GetAllResidentsHandler>(GetAllResidentsHandler);
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
    it('✅ deve retornar um array de residentes com sucesso', async () => {
      const query = new GetAllResidentsQuery();
      mockResidentRepository.find.mockResolvedValue(mockResidents);

      const result = await handler.execute(query);
      expect(result).toEqual(mockResidents);

      expect(mockResidentRepository.find).toHaveBeenCalledTimes(1);

      expect(mockResidentRepository.find).toHaveBeenCalledWith({
        select: ['id', 'name', 'cpf', 'dateOfBirth', 'gender', 'admissionDate'],
      });
    });

    // --- SAD PATH (Exemplo) ---
    it('❌ deve lançar uma BadRequestException se o repositório falhar', async () => {
      // Arrange
      const query = new GetAllResidentsQuery();
      mockResidentRepository.find.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(handler.execute(query)).rejects.toThrow(
        'Erro ao buscar residentes',
      );
    });
  });
});
