import { IsString } from 'class-validator';

export class ListSpecificPermissionQuery {
  @IsString()
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}
