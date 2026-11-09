import { Copy, QrCode } from "lucide-react";

import Button from "../../../shared/components/ui/buttons/Button";

interface SpaceInfoCardProps {
  spaceCode: string;
  /** Abre el modal con QR y enlace (solo el dueño) */
  onShowInvite?: () => void;
}

export default function SpaceInfoCard({
  spaceCode,
  onShowInvite,
}: SpaceInfoCardProps) {

  const handleCopy = async () => {

    await navigator.clipboard.writeText(
      spaceCode
  
    );
  };

  return (
    <div
      className="
        rounded-3xl

        border
        border-(--border)

        bg-(--surface)

        p-5
      "
    >
      <div className="flex items-center justify-between">

        <div>
          <p
            className="
              text-sm
              text-(--text-secondary)
            "
          >
            Código de reunión
          </p>

          <h2
            className="
              text-3xl
              font-bold
            "
          >
            {spaceCode}
          </h2>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            variant="secondary"
            icon={Copy}
            onClick={handleCopy}
          >
            Copiar
          </Button>

          {onShowInvite && (
            <Button
              variant="secondary"
              icon={QrCode}
              onClick={onShowInvite}
            >
              QR
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}