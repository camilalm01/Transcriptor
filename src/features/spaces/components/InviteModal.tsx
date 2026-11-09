import { useEffect, useState } from "react";

import Modal from "../../../shared/components/ui/modals/Modal";
import Button from "../../../shared/components/ui/buttons/Button";

import { useInviteActions } from "../hooks/useSpaceActions";
import { spacesService } from "../services/spacesService";
import type { Space } from "../types/spaces.types";

interface InviteModalProps {
  space: Space;
  isOpen: boolean;
  onClose: () => void;
}

export default function InviteModal({ space, isOpen, onClose }: InviteModalProps) {
  const invite = space.invite;
  const { rotate, toggle } = useInviteActions(space.id);

  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState<"code" | "link" | null>(null);
  const [confirmRotate, setConfirmRotate] = useState(false);

  // El QR cambia cuando se genera un código nuevo.
  const code = invite?.code;
  useEffect(() => {
    if (!isOpen || !code) return;

    let objectUrl: string | null = null;
    let cancelled = false;

    spacesService
      .getInviteQr(space.id)
      .then((url) => {
        if (cancelled) {
          URL.revokeObjectURL(url);
          return;
        }
        objectUrl = url;
        setQrUrl(url);
      })
      .catch(() => setQrUrl(null));

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [isOpen, code, space.id]);

  if (!invite) {
    return (
      <Modal isOpen={isOpen} title="Invitar" onClose={onClose}>
        <p>Solo el dueño de la reunión puede ver el código de invitación.</p>
      </Modal>
    );
  }

  const copy = async (text: string, kind: "code" | "link") => {
    await navigator.clipboard.writeText(text);
    setCopied(kind);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleClose = () => {
    setConfirmRotate(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} title="Invitar a la reunión" onClose={handleClose}>
      <div className="space-y-5">
        <div className="text-center">
          <p className="text-sm text-(--text-secondary)">Código</p>
          <p className="text-4xl font-bold tracking-wider">{invite.code}</p>
          {!invite.active && (
            <p role="status" className="mt-2 text-sm text-yellow-700">
              Las inscripciones están pausadas.
            </p>
          )}
        </div>

        {qrUrl && (
          <img
            src={qrUrl}
            alt={`Código QR para unirse a ${space.name}`}
            className="mx-auto h-52 w-52 bg-white p-2"
          />
        )}

        <div className="flex gap-3">
          <Button
            fullWidth
            variant="secondary"
            onClick={() => copy(invite.code, "code")}
          >
            {copied === "code" ? "Copiado" : "Copiar código"}
          </Button>

          <Button
            fullWidth
            variant="secondary"
            onClick={() => copy(invite.url, "link")}
          >
            {copied === "link" ? "Copiado" : "Copiar enlace"}
          </Button>
        </div>

        <Button
          fullWidth
          variant="secondary"
          disabled={toggle.isPending}
          onClick={() => toggle.mutate(!invite.active)}
        >
          {invite.active ? "Pausar inscripciones" : "Reanudar inscripciones"}
        </Button>

        {confirmRotate ? (
          <div role="alert" className="space-y-3 rounded-2xl border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-800">
            <p>El código y el QR anteriores dejarán de funcionar.</p>
            <div className="flex gap-3">
              <Button
                fullWidth
                variant="danger"
                disabled={rotate.isPending}
                onClick={() =>
                  rotate.mutate(undefined, { onSuccess: () => setConfirmRotate(false) })
                }
              >
                Generar código nuevo
              </Button>
              <Button fullWidth variant="secondary" onClick={() => setConfirmRotate(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <Button fullWidth variant="secondary" onClick={() => setConfirmRotate(true)}>
            Generar código nuevo
          </Button>
        )}

        {(rotate.error || toggle.error) && (
          <p role="alert" className="text-sm text-red-600">
            {(rotate.error ?? toggle.error)?.message}
          </p>
        )}
      </div>
    </Modal>
  );
}
