import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteUserCommand } from 'src/application/commands/user/deleteUser.command';
import { UpdateUserCommand } from 'src/application/commands/user/updateUser.command';
import { DeleteUserHandler } from 'src/application/handlers/user/deleteUser.handler';
import { UpdateUserHandler } from 'src/application/handlers/user/updateUser.handler';
import { User } from 'src/domain/entities/user.entity';
import { Repository } from 'typeorm';

const mockUser = {
  name: 'João da Silva',
  email: 'john.doe@example.com',
  phone: '11999998888',
  isActive: true,
} as User;

const updateData = {
  name: 'Lucas Dogo',
  email: 'john1.doe@example.com',
};

describe('UpdateUserHandler', () => {
  let handler: UpdateUserHandler;
  let userRepository: Repository<User>;

  const mockUserRepository = {
    findOneBy: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUserHandler,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    handler = module.get<UpdateUserHandler>(UpdateUserHandler);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('execute', () => {
    // --- HAPPY PATH ---
    it('✅ deve retornar um objeto confirmando o update de um usuário com sucesso', async () => {
      const command = new UpdateUserCommand('john.doe@example.com', updateData);

      const updatedUser = {
        ...mockUser,
        ...updateData,
      };

      const expectedResult = {
        message: 'Usuário atualizado com sucesso',
        user: updatedUser,
      };

      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockUserRepository.save.mockResolvedValue(updatedUser);

      const result = await handler.execute(command);

      expect(result).toEqual(expectedResult);

      expect(mockUserRepository.findOneBy).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
        email: command.email,
      });

      expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.save).toHaveBeenCalledWith(updatedUser);
    });

    it('❌ deve lançar NotFoundException se o usuário não for encontrado', async () => {
      const command = new UpdateUserCommand(
        'not.found@example.com',
        updateData,
      );

      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(handler.execute(command)).rejects.toThrow(
        new NotFoundException('Usuário não encontrado'),
      );
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });

    it('❌ deve lançar BadRequestExecption se o usuário não for encontrado', async () => {
      const command = new UpdateUserCommand('john.doe@example.com', updateData);

      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockUserRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(handler.execute(command)).rejects.toThrow(
        new BadRequestException('Erro ao atualizar usuário'),
      );
    });
  });
});
