import { useState } from "react";

interface SpeechRecognitionResultItem {
  transcript: string;
}

interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: SpeechRecognitionResultItem;
    };
  };
}

interface SpeechRecognitionInstance {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;

  onstart: (() => void) | null;
  onend: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;

  start(): void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

declare global {
  interface Window {
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
    SpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export function useSpeechCode() {
  const [listening, setListening] =
    useState(false);

  const startListening = (
    onResult: (text: string) => void
  ) => {
    const SpeechRecognition =
      window.SpeechRecognition ??
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Tu navegador no soporta reconocimiento de voz."
      );
      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.lang = "es-EC";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onresult = (
      event: SpeechRecognitionEvent
    ) => {
      const transcript =
        event.results[0][0].transcript;

      const code = transcript
        .toUpperCase()
        .replace(/\s+/g, "-");

      onResult(code);
    };

    recognition.start();
  };

  return {
    listening,
    startListening,
  };
}