import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import AuthLayout from "../../../app/layouts/AuthLayout";
import Input from "../../../shared/components/ui/forms/Input";
import Button from "../../../shared/components/ui/buttons/Button";

import PasswordRules from "../components/PasswordRules";
import { authService } from "../services/authService";
import {
  isPasswordValid,
  passwordsMatch,
  validatePassword,
} from "../utils/authValidators";

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const rules = useMemo(() => validatePassword(password), [password]);
  const isValid = isPasswordValid(password) && passwordsMatch(password, confirmPassword);

  if (!token) {
    return (
      <AuthLayout>
        <div className="w-full px-6 py-6 text-center space-y-6">
          <h1 className="text-3xl font-bold">Enlace no válido</h1>
          <p role="alert" className="text-red-600">
            El enlace de recuperación no es válido o está incompleto.
          </p>
          <Link to="/olvide-contrasena" className="font-semibold text-blue-600">
            Solicitar un enlace nuevo
          </Link>
        </div>
      </AuthLayout>
    );
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid || isLoading) return;

    setError("");
    setIsLoading(true);

    try {
      const r = await authService.resetPassword(token, password);
      setSuccess(r.message);
      setTimeout(() => navigate("/", { replace: true }), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No fue posible cambiar la contraseña."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full px-6 py-6">
        <h1 className="mb-6 text-center text-3xl font-bold">Nueva contraseña</h1>

        {error && (
          <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div role="status" className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success} Redirigiendo al inicio de sesión...
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <p className="mb-2 font-medium">Contraseña nueva</p>
            <Input
              type="password"
              placeholder="Ingrese una contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {password.length > 0 && !isPasswordValid(password) && (
            <PasswordRules rules={rules} />
          )}

          <div>
            <p className="mb-2 font-medium">Confirmar contraseña</p>
            <Input
              type="password"
              placeholder="Repita la contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {confirmPassword && !passwordsMatch(password, confirmPassword) && (
              <p className="mt-2 text-sm text-red-500">
                ✗ Las contraseñas no coinciden
              </p>
            )}
          </div>

          <Button type="submit" fullWidth size="lg" disabled={!isValid || isLoading || Boolean(success)}>
            {isLoading ? "Guardando..." : "Cambiar contraseña"}
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}
