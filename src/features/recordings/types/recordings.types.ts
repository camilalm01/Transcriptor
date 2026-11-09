export type RecordingStatus =
  | "RECORDING"
  | "UPLOADED"
  | "TRANSCRIBING"
  | "SUMMARIZING"
  | "READY"
  | "PARTIAL"
  | "FAILED";

export type RecordingVisibility =
  | "PRIVATE"
  | "PUBLISHED";

export type RecordingRole =
  | "OWNER"
  | "MEMBER";

export type RecordingTab =
  | "published"
  | "draft"
  | "processing";
  
export interface RecordingProgress {
  transcript: number;
  summary: number;
}

export interface Recording {
  id: string;
  spaceId: string;
  title: string;
  status: RecordingStatus;
  visibility: RecordingVisibility;
  myRole: RecordingRole;
  durationSec: number;
  createdAt: string;
  updatedAt: string;
  progress?: RecordingProgress;
  keywords?: string[];
  topics?: string[]
  source?: string;
  audioUrl?: string;
}

export interface RecordingPageResponse {
  items: Recording[];

  nextCursor: string | null;
}
export interface CreateRecordingResponse {
  id: string;
}

/* ------------------------------------------------------------------ */
/* Transcript                                                         */
/* ------------------------------------------------------------------ */

export interface TranscriptSegment {
  start: number;

  end: number;

  speaker?: string;

  text: string;
}

export interface TranscriptResponse {
  id: string;

  segments: TranscriptSegment[];
}

/* ------------------------------------------------------------------ */
/* Summary                                                            */
/* ------------------------------------------------------------------ */

export interface SummaryTopic {
  nombre: string;
  puntosClave: string[];
  minutoAprox?: string;
}

export interface SummaryDefinition {
  termino: string;
  definicion: string;
}

export interface SummaryTask {
  descripcion: string;
  fecha?: string | null;
}

export interface SummaryContent {
  titulo: string;
  resumenGeneral: string;
  temas: SummaryTopic[];
  definiciones: SummaryDefinition[];
  tareasYFechas: SummaryTask[];
  preguntasDeRepaso: string[];
  palabrasClave: string[];
}

export interface SummaryResponse {
  version: number;
  source: string;
  basedOn: string;
  createdAt: string;
  content: SummaryContent;
}

/* ------------------------------------------------------------------ */
/* Recursos complementarios                                           */
/* ------------------------------------------------------------------ */

export interface RecordingResource {
  id: string;
  title: string;
  url: string;
}

/* ------------------------------------------------------------------ */
/* Filtros                                                            */
/* ------------------------------------------------------------------ */

export interface RecordingsFilter {
  spaceId?: string;
  status?: RecordingStatus;
  visibility?: RecordingVisibility;
  q?: string;
}