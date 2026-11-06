import { useQuery } from "@tanstack/react-query";

import {
  spacesService,
  type SpacesFilter,
} from "../services/spacesService";

export function useMemberSpaces(
  filters?: SpacesFilter
) {
  return useQuery({
    queryKey: [
      "spaces",
      "member",
      filters,
    ],

    queryFn: () =>
      spacesService.getMemberSpaces(
        filters
      ),
  });
}