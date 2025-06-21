import { IsUUID } from 'class-validator';

export class DeleteResidentCommand {
  @IsUUID()
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}
