import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateDoctorCommand {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  constructor(
    id: string,
    public readonly crm?: string,
    public readonly specialization?: string,
    public readonly shift?: string,
  ) {
    this.id = id;
  }
}
