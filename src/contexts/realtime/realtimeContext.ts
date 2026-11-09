import { createContext } from "react";
import type { Socket } from "socket.io-client";

export interface RealtimeContextType {
  socket: Socket;
  /** true cuando el servidor aceptó la sesión (evento "connected") */
  connected: boolean;
}

export const RealtimeContext = createContext<RealtimeContextType | undefined>(
  undefined
);
