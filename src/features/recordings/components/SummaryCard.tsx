interface Props {
  summary: string;
}

export default function SummaryCard({
  summary,
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
        Resumen
      </h2>

      <p>
        {summary}
      </p>

    </div>
  );
}