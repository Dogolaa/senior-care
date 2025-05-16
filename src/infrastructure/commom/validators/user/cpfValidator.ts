import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsCPF(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isCPF',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!value) return false;

          // Função de validação do CPF real
          return validateCPF(value);
        },
        defaultMessage() {
          return 'O CPF fornecido não é válido.';
        },
      },
    });
  };
}

// Função para validar CPF (com verificação dos dígitos verificadores)
export function validateCPF(cpf: string): boolean {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/\D/g, '');

  // Verifica se o CPF tem 11 dígitos
  if (cpf.length !== 11) return false;

  // Valida se todos os números são iguais (ex: 111.111.111-11)
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  // Cálculo do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let firstCheckDigit = 11 - (sum % 11);
  if (firstCheckDigit === 10 || firstCheckDigit === 11) firstCheckDigit = 0;
  if (firstCheckDigit !== parseInt(cpf.charAt(9))) return false;

  // Cálculo do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  let secondCheckDigit = 11 - (sum % 11);
  if (secondCheckDigit === 10 || secondCheckDigit === 11) secondCheckDigit = 0;
  if (secondCheckDigit !== parseInt(cpf.charAt(10))) return false;

  return true;
}
