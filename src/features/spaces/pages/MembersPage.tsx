import { useState } from "react";
import { useParams } from "react-router-dom";

import MainLayout from "../../../app/layouts/MainLayout";
import Header from "../../../shared/components/ui/navigation/Header";
import Button from "../../../shared/components/ui/buttons/Button";

import { useSpace } from "../hooks/useSpace";
import {
  useMemberActions,
  useMembers,
  useSpaceSettings,
} from "../hooks/useSpaceActions";
import type { MembershipStatus, SpaceMember } from "../types/spaces.types";

type Tab = "pending" | "members" | "others";

const OTHER_STATUSES: MembershipStatus[] = ["REJECTED", "REMOVED", "BLOCKED", "LEFT"];

const STATUS_LABEL: Record<MembershipStatus, string> = {
  PENDING: "Pendiente",
  APPROVED: "Miembro",
  REJECTED: "Rechazada",
  REMOVED: "Expulsado",
  BLOCKED: "Bloqueado",
  LEFT: "Salió",
};

export default function MembersPage() {
  const { spaceId = "" } = useParams();
  const { data: space} = useSpace(spaceId);
  const { data: members = [], isLoading, error } = useMembers(spaceId);
  const { single, bulk } = useMemberActions(spaceId);
  const settings = useSpaceSettings(spaceId);
  const [tab, setTab] = useState<Tab>("pending");

  const pending = members.filter((m) => m.status === "PENDING");
  const approved = members.filter((m) => m.status === "APPROVED");
  const others = members.filter((m) => OTHER_STATUSES.includes(m.status));

  const visible = tab === "pending" ? pending : tab === "members" ? approved : others;
  const busy = single.isPending || bulk.isPending;
  const actionError = single.error ?? bulk.error;

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "pending", label: "Solicitudes", count: pending.length },
    { id: "members", label: "Miembros", count: approved.length },
    { id: "others", label: "Otros", count: others.length },
  ];

  const renderActions = (m: SpaceMember) => {
    if (m.status === "PENDING") {
      return (
        <>
          <Button
            size="sm"
            disabled={busy}
            aria-label={`Aprobar a ${m.name}`}
            onClick={() => single.mutate({ userId: m.userId, action: "approve" })}
          >
            Aprobar
          </Button>
          <Button
            size="sm"
            variant="secondary"
            disabled={busy}
            aria-label={`Rechazar a ${m.name}`}
            onClick={() => single.mutate({ userId: m.userId, action: "reject" })}
          >
            Rechazar
          </Button>
        </>
      );
    }

    if (m.status === "APPROVED") {
      return (
        <>
          <Button
            size="sm"
            variant="secondary"
            disabled={busy}
            aria-label={`Expulsar a ${m.name}`}
            onClick={() => single.mutate({ userId: m.userId, action: "remove" })}
          >
            Expulsar
          </Button>
          <Button
            size="sm"
            variant="danger"
            disabled={busy}
            aria-label={`Bloquear a ${m.name}`}
            onClick={() => single.mutate({ userId: m.userId, action: "block" })}
          >
            Bloquear
          </Button>
        </>
      );
    }

    if (m.status === "BLOCKED") {
      return (
        <Button
          size="sm"
          variant="secondary"
          disabled={busy}
          aria-label={`Desbloquear a ${m.name}`}
          onClick={() => single.mutate({ userId: m.userId, action: "unblock" })}
        >
          Desbloquear
        </Button>
      );
    }

    return null;
  };

  return (
    <MainLayout>
      <Header title={space ? `Usuarios · ${space.name}` : "Usuarios"} showBackButton />

      <div className="space-y-5 p-5">
        {space && space.myRole !== "OWNER" && (
          <p role="alert" className="text-red-600">
            Solo el dueño de la reunión puede gestionar usuarios.
          </p>
        )}

        {space?.myRole === "OWNER" && (
          <label className="flex items-start gap-3 rounded-2xl border border-(--border) bg-(--surface) p-4">
            <input
              type="checkbox"
              className="mt-1 h-5 w-5"
              checked={space.settings.liveCaptions ?? true}
              disabled={settings.isPending}
              onChange={(e) =>
                settings.mutate({ liveCaptions: e.target.checked })
              }
            />
            <span>
              <strong>Subtítulos en vivo para los miembros</strong>
              <span className="block text-sm text-(--text-secondary)">
                Los miembros aprobados pueden leer la clase mientras grabas.
              </span>
            </span>
          </label>
        )}

        {settings.error && (
          <p role="alert" className="text-red-600">
            {settings.error.message}
          </p>
        )}

        <div role="tablist" aria-label="Estado de los usuarios" className="flex gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold ${
                tab === t.id
                  ? "bg-(--primary)] text-white"
                  : "border border-(--border) bg-(--surface)"
              }`}
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        {tab === "pending" && pending.length > 1 && (
          <Button
            fullWidth
            disabled={busy}
            onClick={() =>
              bulk.mutate({
                action: "approve",
                userIds: pending.slice(0, 100).map((m) => m.userId),
              })
            }
          >
            Aprobar todas ({Math.min(pending.length, 100)})
          </Button>
        )}

        {isLoading && <p role="status">Cargando usuarios...</p>}

        {error && (
          <p role="alert" className="text-red-600">
            {error.message}
          </p>
        )}

        {actionError && (
          <p role="alert" className="text-red-600">
            {actionError.message}
          </p>
        )}

        {!isLoading && visible.length === 0 && (
          <p className="text-center text-(--text-secondary)">
            No hay usuarios en esta lista.
          </p>
        )}

        <ul className="space-y-3">
          {visible.map((m) => (
            <li
              key={m.userId}
              className="space-y-3 rounded-2xl border border-(--border) bg-(--surface) p-4"
            >
              <div>
                <p className="font-semibold">{m.name}</p>
                <p className="text-sm text-(--text-secondary)">{m.email}</p>
                <p className="text-sm text-(--text-secondary)">
                  {STATUS_LABEL[m.status]} ·{" "}
                  {new Date(m.requestedAt).toLocaleDateString()}
                  {m.requestCount > 1 && ` · ${m.requestCount} solicitudes`}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">{renderActions(m)}</div>
            </li>
          ))}
        </ul>
      </div>
    </MainLayout>
  );
}
