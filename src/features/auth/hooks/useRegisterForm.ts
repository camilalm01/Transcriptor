import { useMemo, useState } from "react";

import {
  passwordsMatch,
  validateEmail,
  validateName,
  validatePassword,
} from "../utils/authValidators";

export function useRegisterForm() {
  const [fullName, setFullName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [acceptTerms, setAcceptTerms] = useState(false);

  const passwordRules =
    useMemo(
      () =>
        validatePassword(
          password
        ),
      [password]
    );

  const isValid =
    validateName(fullName) &&
    validateEmail(email) &&
    passwordRules.minLength &&
    passwordRules.uppercase &&
    passwordRules.lowercase &&
    passwordRules.number &&
    passwordsMatch(
      password,
      confirmPassword
    ) &&
    acceptTerms;


  return {
    fullName, setFullName,
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    acceptTerms, setAcceptTerms,
    passwordRules,
    isValid,
  };
}