import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteDoctorCommand {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}
