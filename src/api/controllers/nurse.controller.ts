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
import { CreateNurseCommand } from 'src/application/commands/nurse/createNurse.command';
import { DeleteNurseCommand } from 'src/application/commands/nurse/deleteNurse.command';
import { UpdateNurseCommand } from 'src/application/commands/nurse/updateNurse.command';
import { CreateNurseDTO } from 'src/application/dtos/nurse/createNurse.dto';
import { UpdateNurseDTO } from 'src/application/dtos/nurse/updateNurse.dto';
import { GetAllNursesQuery } from 'src/application/query/nurse/getAllNurses.query';
import { ListSpecificNurseQuery } from 'src/application/query/nurse/listSpecificNurse.query';

@Controller('nurse')
export class NurseController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Post('/create')
  async createNurse(@Body() body: CreateNurseDTO): Promise<any> {
    const { userId, coren, specialization, shift } = body;

    const command = new CreateNurseCommand(
      userId,
      coren,
      specialization,
      shift,
    );

    return await this.commandBus.execute(command);
  }

  @Get('/')
  async getAllNurses(): Promise<any> {
    const query = new GetAllNursesQuery();
    return await this.queryBus.execute(query);
  }

  @Get('/:id')
  async listSpecificNurse(@Param('id') id: string): Promise<any> {
    const query = new ListSpecificNurseQuery(id);
    return await this.queryBus.execute(query);
  }

  @Delete('delete/:id')
  async deleteNurse(@Param('id') id: string): Promise<any> {
    const command = new DeleteNurseCommand(id);
    return await this.commandBus.execute(command);
  }

  @Patch('update/:id')
  async updateNurse(
    @Param('id') id: string,
    @Body() body: UpdateNurseDTO,
  ): Promise<any> {
    const { coren, specialization, shift } = body;
    const command = new UpdateNurseCommand(id, coren, specialization, shift);
    return await this.commandBus.execute(command);
  }
}
