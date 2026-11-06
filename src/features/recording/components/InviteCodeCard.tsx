import { QrCode } from "lucide-react";
import Button from "../../../shared/components/ui/buttons/Button";

interface Props {
  code: string;
}

export default function MeetingCodeCard({
  code,
}: Props) {
  return (
    <div
      className="
        rounded-3xl
        border
        border-(--border)
        p-5
        text-center
      "
    >
      <p
        className="
          text-sm
          font-semibold
        "
      >
        CÓDIGO DE ACCESO
      </p>

      <h2
        className="
          mt-4

          text-4xl
          font-bold
        "
      >
        {code}
      </h2>

      <p
        className="
          mt-4
          text-sm
          text-(--text-secondary)
        "
      >
        Comparte este código o el QR
        para que otros se unan a tu sesión.
      </p>

      <Button
        fullWidth
        className="mt-5 
            bg-(--primary-surface)
            text-(--primary)"
        variant="secondary"
        icon={QrCode}
      >
        Mostrar QR
      </Button>
    </div>
  );
}