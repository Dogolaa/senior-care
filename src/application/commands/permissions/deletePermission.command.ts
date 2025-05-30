import { IsUUID } from 'class-validator';

export class DeletePermissionCommand {
  @IsUUID()
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}
