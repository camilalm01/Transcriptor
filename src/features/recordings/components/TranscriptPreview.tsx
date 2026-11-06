interface Props {
  text: string;
}

export default function TranscriptPreview({
  text,
}: Props) {

  return (
    <div
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

    </div>
  );
}