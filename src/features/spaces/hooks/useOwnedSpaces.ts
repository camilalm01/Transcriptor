import { useQuery } from "@tanstack/react-query";

import {
  spacesService,
  type SpacesFilter,
} from "../services/spacesService";

export function useOwnedSpaces(
  filters?: SpacesFilter
) {
  return useQuery({
    queryKey: [
      "spaces",
      "owner",
      filters,
    ],

    queryFn: () =>
      spacesService.getOwnedSpaces(
        filters
      ),
  });
}