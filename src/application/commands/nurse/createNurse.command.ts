export class CreateNurseCommand {
  constructor(
    public readonly userId,
    public readonly coren,
    public readonly specialization,
    public readonly shift,
  ) {}
}
