import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthFormLayout from '../components/layout/AuthFormLayout';
import { FormField } from '../components/ui/FormField';
import { PasswordField } from '../components/ui/PasswordField';
import { register } from '../services/auth';
import { isHttpError } from '../services/http';
import { registerSchema, zodToFieldErrors, type RegisterInput } from '../validation/authSchemas';
import { PASSWORD_REQUIREMENTS } from '../validation/passwordRules';
import { setCurrentUser, setSolicitanteId } from '../services/authLocal';
import { useAuthForm } from '../hooks/useAuthForm';

export default function Register() {
  useEffect(() => { document.title = 'Registro | Mi App Accesible'; }, []);
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
  } = useAuthForm<RegisterInput>({
    name: '', email: '', password: '', confirm: ''
  });
  const [showPasswordChecks, setShowPasswordChecks] = useState(false);

  const passwordStatus = PASSWORD_REQUIREMENTS.map((check) => ({
    ...check,
    done: check.test(values.password)
  }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetErrors();

    const parsed = registerSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(zodToFieldErrors(parsed.error));
      return;
    }

    try {
      setLoading(true);
      const usuario = await register(parsed.data);

      // Inicia sesion automaticamente tras registro exitoso
      setCurrentUser(usuario);
      setSolicitanteId(usuario.user.id);
      navigate('/home');
    } catch (err: unknown) {
      if (isHttpError(err)) {
        setGlobalError(err.message || 'Error al registrarse');
      } else if (err instanceof Error) {
        setGlobalError(err.message || 'Error al registrarse');
      } else {
        setGlobalError('Error al registrarse');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormLayout
      title="Registro"
      onSubmit={onSubmit}
      submitText="Registrarse"
      submitLoadingText="Registrando…"
      submitAriaLabel="Registrarse"
      loading={loading}
      globalError={globalError}
      footerText="¿Ya tienes cuenta?"
      footerLinkText="Inicia sesión"
      footerLinkTo="/login"
      showBackButton
    >
        <FormField
          id="reg-name"
          label="Nombre Completo"
          name="name"
          placeholder="Tu nombre"
          autoComplete="name"
          value={values.name}
          onChange={onChange}
          error={errors.name}
        />
        <FormField
          id="reg-email"
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
          id="reg-pass"
          label="Contraseña"
          name="password"
          placeholder="••••••••"
          autoComplete="new-password"
          value={values.password}
          onChange={onChange}
          onFocus={() => setShowPasswordChecks(true)}
          aria-describedby="reg-pass-checks"
        />

        {(showPasswordChecks || values.password.length > 0) && (
          <ul id="reg-pass-checks" className="password-checks" aria-live="polite">
            {passwordStatus.map((check) => (
              <li key={check.id} className={check.done ? 'password-checks__item is-valid' : 'password-checks__item'}>
                <span aria-hidden="true" className="password-checks__icon">{check.done ? '✓' : '•'}</span>
                <span>{check.label}</span>
              </li>
            ))}
          </ul>
        )}

        <PasswordField
          id="reg-pass2"
          label="Confirmar Contraseña"
          name="confirm"
          placeholder="••••••••"
          autoComplete="new-password"
          value={values.confirm}
          onChange={onChange}
          aria-describedby={errors.confirm ? 'reg-pass2-error' : undefined}
        />
        {errors.confirm && <div id="reg-pass2-error" role="alert" className="field__error">{errors.confirm}</div>}
    </AuthFormLayout>
  );
}