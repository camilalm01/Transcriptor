import { api } from "../../../api/client";

import type {
  MemberPageResponse,
  SpaceMember,
} from "../types/members.types";

export const membersService = {
  async getMembers(
    spaceId: string,
    status?: string
  ): Promise<SpaceMember[]> {

    const query = status
      ? `?status=${status}`
      : "";

    const response =
      await api<MemberPageResponse>(
        `/spaces/${spaceId}/members${query}`
      );

    return response.items;
  },

  approveMember(
    spaceId: string,
    userId: string
  ) {
    return api(
      `/spaces/${spaceId}/members/${userId}/approve`,
      {
        method: "POST",
      }
    );
  },

  rejectMember(
    spaceId: string,
    userId: string
  ) {
    return api(
      `/spaces/${spaceId}/members/${userId}/reject`,
      {
        method: "POST",
      }
    );
  },

  removeMember(
    spaceId: string,
    userId: string
  ) {
    return api(
      `/spaces/${spaceId}/members/${userId}`,
      {
        method: "DELETE",
      }
    );
  },
};