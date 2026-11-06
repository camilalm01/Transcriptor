import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { membersService } from "../services/membersService";

export function useMemberActions(
  spaceId: string
) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: ["spaces", spaceId,],
    });
  };

  const approveMember =
    useMutation({
      mutationFn: (
        userId: string
      ) =>
        membersService.approveMember(
          spaceId,
          userId
        ),

      onSuccess: invalidate,
    });

  const rejectMember =
    useMutation({
      mutationFn: (
        userId: string
      ) =>
        membersService.rejectMember(
          spaceId,
          userId
        ),

      onSuccess: invalidate,
    });

  const removeMember =
    useMutation({
      mutationFn: (
        userId: string
      ) =>
        membersService.removeMember(
          spaceId,
          userId
        ),

      onSuccess: invalidate,
    });

  return {
    approveMember,
    rejectMember,
    removeMember,
  };
}