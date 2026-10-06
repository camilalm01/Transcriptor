import { useMemo, useState } from "react";
import { validateEmail } from "../utils/authValidators";

export function useLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isValid = useMemo(() => {
    return (
      validateEmail(email) &&
      password.trim().length > 0
    );
  }, [email, password]);

  return {
    email, setEmail,
    password, setPassword,
    isValid,
  };
}