import { IsNotEmpty, IsUUID } from 'class-validator';

export class ListSpecificDoctorQuery {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}
