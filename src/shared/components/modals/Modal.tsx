import type { ReactNode } from "react";
import { X } from "lucide-react";
import {useEffect, useRef} from "react";

interface ModalProps {
  isOpen: boolean;

  title?: string;

  children: ReactNode;

  onClose: () => void;
}

export default function Modal({
  isOpen,
  title,
  children,
  onClose
}: ModalProps) {
  
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-50

        flex
        items-center
        justify-center

        bg-black/40
        backdrop-blur-sm
      "
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="
          relative

          w-[90%]
          max-w-md

          rounded-3xl

          bg-[var(--surface)]

          p-6

          shadow-xl
          border
          border-[var(--border)]
        "
      >
        <button
          type="button"
          aria-label="Cerrar modal"
          onClick={onClose}
          className="
            absolute
            top-4
            right-4

            rounded-full

            p-2

            hover:bg-slate-100
          "
        >
          <X size={18} />
        </button>

        {title && (
          <h2
            id="modal-title"
            className="
              mb-5
              text-xl
              font-bold
            "
          >
            {title}
          </h2>
        )}

        {children}
      </div>
    </div>
  );
}