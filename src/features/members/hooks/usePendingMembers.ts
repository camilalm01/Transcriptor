import { useQuery } from "@tanstack/react-query";

import { membersService } from "../services/membersService";

export function usePendingMembers(
  spaceId?: string
) {
  return useQuery({
    queryKey: ["spaces", spaceId,"pending-members",],

    queryFn: () =>
      membersService.getMembers(
        spaceId!,
        "PENDING"
      ),

    enabled: !!spaceId,
  });
}