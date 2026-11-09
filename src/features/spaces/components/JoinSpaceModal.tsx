import { useState } from "react";

import Modal from "../../../shared/components/ui/modals/Modal";
import Input from "../../../shared/components/ui/forms/Input";
import Button from "../../../shared/components/ui/buttons/Button";

import { useJoinSpace } from "../hooks/useSpaceActions";

interface JoinSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JoinSpaceModal({ isOpen, onClose }: JoinSpaceModalProps) {
  const [code, setCode] = useState("");
  const join = useJoinSpace();

  const handleClose = () => {
    setCode("");
    join.reset();
    onClose();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (code.trim().length < 8 || join.isPending) return;
    join.mutate(code.trim());
  };

  return (
    <Modal isOpen={isOpen} title="Unirse a una reunión" onClose={handleClose}>
      {join.isSuccess ? (
        <div role="status" className="space-y-4">
          <p>{join.data.message}</p>
          <p className="text-sm text-(--text-secondary)">
            Reunión: <strong>{join.data.spaceName}</strong>
          </p>
          <Button fullWidth onClick={handleClose}>
            Entendido
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="join-code" className="mb-2 block font-medium">
              Código de la reunión
            </label>
            <Input
              id="join-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Ej: K7P3-QX9M"
              autoComplete="off"
              autoCapitalize="characters"
              maxLength={14}
            />
          </div>

          {join.error && (
            <p role="alert" className="text-sm text-red-600">
              {join.error.message}
            </p>
          )}

          <Button
            type="submit"
            fullWidth
            size="lg"
            disabled={code.trim().length < 8 || join.isPending}
          >
            {join.isPending ? "Enviando..." : "Solicitar acceso"}
          </Button>
        </form>
      )}
    </Modal>
  );
}
