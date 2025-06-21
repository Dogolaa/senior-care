import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateResidentHandler } from 'src/application/handlers/resident/createResident.handler';
import { BadRequestException } from '@nestjs/common';
import { Resident } from 'src/domain/entities/resident.entity';
import { CreateResidentCommand } from 'src/application/commands/resident/createResident.command';
import { Gender } from 'src/application/dtos/resident/createResident.dto';

describe('CreateResidentHandler', () => {
  let handler: CreateResidentHandler;

  const mockResidentRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateResidentHandler,
        {
          // Fornece o mock no lugar do repositório real
          provide: getRepositoryToken(Resident),
          useValue: mockResidentRepository,
        },
      ],
    }).compile();

    // Obtém a instância do handler
    handler = module.get<CreateResidentHandler>(CreateResidentHandler);
  });

  // Teste 1: O "caminho feliz" (happy path)
  it('Deve criar e salvar um novo residente com sucesso', async () => {
    // Arrange (Organização)
    const command = new CreateResidentCommand(
      'John Doe',
      '123.456.789-00',
      '2001-09-14',
      Gender.MALE,
      '2025-09-15',
    );

    const residentEntity = {
      ...command,
      id: 'uuid-resident-123',
    };

    mockResidentRepository.findOne.mockResolvedValue(null);
    mockResidentRepository.create.mockReturnValue(residentEntity);
    mockResidentRepository.save.mockResolvedValue(residentEntity);

    const result = await handler.execute(command);

    expect(result).toEqual({
      message: 'Residente criado com sucesso',
      resident: {
        name: command.name,
        cpf: command.cpf,
      },
    });

    expect(mockResidentRepository.findOne).toHaveBeenCalledWith({
      where: [{ cpf: command.cpf }],
    });
    expect(mockResidentRepository.create).toHaveBeenCalledWith({
      ...command,
    });
    expect(mockResidentRepository.save).toHaveBeenCalledWith(residentEntity);
  });

  // Teste 2: Tentativa de criar um usuário que já existe
  it('Deve lançar uma BadRequestException se o CPF já estiver em uso', async () => {
    // Arrange
    const command = new CreateResidentCommand(
      'Jane Doe',
      '987.654.321-00',
      '2001-09-14',
      Gender.FEMALE,
      '2025-09-15',
    );

    const existingResident = new Resident();

    mockResidentRepository.findOne.mockResolvedValue(existingResident);

    // Act & Assert
    await expect(handler.execute(command)).rejects.toThrow(
      new BadRequestException(
        'CPF já estão em uso. Por favor, tente novamente com outros dados.',
      ),
    );

    expect(mockResidentRepository.create).not.toHaveBeenCalled();
    expect(mockResidentRepository.save).not.toHaveBeenCalled();
  });

  it('Deve lançar uma BadRequestException se ocorrer um erro durante o processo', async () => {
    const command = new CreateResidentCommand(
      'Test Error',
      '987.654.321-00',
      '2001-09-14',
      Gender.FEMALE,
      '2025-09-15',
    );
    const dbError = new Error('Erro de conexão com o banco de dados');

    mockResidentRepository.findOne.mockResolvedValue(null);
    mockResidentRepository.create.mockReturnValue(new Resident());
    mockResidentRepository.save.mockRejectedValue(dbError);

    // Act & Assert
    await expect(handler.execute(command)).rejects.toThrow(
      new BadRequestException(dbError.message),
    );
  });
});
