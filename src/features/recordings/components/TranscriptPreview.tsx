import { ChevronRight } from "lucide-react";

interface Props {
  text: string;

  onOpen?: () => void;
}

export default function TranscriptPreview({
  text,
  onOpen,
}: Props) {

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
        Transcripción
      </h2>

      <p
        className="
          line-clamp-5
          whitespace-pre-wrap
        "
      >
        {text}
      </p>

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
        Ver transcripción completa

        <ChevronRight size={18} />
      </button>
    </div>
  );
}