import { useQuery } from "@tanstack/react-query";

import { spacesService } from "../services/spacesService";

export function useSpace(
  spaceId?: string
) {
  return useQuery({
    queryKey: ["spaces", spaceId ],
    queryFn: () =>
      spacesService.getById(spaceId!),
    enabled: !!spaceId,
  });
}