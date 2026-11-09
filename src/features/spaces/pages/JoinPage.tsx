import { useNavigate, useParams } from "react-router-dom";

import AuthLayout from "../../../app/layouts/AuthLayout";
import Button from "../../../shared/components/ui/buttons/Button";

import { useAuth } from "../../../contexts/auth/useAuth";
import { useJoinSpace } from "../hooks/useSpaceActions";

/** Destino del QR y del enlace de invitación: /join/<código>. ProtectedRoute ya exige sesión y vuelve aquí tras el login. */
export default function JoinPage() {
  const { code = "" } = useParams();
  const navigate = useNavigate();
  const { setRole } = useAuth();
  const join = useJoinSpace();

  const goToMeetings = () => {
    setRole("viewer");
    navigate("/meetings", { replace: true });
  };

  return (
    <AuthLayout>
      <div className="w-full space-y-6 px-6 py-6 text-center">
        <h1 className="text-3xl font-bold">Unirse a una reunión</h1>

        {join.isSuccess ? (
          <>
            <p role="status" className="text-green-700">
              {join.data.message}
            </p>
            <p className="text-[var(--text-secondary)]">
              Reunión: <strong>{join.data.spaceName}</strong>
            </p>
            <Button fullWidth size="lg" onClick={goToMeetings}>
              Ir a mis reuniones
            </Button>
          </>
        ) : (
          <>
            <p className="text-[var(--text-secondary)]">
              Vas a solicitar acceso con el código
            </p>
            <p className="text-3xl font-bold tracking-wider">{code}</p>

            {join.error && (
              <p role="alert" className="text-red-600">
                {join.error.message}
              </p>
            )}

            <Button
              fullWidth
              size="lg"
              disabled={join.isPending || !code}
              onClick={() => join.mutate(code)}
            >
              {join.isPending ? "Enviando..." : "Solicitar acceso"}
            </Button>

            <Button fullWidth variant="secondary" onClick={() => navigate("/meetings")}>
              Cancelar
            </Button>
          </>
        )}
      </div>
    </AuthLayout>
  );
}
