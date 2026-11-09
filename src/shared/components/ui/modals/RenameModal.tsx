import { useEffect, useState } from "react";

import Modal from "./Modal";

interface Props {
  isOpen: boolean;

  title?: string;

  defaultValue?: string;

  onClose: () => void;

  onConfirm: (
    value: string
  ) => void;
}

export default function RenameModal({
  isOpen,
  title = "Renombrar",
  defaultValue = "",
  onClose,
  onConfirm,
}: Props) {

  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <Modal
      isOpen={isOpen}
      title={title}
      onClose={onClose}
    >
      <div className="space-y-4">

        <input
          autoFocus
          value={value}
          onChange={(e) =>
            setValue(
              e.target.value
            )
          }
          className="
            w-full
            rounded-xl
            border
            border-(--border)
            p-3
          "
        />

        <div className="flex gap-3">

          <button
            type="button"
            onClick={onClose}
            className="
              flex-1
              rounded-xl
              border
              py-3
            "
          >
            Cancelar
          </button>

          <button
            type="button"
            disabled={
              !value.trim()
            }
            onClick={() =>
              onConfirm(
                value.trim()
              )
            }
            className="
              flex-1
              rounded-xl
              bg-(--primary)
              py-3
              text-white
            "
          >
            Guardar
          </button>

        </div>
      </div>
    </Modal>
  );
}