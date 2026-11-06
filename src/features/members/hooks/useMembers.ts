import { useQuery } from "@tanstack/react-query";

import { membersService }
  from "../services/membersService";

export function useMembers(
  spaceId?: string
) {
  return useQuery({
    queryKey: [
      "spaces",
      spaceId,
      "members",
    ],

    queryFn: () =>
      membersService.getMembers(
        spaceId!
      ),

    enabled: !!spaceId,
  });
}