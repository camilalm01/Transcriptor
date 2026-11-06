import { Eye, Smartphone, Mic, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../../../app/layouts/MainLayout";

import { useAccessibility } from "../../../contexts/accessibility/useAccessibility";

import SelectableCard from "../../../shared/components/ui/settings/SelectableCard";
import NavigationButton from "../../../shared/components/ui/buttons/NavigationButton";

export default function AccessibilityPage() {

  const navigate = useNavigate();

  const {
    settings,
    setNavigationMode,
    toggleVisionSupport,
  } = useAccessibility();

  return (
    <MainLayout>
      <div className="space-y-6 p-5">

        <div>
          <h1 className="text-3xl font-bold">
            Accesibilidad
          </h1>

          <p className="mt-2 text-[var(--text-secondary)]">
            Personaliza la aplicación según tus necesidades.
          </p>
        </div>

        <div className="space-y-4">

          <h2 className="text-xl font-semibold">
            Modo de navegación
          </h2>

          <SelectableCard
            title="Estándar"
            description="Interfaz completa"
            selected={
              settings.navigationMode ===
              "standard"
            }
            onClick={() =>
              setNavigationMode(
                "standard"
              )
            }
          />

          <SelectableCard
            title="Simplificado"
            description="Interfaz más sencilla"
            selected={
              settings.navigationMode ===
              "simple"
            }
            onClick={() =>
              setNavigationMode(
                "simple"
              )
            }
          />
        </div>

        <SelectableCard
          title="Problemas de visión"
          description="Aumenta el tamaño del texto, mejora el contraste y ajusta colores."
          icon={Eye}
          selected={
            settings.visionSupport
          }
          onClick={() =>
            toggleVisionSupport()
          }
        />

        <NavigationButton
          icon={SlidersHorizontal}
          title="Personalizar ajustes"
          onClick={() =>
            navigate(
              "/accessibility/settings"
            )
          }
        />

        <NavigationButton
          icon={Smartphone}
          title="TalkBack"
          onClick={() =>
            window.open(
              "https://support.google.com/accessibility/android/answer/6283677",
              "_blank"
            )
          }
        />

        <NavigationButton
          icon={Mic}
          title="Voice Access"
          onClick={() =>
            window.open(
              "https://support.google.com/accessibility/android/answer/6151848",
              "_blank"
            )
          }
        />

      </div>
    </MainLayout>
  );
}