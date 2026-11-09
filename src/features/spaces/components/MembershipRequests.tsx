import { useMyMemberships } from "../hooks/useSpaceActions";

/** Solicitudes del estudiante que aún no son reuniones accesibles (el espacio responde 404 mientras está pendiente). */
export default function MembershipRequests() {
  const { data = [] } = useMyMemberships();

  const items = data.filter(
    (m) => m.status === "PENDING" 
  );

  if (items.length === 0) return null;

  return (
    <section aria-label="Mis solicitudes" className="space-y-2">
      <h2 className="text-lg font-bold">Mis solicitudes</h2>

      {items.map((m) => (
        <div
          key={`${m.spaceId}-${m.requestedAt}`}
          className="rounded-2xl border border-(--border) bg-(--surface) p-4"
        >
          <p className="font-semibold">{m.spaceName}</p>
          <p className="text-sm text-(--text-secondary)">
            {m.ownerName}
          </p>
          <p
            className={`mt-1 text-sm font-medium ${
              m.status === "PENDING" ? "text-blue-700" : "text-red-600"
            }`}
          >
            {m.status === "PENDING"
              ? "En espera de aprobación"
              : "Solicitud rechazada"}
          </p>
        </div>
      ))}
    </section>
  );
}
