import { useEffect, useRef } from "react";
import QrScanner from "qr-scanner";

interface QrScannerModalProps {
  open: boolean;
  onClose: () => void;
  onCodeScanned: (code: string) => void;
}

export default function QrScannerModal({
  open,
  onClose,
  onCodeScanned,
}: QrScannerModalProps) {

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {

    if (
      !open ||
      !videoRef.current
    ) {
      return;
    }

    const scanner =
      new QrScanner(
        videoRef.current,
        (result) => {
          onCodeScanned(
            result
          );

          scanner.stop();

          onClose();
        }
      );

    scanner.start();

    return () => {
      scanner.stop();
      scanner.destroy();
    };

  }, [
    open,
    onClose,
    onCodeScanned,
  ]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/70
      "
    >
      <div
        className="
          rounded-xl
          bg-white
          p-4
        "
      >
        <video
          ref={videoRef}
          className="
            h-80
            w-80
          "
        />

        <button
          onClick={onClose}
          className="
            mt-4
            w-full
          "
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}