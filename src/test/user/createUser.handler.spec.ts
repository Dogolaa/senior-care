import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserHandler } from 'src/application/handlers/user/createUser.handler';
import { CreateUserCommand } from 'src/application/commands/user/createUser.command';
import { User } from 'src/domain/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

describe('CreateUserHandler', () => {
  let handler: CreateUserHandler;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    // Reseta os mocks antes de cada teste para garantir a independência dos testes
    jest.clearAllMocks();

    // Cria um módulo de teste do NestJS
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserHandler,
        {
          // Fornece o mock no lugar do repositório real
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    // Obtém a instância do handler
    handler = module.get<CreateUserHandler>(CreateUserHandler);
  });

  // Teste 1: O "caminho feliz" (happy path)
  it('deve criar e salvar um novo usuário com sucesso', async () => {
    // Arrange (Organização)
    const command = new CreateUserCommand(
      'John Doe',
      'john.doe@example.com',
      '123.456.789-00',
      '11999998888',
      'uuid-address-123',
      'StrongPassword123!',
      'uuid-role-123',
    );

    const hashedPassword = 'hashedPassword123';
    const userEntity = {
      ...command,
      id: 'uuid-user-123',
      password: hashedPassword,
    };

    // Configuração dos mocks para este cenário
    (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
    mockUserRepository.findOne.mockResolvedValue(null); // Nenhum usuário existente
    mockUserRepository.create.mockReturnValue(userEntity); // Simula a criação da entidade
    mockUserRepository.save.mockResolvedValue(userEntity); // Simula o salvamento

    // Act (Ação)
    const result = await handler.execute(command);

    // Assert (Verificação)
    expect(result).toEqual({
      message: 'Usuário criado com sucesso',
      user: {
        name: command.name,
        email: command.email,
        cpf: command.cpf,
      },
    });

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      where: [{ email: command.email }, { cpf: command.cpf }],
    });
    expect(bcrypt.hash).toHaveBeenCalledWith(command.password, 10);
    expect(mockUserRepository.create).toHaveBeenCalledWith({
      ...command,
      password: hashedPassword,
    });
    expect(mockUserRepository.save).toHaveBeenCalledWith(userEntity);
  });

  // Teste 2: Tentativa de criar um usuário que já existe
  it('deve lançar uma BadRequestException se o email ou CPF já estiver em uso', async () => {
    // Arrange
    const command = new CreateUserCommand(
      'Jane Doe',
      'jane.doe@example.com',
      '987.654.321-00',
      '11988887777',
      'uuid-address-456',
      'AnotherStrongPass!',
      'uuid-role-456',
    );

    const existingUser = new User(); // Simula um usuário já existente no banco

    mockUserRepository.findOne.mockResolvedValue(existingUser);

    // Act & Assert
    await expect(handler.execute(command)).rejects.toThrow(
      new BadRequestException(
        'Email ou CPF já estão em uso. Por favor, tente novamente com outros dados.',
      ),
    );

    // Garante que o processo foi interrompido antes de continuar
    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect(mockUserRepository.create).not.toHaveBeenCalled();
    expect(mockUserRepository.save).not.toHaveBeenCalled();
  });

  // Teste 3: Tratamento de um erro inesperado (ex: falha no banco)
  it('deve lançar uma BadRequestException se ocorrer um erro durante o processo', async () => {
    // Arrange
    const command = new CreateUserCommand(
      'Test Error',
      'error@example.com',
      '111.222.333-44',
      '11977776666',
      'uuid-address-789',
      'ErrorPass123!',
      'uuid-role-789',
    );
    const dbError = new Error('Erro de conexão com o banco de dados');

    mockUserRepository.findOne.mockResolvedValue(null); // Usuário não existe
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
    mockUserRepository.create.mockReturnValue(new User());
    mockUserRepository.save.mockRejectedValue(dbError); // Simula uma falha ao salvar

    // Act & Assert
    await expect(handler.execute(command)).rejects.toThrow(
      new BadRequestException(dbError.message),
    );
  });
});
