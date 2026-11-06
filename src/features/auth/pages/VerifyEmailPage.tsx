import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import AuthLayout from "../../../app/layouts/AuthLayout";
import Button from "../../../shared/components/ui/buttons/Button";

import { useAuth } from "../../../contexts/auth/useAuth";
import { authService } from "../services/authService";

type Status = "loading" | "ok" | "error";

export default function VerifyEmailPage() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading, login } = useAuth();

  const [status, setStatus] = useState<Status>(token ? "loading" : "error");
  const [message, setMessage] = useState(token ? "" : "El enlace no es válido.");

  // El token se usa una sola vez: este ref evita la doble ejecución de StrictMode.
  const started = useRef(false);
  const refreshedUser = useRef(false);

  useEffect(() => {
    if (!token || started.current) return;
    started.current = true;

    authService
      .verifyEmail(token)
      .then((r) => {
        setMessage(r.message);
        setStatus("ok");
      })
      .catch((error: unknown) => {
        setMessage(
          error instanceof Error
            ? error.message
            : "No fue posible verificar el correo."
        );
        setStatus("error");
      });
  }, [token]);

  // Si ya hay sesión, se actualiza el usuario para que desaparezca el aviso de verificación.
  useEffect(() => {
    if (status !== "ok" || authLoading || !isAuthenticated || refreshedUser.current) return;
    refreshedUser.current = true;

    authService.me().then(login).catch(() => {
      // no es crítico: se actualizará en el próximo inicio de sesión
    });
  }, [status, authLoading, isAuthenticated, login]);

  return (
    <AuthLayout>
      <div className="w-full px-6 py-6 text-center space-y-6">
        <h1 className="text-3xl font-bold">Verificar correo</h1>

        {status === "loading" && (
          <p role="status" aria-live="polite">Verificando...</p>
        )}

        {status === "ok" && (
          <p role="status" className="text-green-700">{message}</p>
        )}

        {status === "error" && (
          <p role="alert" className="text-red-600">{message}</p>
        )}

        {status !== "loading" && (
          <Button
            fullWidth
            size="lg"
            onClick={() => navigate(isAuthenticated ? "/roles" : "/", { replace: true })}
          >
            {isAuthenticated ? "Continuar" : "Ir a iniciar sesión"}
          </Button>
        )}
      </div>
    </AuthLayout>
  );
}
