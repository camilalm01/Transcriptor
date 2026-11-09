import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";

import { API_URL, getAccessToken } from "./client";

/**
 * Conexión Socket.IO al namespace /ws. No se conecta sola: el RealtimeProvider
 * la abre al iniciar sesión y la cierra al salir. El token se lee en cada
 * (re)conexión, así siempre se envía el vigente (dura 15 min).
 */
export const socket: Socket = io(`${API_URL}/ws`, {
  transports: ["websocket"],
  autoConnect: false,
  auth: (cb) => cb({ token: getAccessToken() }),
});
