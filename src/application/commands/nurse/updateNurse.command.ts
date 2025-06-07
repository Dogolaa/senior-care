import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateNurseCommand {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  constructor(
    id: string,
    public readonly coren?: string,
    public readonly specialization?: string,
    public readonly shift?: string,
  ) {
    this.id = id;
  }
}
