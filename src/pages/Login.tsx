import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthFormLayout from '../components/layout/AuthFormLayout';
import { FormField } from '../components/ui/FormField';
import { PasswordField } from '../components/ui/PasswordField';
import { login } from '../services/auth';
import { isHttpError } from '../services/http';
import { z } from 'zod';
import { loginSchema, zodToFieldErrors, type LoginInput } from '../validation/authSchemas';
import { setCurrentUser, setSolicitanteId } from '../services/authLocal';
import { useAuthForm } from '../hooks/useAuthForm';

export default function Login() {
  useEffect(() => { document.title = 'Login | Mi App Accesible'; }, []);
  const navigate = useNavigate();
  const {
    values,
    errors,
    globalError,
    loading,
    setErrors,
    setGlobalError,
    setLoading,
    onChange,
    resetErrors
  } = useAuthForm<LoginInput>({ email: '', password: '' });

  // Envío
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetErrors();

    try {
      // 1) Validación cliente
      const parsed = loginSchema.parse(values);

      // 2) Llamada al backend
      setLoading(true);

      const usuario = await login(parsed); // <- back devuelve Usuario directo
      setCurrentUser(usuario);
      setSolicitanteId(usuario.user.id); // Guarda idSolicitante para otras APIs
      navigate('/home'); // Home o dashboard

    } catch (err) {
      if (err instanceof z.ZodError) {
        // Errores de validación de cliente → bajo cada campo
        setErrors(zodToFieldErrors(err));
      } else if (isHttpError(err)) {
        // Error controlado del backend
        setGlobalError(err.message || 'No se pudo iniciar sesión');
      } else if (err instanceof Error) {
        // Error inesperado en cliente
        setGlobalError(err.message || 'No se pudo iniciar sesión');
      } else {
        setGlobalError('No se pudo iniciar sesión');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormLayout
      title="Login"
      onSubmit={onSubmit}
      submitText="Iniciar sesión"
      submitLoadingText="Ingresando…"
      submitAriaLabel="Iniciar sesión"
      loading={loading}
      globalError={globalError}
      footerText="¿No tienes cuenta?"
      footerLinkText="Regístrate"
      footerLinkTo="/register"
    >
        <FormField
          id="login-email"
          label="Correo Electrónico"
          name="email"
          type="email"
          placeholder="correo@ejemplo.com"
          autoComplete="email"
          value={values.email}
          onChange={onChange}
          error={errors.email}
        />

        <PasswordField
          id="login-pass"
          label="Contraseña"
          name="password"
          placeholder="••••••••"
          autoComplete="current-password"
          value={values.password}
          onChange={onChange}
          aria-describedby={errors.password ? 'login-pass-error' : undefined}
        />
        {errors.password && (
          <div id="login-pass-error" role="alert" className="field__error">
            {errors.password}
          </div>
        )}
    </AuthFormLayout>
  );
}
