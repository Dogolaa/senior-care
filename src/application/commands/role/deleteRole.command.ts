import { IsUUID } from 'class-validator';

export class DeleteRoleCommand {
  @IsUUID()
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}
