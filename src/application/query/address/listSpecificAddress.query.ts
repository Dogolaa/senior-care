import { IsUUID } from 'class-validator';

export class ListSpecificAddressQuery {
  @IsUUID()
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}
