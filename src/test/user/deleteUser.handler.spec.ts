import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteUserCommand } from 'src/application/commands/user/deleteUser.command';
import { DeleteUserHandler } from 'src/application/handlers/user/deleteUser.handler';
import { User } from 'src/domain/entities/user.entity';
import { Repository } from 'typeorm';

const mockUser = {
  name: 'João da Silva',
  email: 'john.doe@example.com',
  phone: '11999998888',
  isActive: true,
} as User;

describe('DeleteUserHandler', () => {
  let handler: DeleteUserHandler;
  let userRepository: Repository<User>;

  const mockUserRepository = {
    findOneBy: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteUserHandler,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    handler = module.get<DeleteUserHandler>(DeleteUserHandler);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('execute', () => {
    // --- HAPPY PATH ---
    it('✅ deve retornar um objeto confirmando o delete de um usuário com sucesso', async () => {
      const command = new DeleteUserCommand('john.doe@example.com');
      const expectedResult = {
        message: 'Usuário deletado com sucesso',
        email: 'john.doe@example.com',
      };

      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockUserRepository.delete.mockResolvedValue({});

      const result = await handler.execute(command);

      expect(result).toEqual(expectedResult);

      expect(mockUserRepository.findOneBy).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
        email: command.email,
      });

      expect(mockUserRepository.delete).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.delete).toHaveBeenCalledWith({
        email: command.email,
      });
    });
    // --- SAD PATH ---
    it('❌ deve lançar NotFoundException se o usuário não for encontrado', async () => {
      const command = new DeleteUserCommand('not.found@example.com');

      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(handler.execute(command)).rejects.toThrow(
        new NotFoundException('Usuário não encontrado'),
      );
      expect(mockUserRepository.delete).not.toHaveBeenCalled();
    });

    it('❌ deve lançar BadRequestExecption se o usuário não for encontrado', async () => {
      const command = new DeleteUserCommand('john.doe@example.com');

      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockUserRepository.delete.mockRejectedValue(new Error('Database error'));

      await expect(handler.execute(command)).rejects.toThrow(
        new BadRequestException('Erro ao deletar usuário'),
      );
    });
  });
});
