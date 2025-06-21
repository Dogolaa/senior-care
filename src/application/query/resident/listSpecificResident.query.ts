import { IsUUID } from 'class-validator';

export class ListSpecificResidentQuery {
  @IsUUID()
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}
