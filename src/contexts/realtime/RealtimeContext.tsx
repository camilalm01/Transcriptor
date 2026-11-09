import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { RealtimeContext } from "./realtimeContext";
import { socket } from "../../api/socket";
import { refreshSession } from "../../api/client";
import { useAuth } from "../auth/useAuth";

interface RealtimeProviderProps {
  children: ReactNode;
}

export function RealtimeProvider({ children }: RealtimeProviderProps) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [connected, setConnected] = useState(false);
  const lastRetryRef = useRef(0);

  // Conectar al iniciar sesión, desconectar al salir.
  useEffect(() => {
    if (isAuthenticated) {
      socket.connect();
    } else {
      socket.disconnect();
    }

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated]);

  // Estado de la conexión y renovación del token si el servidor la rechaza.
  useEffect(() => {
    const onConnected = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    const onError = async (e: { code?: string }) => {
      if (e?.code !== "UNAUTHORIZED") return;

      // evita bucles: como máximo un reintento cada 5 s
      if (Date.now() - lastRetryRef.current < 5000) return;
      lastRetryRef.current = Date.now();

      try {
        await refreshSession();
        socket.connect();
      } catch {
        // sin sesión válida: el AuthProvider mostrará el login
      }
    };

    socket.on("connected", onConnected);
    socket.on("disconnect", onDisconnect);
    socket.on("error", onError);

    return () => {
      socket.off("connected", onConnected);
      socket.off("disconnect", onDisconnect);
      socket.off("error", onError);
    };
  }, []);

  // Avisos del servidor: refrescan las listas afectadas.
  useEffect(() => {
    const refreshRecordings = () => {
      void queryClient.invalidateQueries({ queryKey: ["recordings"] });
    };

    const refreshMemberships = () => {
      void queryClient.invalidateQueries({ queryKey: ["meetings"] });
      void queryClient.invalidateQueries({ queryKey: ["memberships"] });
      void queryClient.invalidateQueries({ queryKey: ["members"] });
    };

    socket.on("recording.status", refreshRecordings);
    socket.on("recording.transcribed", refreshRecordings);
    socket.on("recording.ready", refreshRecordings);
    socket.on("membership.requested", refreshMemberships);
    socket.on("membership.decided", refreshMemberships);

    return () => {
      socket.off("recording.status", refreshRecordings);
      socket.off("recording.transcribed", refreshRecordings);
      socket.off("recording.ready", refreshRecordings);
      socket.off("membership.requested", refreshMemberships);
      socket.off("membership.decided", refreshMemberships);
    };
  }, [queryClient]);

  const value = useMemo(() => ({ socket, connected }), [connected]);

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  );
}
