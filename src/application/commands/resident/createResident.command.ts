import { Gender } from 'src/application/dtos/resident/createResident.dto';

export class CreateResidentCommand {
  constructor(
    public readonly name: string,
    public readonly cpf: string,
    public readonly dateOfBirth: string,
    public readonly gender: Gender,
    public readonly admissionDate: string,
  ) {}
}
