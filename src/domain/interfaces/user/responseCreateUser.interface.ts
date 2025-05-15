export interface ResponseCreateUserInterface {
  data: {
    name: CreateUserInterface;
    email: CreateUserInterface;
    phone: CreateUserInterface;
  };
  status: number;
}

interface CreateUserInterface {
  name: string;
  email: string;
  phone: string;
}
