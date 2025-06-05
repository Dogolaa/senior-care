import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GetAllUsersHandler } from 'src/application/handlers/user/getAllUsers.handler';
import { GetAllUsersQuery } from 'src/application/query/user/getAllUsers.query';
import { User } from 'src/domain/entities/user.entity';
import { Repository } from 'typeorm';

// Mock dos dados que esperamos que o repositório retorne
const mockUsers: Partial<User>[] = [
  {
    name: 'João da Silva',
    email: 'joao.silva@example.com',
    phone: '11999998888',
    isActive: true,
  },
  {
    name: 'Maria Oliveira',
    email: 'maria.oliveira@example.com',
    phone: '21888887777',
    isActive: true,
  },
];

describe('GetAllUsersHandler', () => {
  let handler: GetAllUsersHandler;
  let userRepository: Repository<User>;

  // Mock do repositório. Usamos 'find' pois é o método que o handler chama.
  const mockUserRepository = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    // Limpa os mocks antes de cada teste para garantir a independência dos testes
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllUsersHandler,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository, // Usa o mock em vez do repositório real
        },
      ],
    }).compile();

    handler = module.get<GetAllUsersHandler>(GetAllUsersHandler);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('execute', () => {
    // --- HAPPY PATH ---
    it('✅ deve retornar um array de usuários com sucesso', async () => {
      // Arrange: Configuração do cenário de teste
      const query = new GetAllUsersQuery();
      // Simula o repositório retornando a lista de usuários mockada com sucesso
      mockUserRepository.find.mockResolvedValue(mockUsers);

      // Act: Execução do método a ser testado
      const result = await handler.execute(query);

      // Assert: Verificação do resultado
      // 1. O resultado deve ser igual à nossa lista mockada
      expect(result).toEqual(mockUsers);
      // 2. O método 'find' do repositório deve ter sido chamado uma vez
      expect(mockUserRepository.find).toHaveBeenCalledTimes(1);
      // 3. Verifica se 'find' foi chamado com os parâmetros corretos (select e relations)
      expect(mockUserRepository.find).toHaveBeenCalledWith({
        select: ['name', 'email', 'phone', 'isActive'],
        relations: ['address', 'role'],
      });
    });

    // --- SAD PATH (Exemplo) ---
    it('❌ deve lançar uma BadRequestException se o repositório falhar', async () => {
      // Arrange
      const query = new GetAllUsersQuery();
      // Simula o repositório lançando um erro
      mockUserRepository.find.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      // Esperamos que a execução do handler rejeite e lance uma exceção específica
      await expect(handler.execute(query)).rejects.toThrow(
        'Erro ao buscar usuários',
      );
    });
  });
});
