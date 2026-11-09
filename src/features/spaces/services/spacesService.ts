import { api, apiFetch } from "../../../api/client";
import { fetchAllPages } from "../../../api/pagination";

import type {
  BulkDecisionResult,
  JoinResult,
  MemberAction,
  MembershipStatus,
  MyMembership,
  Space,
  SpaceFilters,
  SpaceInvite,
  SpaceMember,
  SpaceSettings,
} from "../types/spaces.types";

export const spacesService = {
  /** role=owner → reuniones que dirijo; role=member → reuniones a las que pertenezco. */
  list(role: "owner" | "member", filters: SpaceFilters = {}): Promise<Space[]> {
    return fetchAllPages<Space>("/spaces", { role, ...filters });
  },

  getById(id: string): Promise<Space> {
    return api<Space>(`/spaces/${id}`);
  },

  create(name: string, description?: string): Promise<Space> {
    return api<Space>("/spaces", {
      method: "POST",
      json: { name, description },
    });
  },

  join(code: string): Promise<JoinResult> {
    return api<JoinResult>("/join", { method: "POST", json: { code } });
  },

  myMemberships(): Promise<MyMembership[]> {
    return api<MyMembership[]>("/memberships/me");
  },

  leave(id: string): Promise<void> {
    return api<void>(`/spaces/${id}/leave`, { method: "POST" });
  },

  updateSettings(id: string, settings: SpaceSettings): Promise<Space> {
    return api<Space>(`/spaces/${id}`, { method: "PATCH", json: { settings } });
  },

  update(id: string, data: { name?: string; description?: string;   }): Promise<Space> {
    return api<Space>(`/spaces/${id}`, {method: "PATCH", json: data,});
  },

  delete(id: string): Promise<void> {
    return api<void>(`/spaces/${id}`, {method: "DELETE"});
  }, 

  /* ---------------- Miembros (solo dueño) ---------------- */

  listMembers(spaceId: string, status?: MembershipStatus): Promise<SpaceMember[]> {
    return fetchAllPages<SpaceMember>(`/spaces/${spaceId}/members`, { status });
  },

  decide(spaceId: string, userId: string, action: MemberAction): Promise<void> {
    if (action === "remove") {
      return api<void>(`/spaces/${spaceId}/members/${userId}`, { method: "DELETE" });
    }
    return api<void>(`/spaces/${spaceId}/members/${userId}/${action}`, { method: "POST" });
  },

  bulkDecision(
    spaceId: string,
    action: "approve" | "reject",
    userIds: string[]
  ): Promise<BulkDecisionResult> {
    return api<BulkDecisionResult>(`/spaces/${spaceId}/members/bulk`, {
      method: "POST",
      json: { action, userIds },
    });
  },

  /* ---------------- Invitación (solo dueño) ---------------- */

  rotateInvite(spaceId: string): Promise<SpaceInvite> {
    return api<SpaceInvite>(`/spaces/${spaceId}/invite/rotate`, { method: "POST" });
  },

  updateInvite(
    spaceId: string,
    patch: { active?: boolean; expiresAt?: string | null; maxUses?: number | null }
  ): Promise<SpaceInvite> {
    return api<SpaceInvite>(`/spaces/${spaceId}/invite`, { method: "PATCH", json: patch });
  },

  /** El QR exige el header Authorization, así que se descarga como blob y se muestra con una URL local. */
  async getInviteQr(spaceId: string): Promise<string> {
    const res = await apiFetch(`/spaces/${spaceId}/invite/qr?format=svg`);
    return URL.createObjectURL(await res.blob());
  },
};
