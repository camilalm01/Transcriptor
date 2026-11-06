import {
  useEffect,
  useState,
} from "react";

export function useMicrophone() {

  const [ ready, setReady] = useState(false);
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState("");

  useEffect(() => {

    const checkMicrophone =
      async () => {

        try {

          const stream =
            await navigator
              .mediaDevices
              .getUserMedia({
                audio: true,
              });

          stream
            .getTracks()
            .forEach(
              (track) =>
                track.stop()
            );

          setReady(true);

        } catch {

          setReady(false);

          setError(
            "No fue posible acceder al micrófono."
          );

        } finally {

          setLoading(false);
        }
      };

    checkMicrophone();

  }, []);

  return {
    ready,
    loading,
    error,
  };
}