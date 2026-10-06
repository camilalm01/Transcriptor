import type {
  PasswordValidation,
} from "../types/auth.types";

export const validateName = (
  value: string
): boolean => {
  const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  return regex.test(value.trim());
};

export const validateEmail = (
  value: string
): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(value.trim());
};

export const validatePassword = (
  value: string
): PasswordValidation => ({
  minLength: value.length >= 8,
  uppercase: /[A-Z]/.test(value),
  lowercase: /[a-z]/.test(value),
  number: /\d/.test(value),
});

export const isPasswordValid = (
  value: string
): boolean => {
  const result = validatePassword(value);

  return (
    result.minLength &&
    result.uppercase &&
    result.lowercase &&
    result.number
  );
};

export const passwordsMatch = (
  password: string,
  confirmPassword: string
): boolean => {
  return (
    password.length > 0 &&
    password === confirmPassword
  );
};