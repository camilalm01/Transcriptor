/** En la API una "reunión" del front es un Space (espacio) y el dueño es el orador. */

export type SpaceRole = "OWNER" | "MEMBER";

export interface SpaceInvite {
  code: string;
  url: string;
  active: boolean;
  expiresAt: string | null;
  maxUses: number | null;
  uses: number;
  rotatedAt: string;
}

export interface SpaceSettings {
  autoPublish?: boolean;
  showTranscript?: boolean;
  allowExport?: boolean;
  liveCaptions?: boolean;
  glossary?: string[];
}

export interface Space {
  id: string;
  name: string;
  description: string;
  myRole: SpaceRole;
  owner: { id: string; name: string };
  settings: SpaceSettings;
  status: "ACTIVE" | "DISABLED_BY_ADMIN";
  /** Solo para el dueño */
  memberCounts?: { approved: number; pending: number };
  /** Solo para el dueño */
  invite?: SpaceInvite;
  createdAt: string;
  updatedAt: string;
}

export type SpaceSort =
  | "createdAt:desc"
  | "createdAt:asc"
  | "name:asc"
  | "name:desc";

export interface SpaceFilters {
  q?: string;
  sort?: SpaceSort;
}

export type MembershipStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "REMOVED"
  | "BLOCKED"
  | "LEFT";

export interface SpaceMember {
  userId: string;
  name: string;
  email: string;
  status: MembershipStatus;
  requestedAt: string;
  decidedAt: string | null;
  decidedBy: { id: string; name: string } | null;
  requestCount: number;
}

export interface MyMembership {
  spaceId: string;
  spaceName: string;
  ownerName: string;
  status: MembershipStatus;
  requestedAt: string;
  decidedAt: string | null;
}

export interface JoinResult {
  spaceId: string;
  spaceName: string;
  status: "PENDING";
  message: string;
}

export type MemberAction =
  | "approve"
  | "reject"
  | "remove"
  | "block"
  | "unblock";

export interface BulkDecisionResult {
  updated: string[];
  skipped: string[];
}
