export type PasswordRule = {
  id: string;
  label: string;
  test: (password: string) => boolean;
};

const PASSWORD_PATTERNS = {
  upper: /[A-Z]/,
  lower: /[a-z]/,
  number: /\d/
};

export const PASSWORD_REQUIREMENTS: PasswordRule[] = [
  {
    id: 'len',
    label: 'Minimo 8 caracteres',
    test: (password) => password.length >= 8
  },
  {
    id: 'upper',
    label: 'Al menos una letra mayuscula',
    test: (password) => PASSWORD_PATTERNS.upper.test(password)
  },
  {
    id: 'lower',
    label: 'Al menos una letra minuscula',
    test: (password) => PASSWORD_PATTERNS.lower.test(password)
  },
  {
    id: 'number',
    label: 'Al menos un numero',
    test: (password) => PASSWORD_PATTERNS.number.test(password)
  }
];

export const PASSWORD_REGEX = PASSWORD_PATTERNS;
