export type SpaceRole =
  | "OWNER"
  | "MEMBER";

export type SpaceStatus =
  | "ACTIVE"
  | "DISABLED_BY_ADMIN";

export interface SpaceSettings {
  autoPublish: boolean;
  showTranscript: boolean;
  allowExport: boolean;
  liveCaptions: boolean;
  glossary: string[];
}

export interface SpaceInvite {
  code: string;
  url: string;
  active: boolean;
  expiresAt: string | null;
  maxUses: number | null;
  uses: number;
  rotatedAt: string;
}

export interface Space {
  id: string;
  name: string;
  description: string;
  myRole: SpaceRole;
  owner: unknown;
  settings: SpaceSettings;
  status: SpaceStatus;
  memberCounts?: Record<string, number>;
  invite?: SpaceInvite;
  createdAt: string;
  updatedAt: string;
}

export interface SpacePageResponse {
  items: Space[];
  nextCursor: string | null;
}

export interface CreateSpaceRequest {
  name: string;
  description?: string;
  settings?: Partial<SpaceSettings>;
}

export interface JoinSpaceRequest {
  code: string;
}

export interface JoinSpaceResponse {
  spaceId: string;
  spaceName: string;
  status: "PENDING";
  message: string;
}