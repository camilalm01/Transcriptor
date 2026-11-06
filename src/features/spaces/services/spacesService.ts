import { api } from "../../../api/client";

import type {
  CreateSpaceRequest,
  JoinSpaceRequest,
  JoinSpaceResponse,
  Space,
  SpacePageResponse,
} from "../types/spaces.types";

export interface SpacesFilter {
  q?: string;
}

export const spacesService = {
  async getOwnedSpaces(
    filters?: SpacesFilter
  ): Promise<Space[]> {

    const params = new URLSearchParams();

    params.append(
      "role",
      "owner"
    );

    if (filters?.q) {
      params.append(
        "q",
        filters.q
      );
    }

    const response =
      await api<SpacePageResponse>(
        `/spaces?${params.toString()}`
      );

    return response.items;
  },

  async getMemberSpaces(
    filters?: SpacesFilter
  ): Promise<Space[]> {

    const params =
      new URLSearchParams();

    params.append(
      "role",
      "member"
    );

    if (filters?.q) {
      params.append(
        "q",
        filters.q
      );
    }

    const response =
      await api<SpacePageResponse>(
        `/spaces?${params.toString()}`
      );

    return response.items;
  },

  getSpaceById(
    id: string
  ): Promise<Space> {
    return api<Space>(
      `/spaces/${id}`
    );
  },

  createSpace(
    data: CreateSpaceRequest
  ): Promise<Space> {
    return api<Space>(
      "/spaces",
      {
        method: "POST",
        json: data,
      }
    );
  },

  joinSpace(
    data: JoinSpaceRequest
  ): Promise<JoinSpaceResponse> {
    return api<JoinSpaceResponse>(
      "/join",
      {
        method: "POST",
        json: data,
      }
    );
  },
};