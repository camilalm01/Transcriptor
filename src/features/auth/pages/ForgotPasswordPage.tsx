import { useState } from "react";
import { Link } from "react-router-dom";

import AuthLayout from "../../../app/layouts/AuthLayout";
import Input from "../../../shared/components/ui/forms/Input";
import Button from "../../../shared/components/ui/buttons/Button";

import { authService } from "../services/authService";
import { validateEmail } from "../utils/authValidators";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateEmail(email) || isLoading) return;

    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const r = await authService.forgotPassword(email.trim());
      setMessage(r.message);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No fue posible enviar el correo."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full px-6 py-6">
        <h1 className="mb-4 text-center text-3xl font-bold">
          Recuperar contraseña
        </h1>

        <p className="mb-6 text-center text-[var(--text-secondary)]">
          Escribe tu correo y te enviaremos un enlace para crear una nueva contraseña.
        </p>

        {error && (
          <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {message && (
          <div role="status" className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <p className="mb-2 font-medium">Correo electrónico</p>
            <Input
              type="email"
              placeholder="correo@dominio.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button type="submit" fullWidth size="lg" disabled={!validateEmail(email) || isLoading}>
            {isLoading ? "Enviando..." : "Enviar enlace"}
          </Button>
        </form>

        <p className="mt-8 text-center">
          <Link to="/" className="font-semibold text-blue-600">
            Volver a iniciar sesión
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
