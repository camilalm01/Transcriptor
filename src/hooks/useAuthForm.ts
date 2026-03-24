import { useState } from 'react';

export type FieldErrors = Record<string, string>;

export function useAuthForm<T extends Record<string, string>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (globalError) {
      setGlobalError(undefined);
    }
  };

  const resetErrors = () => {
    setErrors({});
    setGlobalError(undefined);
  };

  return {
    values,
    setValues,
    errors,
    setErrors,
    globalError,
    setGlobalError,
    loading,
    setLoading,
    onChange,
    resetErrors
  };
}
