import {ArrowLeft} from "lucide-react";
import {useNavigate, useParams} from "react-router-dom";
import {useSummary} from "../hooks/useSummary";

export default function SummaryPage() {

  const navigate = useNavigate();
  const { recordingId } = useParams();

  const {
    data: summary,
    isLoading,
  } = useSummary(recordingId);

  if (isLoading) {
    return (
      <div className="p-5">
        Cargando...
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="p-5">
        No hay resumen.
      </div>
    );
  }

  const content = summary.content;

  return (
    <div
      className="
        mx-auto
        max-w-5xl
        space-y-6
        p-5
      "
    >
      <button
        type="button"
        onClick={() =>
          navigate(-1)
        }
        className="
          flex
          items-center
          gap-2
        "
      >
        <ArrowLeft size={20} />
        Volver
      </button>

      <div>
        <h1
          className="
            text-3xl
            font-bold
          "
        >
          {content.titulo}
        </h1>

        <p
          className="
            mt-2
            text-sm
            text-(--text-secondary)
          "
        >
          Resumen generado por IA
        </p>
      </div>

      <section
        className="
          rounded-2xl
          border
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
          Resumen general
        </h2>

        <p
          className="
            whitespace-pre-wrap
          "
        >
          {content.resumenGeneral}
        </p>
      </section>

      {content.temas.length > 0 && (
        <section
          className="
            rounded-2xl
            border
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
            Temas
          </h2>

          <div className="space-y-5">
            {content.temas.map(
              (tema) => (
                <div key={tema.nombre}>
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                    "
                  >
                    <h3 className="font-semibold">
                      {tema.nombre}
                    </h3>

                    {tema.minutoAprox && (
                      <span
                        className="
                          text-sm
                          text-(--text-secondary)
                        "
                      >
                        {tema.minutoAprox}
                      </span>
                    )}
                  </div>

                  <ul
                    className="
                      mt-2
                      list-disc
                      pl-5
                    "
                  >
                    {tema.puntosClave.map(
                      (punto) => (
                        <li key={punto}>
                          {punto}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )
            )}
          </div>
        </section>
      )}

      {content.palabrasClave.length > 0 && (
        <section
          className="
            rounded-2xl
            border
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
            Palabras clave
          </h2>

          <div
            className="
              flex
              flex-wrap
              gap-2
            "
          >
            {content.palabrasClave.map(
              (keyword) => (
                <span
                  key={keyword}
                  className="
                    rounded-full
                    bg-blue-100
                    px-3
                    py-1
                  "
                >
                  {keyword}
                </span>
              )
            )}
          </div>
        </section>
      )}

      {content.preguntasDeRepaso
        .length > 0 && (
        <section
          className="
            rounded-2xl
            border
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
            Preguntas de repaso
          </h2>

          <ul
            className="
              list-disc
              space-y-2
              pl-5
            "
          >
            {content.preguntasDeRepaso.map(
              (pregunta) => (
                <li key={pregunta}>
                  {pregunta}
                </li>
              )
            )}
          </ul>
        </section>
      )}
    </div>
  );
}