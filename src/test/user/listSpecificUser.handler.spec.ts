import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ListSpecificUserHandler } from 'src/application/handlers/user/listSpecificUser.handler';
import { ListSpecificUserQuery } from 'src/application/query/user/listSpecificUser.query';
import { User } from 'src/domain/entities/user.entity';
import { Repository } from 'typeorm';

// Mock dos dados que esperamos que o repositório retorne
const mockUser: Partial<User>[] = [
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

describe('ListSpecificUserHandler', () => {
  let handler: ListSpecificUserHandler;
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
        ListSpecificUserHandler,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository, // Usa o mock em vez do repositório real
        },
      ],
    }).compile();

    handler = module.get<ListSpecificUserHandler>(ListSpecificUserHandler);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('execute', () => {
    // --- HAPPY PATH ---
    it('✅ deve retornar um array com um usuário com sucesso', async () => {
      // Arrange: Configuração do cenário de teste
      const query = new ListSpecificUserQuery('john.doe@example.com');
      // Simula o repositório retornando a lista de usuários mockada com sucesso
      mockUserRepository.find.mockResolvedValue(mockUser);

      // Act: Execução do método a ser testado
      const result = await handler.execute(query);

      // Assert: Verificação do resultado
      // 1. O resultado deve ser igual à nossa lista mockada
      expect(result).toEqual(mockUser);
      // 2. O método 'find' do repositório deve ter sido chamado uma vez
      expect(mockUserRepository.find).toHaveBeenCalledTimes(1);
      // 3. Verifica se 'find' foi chamado com os parâmetros corretos (select e relations)
      expect(mockUserRepository.find).toHaveBeenCalledWith({
        select: ['name', 'email', 'phone', 'isActive'],
        relations: ['address', 'role'],
        where: [{ email: 'john.doe@example.com' }],
      });
    });

    // --- SAD PATH ---
    it('❌ deve retornar um array vazio se o usuário não for encontrado', async () => {
      const query = new ListSpecificUserQuery('non.existent.user@example.com');

      mockUserRepository.find.mockResolvedValue([]);

      const result = await handler.execute(query);

      expect(result).toEqual([]);

      expect(mockUserRepository.find).toHaveBeenCalledWith({
        select: ['name', 'email', 'phone', 'isActive'],
        relations: ['address', 'role'],
        where: [{ email: 'non.existent.user@example.com' }],
      });
    });

    it('❌ deve lançar uma BadRequestException se o repositório falhar', async () => {
      // Arrange
      const query = new ListSpecificUserQuery('any.email@example.com');
      mockUserRepository.find.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(handler.execute(query)).rejects.toThrow(
        new BadRequestException('Erro ao buscar usuários'),
      );
      expect(mockUserRepository.find).toHaveBeenCalledTimes(1);
    });
  });
});
