export class CreateAddressCommand {
  constructor(
    public readonly cep: string,
    public readonly country: string,
    public readonly state: string,
    public readonly city: string,
    public readonly district: string,
    public readonly street: string,
    public readonly number: number,
    public readonly complement?: string,
  ) {}
}
