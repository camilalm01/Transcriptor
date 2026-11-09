import { useNavigate } from "react-router-dom";

import Button from "../../../shared/components/ui/buttons/Button";
import { useLiveRecordings } from "../hooks/useLiveRecordings";

interface LiveNowListProps {
  /** Si se indica, solo muestra las clases de esa reunión */
  spaceId?: string;
}

export default function LiveNowList({ spaceId }: LiveNowListProps) {
  const navigate = useNavigate();
  const { data: live = [] } = useLiveRecordings(spaceId);

  if (live.length === 0) return null;

  return (
    <section aria-label="Clases en vivo ahora" className="space-y-3">
      <h2 className="flex items-center gap-2 text-lg font-bold text-red-600">
        <span
          aria-hidden="true"
          className="h-3 w-3 animate-pulse rounded-full bg-red-600"
        />
        En vivo ahora
      </h2>

      {live.map((recording) => (
        <div
          key={recording.id}
          className="flex items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 p-4"
        >
          <div className="min-w-0">
            <p className="truncate font-semibold">{recording.title}</p>
            <p className="truncate text-sm text-(--text-secondary)">
              {recording.space?.name} · {recording.owner.name}
            </p>
          </div>

          <Button
            size="sm"
            aria-label={`Ver subtítulos en vivo de ${recording.title}`}
            onClick={() =>
              navigate(`/meetings/${recording.space?.id}/live/${recording.id}`)
            }
          >
            Ver en vivo
          </Button>
        </div>
      ))}
    </section>
  );
}
