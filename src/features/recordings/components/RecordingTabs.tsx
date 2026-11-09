import type {
  RecordingTab,
} from "../types/recordings.types";

interface Props {
  value: RecordingTab;

  onChange: (
    value: RecordingTab
  ) => void;
}

export default function RecordingTabs({
  value,
  onChange,
}: Props) {

  return (
    <div
      className="
        flex
        justify-between
        gap-4
        px-2
      "
    >

      <button
        onClick={() =>
          onChange(
            "published"
          )
        }
        className={`
          text-xl
          font-semibold

          ${
            value ===
            "published"
              ? `
                rounded-xl
                bg-(--primary)
                px-3
                text-white
              `
              : `
                text-(--text-secondary)
              `
          }
        `}
      >
        Publicadas
      </button>

      <button
        onClick={() =>
          onChange("draft")
        }
        className={`
          text-xl
          font-semibold

          ${
            value === "draft"
              ? `
                rounded-xl
                bg-(--primary)
                px-3
                text-white
              `
              : `
                text-(--text-secondary)
              `
          }
        `}
      >
        Por publicar
      </button>

      <button
        onClick={() =>
          onChange(
            "processing"
          )
        }
        className={`
          text-xl
          font-semibold

          ${
            value ===
            "processing"
              ? `
                rounded-xl
                bg-(--primary)
                px-3
                text-white
              `
              : `
                text-(--text-secondary)
              `
          }
        `}
      >
        Procesando
      </button>

    </div>
  );
}