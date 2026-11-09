import { ChevronRight } from "lucide-react";
import type {SummaryResponse} from "../types/recordings.types";

interface Props {
  summary: SummaryResponse;
  onOpen?: () => void;
}

export default function SummaryCard({
  summary,
  onOpen,
}: Props) {
  const content = summary.content;

  const preview =
    content.resumenGeneral.length > 350
      ? `${content.resumenGeneral.slice(
          0,
          350
        )}...`
      : content.resumenGeneral;

  return (
    <div
      className="
        rounded-2xl
        border
        border-(--border)
        bg-(--surface)
        p-5
      "
    >
      <h2
        className="
          mb-4
          text-xl
          font-bold
        "
      >
        Resumen IA
      </h2>

      <p
        className="
          whitespace-pre-wrap
        "
      >
        {preview}
      </p>

      {content.temas.length > 0 && (
        <div className="mt-4">
          <h3
            className="
              mb-2
              font-semibold
            "
          >
            Temas principales
          </h3>

          <div className="flex flex-wrap gap-2">
            {content.temas
              .slice(0, 3)
              .map((tema) => (
                <span
                  key={tema.nombre}
                  className="
                    rounded-full
                    bg-blue-100
                    px-3
                    py-1
                    text-sm
                  "
                >
                  {tema.nombre}
                </span>
              ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onOpen}
        className="
          mt-5
          flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-blue-50
          py-3
          font-semibold
          text-(--primary)
        "
      >
        Ver resumen completo

        <ChevronRight size={18} />
      </button>
    </div>
  );
}