import Modal from "./Modal";

interface Props {
  isOpen: boolean;
  title: string;
  message: string;
  danger?: boolean;

  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  danger = false,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Modal
      isOpen={isOpen}
      title={title}
      onClose={onClose}
    >
      <div className="space-y-5">

        <p>{message}</p>

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
            onClick={onConfirm}
            className={`
              flex-1
              rounded-xl
              py-3
              text-white

              ${
                danger
                  ? "bg-red-600"
                  : "bg-(--primary)"
              }
            `}
          >
            Confirmar
          </button>

        </div>

      </div>
    </Modal>
  );
}