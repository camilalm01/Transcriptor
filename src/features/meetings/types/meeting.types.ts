export type MeetingRole =
  | "speaker"
  | "viewer";

export interface Meeting {
  id: string;
  oradorId: string;
  nombreReunion: string;
  codigoAcceso: string;
  fechaCreacion: string;
  solicitudesPendientes: string[];
  estudiantesAprobados: string[];
  role: MeetingRole;
}