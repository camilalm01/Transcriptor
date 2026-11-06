export type MembershipStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "REMOVED";

export interface SpaceMember {
  id: string;

  userId: string;

  name: string;

  email: string;

  status: MembershipStatus;

  joinedAt: string;
}

export interface MemberPageResponse {
  items: SpaceMember[];

  nextCursor: string | null;
}