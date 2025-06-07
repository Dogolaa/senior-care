import { IsNotEmpty, IsUUID } from 'class-validator';

export class ListSpecificNurseQuery {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}
