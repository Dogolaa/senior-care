import { IsEmail } from 'class-validator';

export class ListSpecificUserQuery {
  @IsEmail()
  email: string;

  constructor(email: string) {
    this.email = email;
  }
}
