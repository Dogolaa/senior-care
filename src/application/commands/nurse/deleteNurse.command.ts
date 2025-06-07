import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteNurseCommand {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}
