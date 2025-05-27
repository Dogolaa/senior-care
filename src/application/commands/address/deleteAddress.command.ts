import { IsUUID } from 'class-validator';

export class DeleteAddressCommand {
  @IsUUID()
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}
