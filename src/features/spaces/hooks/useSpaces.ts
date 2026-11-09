import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { spacesService } from "../services/spacesService";
import type { Space, SpaceFilters } from "../types/spaces.types";

type Role = "speaker" | "viewer";

export function useSpaces(
  userId: string,
  role: Role,
  filters: SpaceFilters = {}
) {
  return useQuery<Space[]>({
    queryKey: ["meetings", userId, role, filters],

    queryFn: () =>
      spacesService.list(role === "speaker" ? "owner" : "member", filters),

    enabled: !!userId,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });
}
