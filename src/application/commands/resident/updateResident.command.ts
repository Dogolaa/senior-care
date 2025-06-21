import { Gender } from 'src/application/dtos/resident/createResident.dto';

export class UpdateResidentCommand {
  constructor(
    public readonly id: string,
    public readonly updateData: Partial<{
      name: string;
      cpf: string;
      dateOfBirth: string;
      gender: Gender;
      admissionDate: string;
    }>,
  ) {}
}
