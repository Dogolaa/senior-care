import { IsString } from 'class-validator';

export class ListSpecificRoleQuery {
  @IsString()
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}
