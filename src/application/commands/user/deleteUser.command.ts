import { IsEmail } from 'class-validator';

export class DeleteUserCommand {
  @IsEmail()
  email: string;

  constructor(email: string) {
    this.email = email;
  }
}
