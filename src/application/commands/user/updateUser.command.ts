export class UpdateUserCommand {
  constructor(
    public readonly email: string,
    public readonly updateData: Partial<{
      name: string;
      email: string;
      cpf: string;
      phone: string;
      addressId: string;
      password: string;
      roleId: string;
    }>,
  ) {}
}
