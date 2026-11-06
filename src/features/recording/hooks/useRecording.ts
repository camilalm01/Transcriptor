import {
  useEffect,
  useRef,
  useState,
} from "react";

import {useRecordingContext} from "../../../contexts/recording/useRecordingContext";

export function useRecording() {

  const {setAudioBlob, setDuration } = useRecordingContext();
  const [recording, setRecording ] = useState(false);
  const [paused, setPaused ] = useState(false);
  const [elapsedSeconds, setElapsedSeconds ] = useState(0);

  const mediaRecorderRef =
    useRef<MediaRecorder | null>(
      null
    );

  const streamRef =
    useRef<MediaStream | null>(
      null
    );

  const chunksRef =
    useRef<Blob[]>([]);

  useEffect(() => {

    if (
      !recording ||
      paused
    ) {
      return;
    }

    const timer =
      window.setInterval(
        () => {
          setElapsedSeconds(
            (prev) =>
              prev + 1
          );
        },
        1000
      );

    return () =>
      clearInterval(timer);

  }, [
    recording,
    paused,
  ]);

  const startRecording =
    async () => {

      try {

        const stream =
          await navigator
            .mediaDevices
            .getUserMedia({
              audio: true,
            });

        streamRef.current =
          stream;

        chunksRef.current = [];

        const recorder =
          new MediaRecorder(
            stream,
            {
              mimeType:
                "audio/webm;codecs=opus",
            }
          );

        recorder.ondataavailable =
          event => {

            if (
              event.data.size > 0
            ) {

              chunksRef.current.push(
                event.data
              );
            }
          };

        recorder.start();

        mediaRecorderRef.current =
          recorder;

        setElapsedSeconds(0);

        setRecording(true);

        setPaused(false);

      } catch (error) {

        console.error(
          "Error obteniendo micrófono",
          error
        );
      }
    };

  const pauseRecording =
    () => {

      if (
        !mediaRecorderRef.current
      ) {
        return;
      }

      mediaRecorderRef.current.pause();

      setPaused(true);
    };

  const resumeRecording =
    () => {

      if (
        !mediaRecorderRef.current
      ) {
        return;
      }

      mediaRecorderRef.current.resume();

      setPaused(false);
    };

  const stopRecording =
    (
      onFinished?: (
        blob: Blob
      ) => void
    ) => {

      if (
        !mediaRecorderRef.current
      ) {
        return;
      }

      mediaRecorderRef.current.onstop =
        () => {

          const blob =
            new Blob(
              chunksRef.current,
              {
                type:
                  "audio/webm;codecs=opus",
              }
            );

          setAudioBlob(blob);

          setDuration(
            elapsedSeconds
          );

          streamRef.current
            ?.getTracks()
            .forEach(
              track =>
                track.stop()
            );

          streamRef.current =
            null;

          mediaRecorderRef.current =
            null;

          onFinished?.(blob);
        };

      mediaRecorderRef.current.stop();

      setRecording(false);

      setPaused(false);
    };

  const resetRecording =
    () => {

      chunksRef.current = [];

      streamRef.current = null;

      mediaRecorderRef.current =
        null;

      setElapsedSeconds(0);

      setAudioBlob(null);

      setDuration(0);

      setRecording(false);

      setPaused(false);
    };

  return {

    recording,

    paused,

    elapsedSeconds,

    startRecording,

    pauseRecording,

    resumeRecording,

    stopRecording,

    resetRecording,
  };
}