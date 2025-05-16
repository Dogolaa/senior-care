export class CreateUserCommand {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly cpf: string,
    public readonly phone: string,
    public readonly addressId: string,
    public readonly password: string,
    public readonly roleId: string,
  ) {}
}
