import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateResidentCommand } from 'src/application/commands/resident/createResident.command';
import { DeleteResidentCommand } from 'src/application/commands/resident/deleteResident.command';
import { UpdateResidentCommand } from 'src/application/commands/resident/updateResident.command';
import { CreateResidentDTO } from 'src/application/dtos/resident/createResident.dto';
import { UpdateResidentDTO } from 'src/application/dtos/resident/updateResident.dto';
import { GetAllResidentsQuery } from 'src/application/query/resident/getAllResidents.query';
import { ListSpecificResidentQuery } from 'src/application/query/resident/listSpecificResident.query';
import { Resident } from 'src/domain/entities/resident.entity';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

@ApiTags('residents')
@Controller('resident')
export class ResidentController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('/create')
  @ApiOperation({ summary: 'Cria um novo residente' })
  @ApiResponse({
    status: 201,
    description: 'Residente criado com sucesso.',
    type: Resident,
  })
  @ApiResponse({
    status: 400,
    description: 'Parâmetros inválidos ou CPF já existente.',
  })
  async createResident(@Body() body: CreateResidentDTO): Promise<Resident> {
    const { name, cpf, dateOfBirth, gender, admissionDate } = body;
    const command = new CreateResidentCommand(
      name,
      cpf,
      dateOfBirth,
      gender,
      admissionDate,
    );
    return await this.commandBus.execute(command);
  }

  @Get('/')
  @ApiOperation({ summary: 'Lista todos os residentes' })
  @ApiResponse({
    status: 200,
    description: 'Lista de residentes retornada com sucesso.',
    type: [Resident],
  })
  async getAllResidents(): Promise<Resident[]> {
    const query = new GetAllResidentsQuery();
    return await this.queryBus.execute(query);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Busca um residente específico pelo id' })
  @ApiParam({
    name: 'id',
    description: 'UUID a ser buscado',
    type: UUID,
  })
  @ApiResponse({
    status: 200,
    description: 'Residente encontrado.',
    type: Resident,
  })
  @ApiResponse({ status: 404, description: 'Residente não encontrado.' })
  async listSpecificResident(@Param('id') id: string): Promise<Resident> {
    const query = new ListSpecificResidentQuery(id);
    return await this.queryBus.execute(query);
  }

  @Delete('/delete/:id')
  @ApiOperation({ summary: 'Deleta um residente pelo id' })
  @ApiParam({
    name: 'id',
    description: 'Id do residente a ser deletado',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário deletado com sucesso.',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Residente deletado com sucesso.',
        },
        success: {
          type: 'boolean',
          example: true,
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Residente não encontrado.' })
  async deleteResident(@Param('id') id: string): Promise<any> {
    const command = new DeleteResidentCommand(id);
    return await this.commandBus.execute(command);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Atualiza os dados de um residente' })
  @ApiParam({
    name: 'id',
    description: 'UUID do residente a ser atualizado',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Residente atualizado com sucesso.',
    type: Resident,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos fornecidos.' })
  @ApiResponse({ status: 404, description: 'Residente não encontrado.' })
  async updateUser(
    @Param('id') id: string,
    @Body() body: UpdateResidentDTO,
  ): Promise<Resident> {
    const command = new UpdateResidentCommand(id, body);
    return await this.commandBus.execute(command);
  }
}
