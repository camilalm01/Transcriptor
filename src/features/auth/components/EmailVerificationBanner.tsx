import { useState } from "react";

import { useAuth } from "../../../contexts/auth/useAuth";
import { authService } from "../services/authService";

/** Aviso para cuentas en PENDING_VERIFICATION: el backend rechaza casi todo con 403 EMAIL_NOT_VERIFIED. */
export default function EmailVerificationBanner() {
  const { user } = useAuth();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  if (!user || user.emailVerified) {
    return null;
  }

  const handleResend = async () => {
    setStatus("sending");
    try {
      await authService.resendVerification(user.email);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="border-b border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-800"
    >
      <p>
        Verifica tu correo ({user.email}) para usar todas las funciones.
      </p>

      <button
        type="button"
        onClick={handleResend}
        disabled={status === "sending" || status === "sent"}
        className="mt-1 font-semibold underline disabled:opacity-60"
      >
        {status === "sent"
          ? "Correo enviado"
          : status === "sending"
            ? "Enviando..."
            : "Reenviar correo"}
      </button>

      {status === "error" && (
        <span className="ml-3 text-red-600">
          No se pudo reenviar. Intenta más tarde.
        </span>
      )}
    </div>
  );
}
