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
import { CreateDoctorCommand } from 'src/application/commands/doctor/createDoctor.command';
import { DeleteDoctorCommand } from 'src/application/commands/doctor/deleteDoctor.command';
import { UpdateDoctorCommand } from 'src/application/commands/doctor/updateDoctor.command';
import { CreateDoctorDTO } from 'src/application/dtos/doctor/createDoctor.dto';
import { UpdateDoctorDTO } from 'src/application/dtos/doctor/updateDoctor.dto';
import { GetAllDoctorsQuery } from 'src/application/query/doctor/getAllDoctors.query';
import { ListSpecificDoctorQuery } from 'src/application/query/doctor/listSpecificDoctor.query';

@Controller('doctor')
export class DoctorController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Post('/create')
  async createDoctor(@Body() body: CreateDoctorDTO): Promise<any> {
    const { userId, crm, specialization, shift } = body;

    const command = new CreateDoctorCommand(userId, crm, specialization, shift);

    return await this.commandBus.execute(command);
  }

  @Get('/')
  async getAllDoctors(): Promise<any> {
    const query = new GetAllDoctorsQuery();
    return await this.queryBus.execute(query);
  }

  @Get('/:id')
  async listSpecificDoctor(@Param('id') id: string): Promise<any> {
    const query = new ListSpecificDoctorQuery(id);
    return await this.queryBus.execute(query);
  }

  @Delete('delete/:id')
  async deleteDoctor(@Param('id') id: string): Promise<any> {
    const command = new DeleteDoctorCommand(id);
    return await this.commandBus.execute(command);
  }

  @Patch('update/:id')
  async updateDoctor(
    @Param('id') id: string,
    @Body() body: UpdateDoctorDTO,
  ): Promise<any> {
    const { crm, specialization, shift } = body;
    const command = new UpdateDoctorCommand(id, crm, specialization, shift);
    return await this.commandBus.execute(command);
  }
}
