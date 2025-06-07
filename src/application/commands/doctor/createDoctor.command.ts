export class CreateDoctorCommand {
  constructor(
    public readonly userId,
    public readonly crm,
    public readonly specialization,
    public readonly shift,
  ) {}
}
