import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../../../app/layouts/AuthLayout";

import Button from "../../../shared/components/ui/buttons/Button";
import SelectableCard from "../../../shared/components/ui/settings/SelectableCard";

export default function RoleSelectionPage() {
  const [selectedRole, setSelectedRole] =
    useState<
      "speaker" | "viewer" | null
    >(null);

  const navigate = useNavigate();

  const handleContinue = () => {
    if (!selectedRole) return;

    navigate("/meetings");
  };

  return (
    <AuthLayout>
      <div
        className="
          h-full
          bg-white
          px-6
          pt-12
          flex
          flex-col
          justify-center
          gap-6
        "
      >
        <h1
          className="
            text-center
            text-3xl
            font-bold
            gap-4
          "
        >
          Selecciona un rol
        </h1>

        <p className="text-center text-slate-600">
          Elige el rol que mejor se adapte a tus necesidades.
        </p>

        <SelectableCard
          title="Modo orador"
          description="Crear reuniones y sesiones."
          selected={
            selectedRole === "speaker"
          }
          onClick={() =>
            setSelectedRole("speaker")
          }
        />

        <SelectableCard
          title="Modo espectador"
          description="Unirse y visualizar contenido."
          selected={
            selectedRole === "viewer"
          }
          onClick={() =>
            setSelectedRole("viewer")
          }
        />

        <Button
          size="lg"
          fullWidth
          disabled={!selectedRole}
          onClick={handleContinue}
        >
          Continuar
        </Button>
      </div>
    </AuthLayout>
  );
}