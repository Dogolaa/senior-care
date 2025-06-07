import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateNurseCommand } from 'src/application/commands/nurse/createNurse.command';
import { CreateNurseDTO } from 'src/application/dtos/nurse/createNurse.dto';

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
}
