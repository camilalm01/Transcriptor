import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import { spacesService } from "../services/spacesService";

import type { MemberAction, MembershipStatus, SpaceSettings,} from "../types/spaces.types";

export function useCreateSpace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) =>
      spacesService.create(name),

    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["spaces"],
      }),
  });
}

export function useJoinSpace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code: string) =>
      spacesService.join(code),

    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["memberships"],
      }),
  });
}

export function useMyMemberships() {
  return useQuery({
    queryKey: ["memberships", "me"],
    queryFn: () =>
      spacesService.myMemberships(),
    refetchOnWindowFocus: true,
  });
}

export function useMembers(
  spaceId: string,
  status?: MembershipStatus
) {
  return useQuery({
    queryKey: [
      "members",
      spaceId,
      status ?? "all",
    ],
    queryFn: () =>
      spacesService.listMembers(
        spaceId,
        status
      ),
    enabled: !!spaceId,
  });
}

function useInvalidateSpaceQueries() {
  const queryClient = useQueryClient();

  return (spaceId?: string) =>
    Promise.all([
      queryClient.invalidateQueries({queryKey: ["spaces"],}),
      queryClient.invalidateQueries({queryKey: ["memberships"],}),
      queryClient.invalidateQueries({queryKey: ["members", spaceId],}),
      queryClient.invalidateQueries({queryKey: ["space", spaceId],}),
      queryClient.invalidateQueries({queryKey: ["meeting", spaceId],}),

      queryClient.invalidateQueries({
        queryKey: ["meetings"],
      }),
    ]);
}

export function useMemberActions(
  spaceId: string
) {
  const invalidate = useInvalidateSpaceQueries();

  const single = useMutation({
    mutationFn: ({
      userId,
      action,
    }: {
      userId: string;
      action: MemberAction;
    }) =>
      spacesService.decide(
        spaceId,
        userId,
        action
      ),

    onSuccess: () =>
      invalidate(spaceId),
  });

  const bulk = useMutation({
    mutationFn: ({
      action,
      userIds,
    }: {
      action: "approve" | "reject";
      userIds: string[];
    }) =>
      spacesService.bulkDecision(
        spaceId,
        action,
        userIds
      ),

    onSuccess: () =>
      invalidate(spaceId),
  });

  return {
    single,
    bulk,
  };
}

export function useSpaceSettings(
  spaceId: string
) {
  const invalidate = useInvalidateSpaceQueries();

  return useMutation({
    mutationFn: (
      settings: SpaceSettings
    ) =>
      spacesService.updateSettings(
        spaceId,
        settings
      ),

    onSuccess: () =>
      invalidate(spaceId),
  });
}

export function useInviteActions(
  spaceId: string
) {
  const invalidate =
    useInvalidateSpaceQueries();

  const rotate = useMutation({
    mutationFn: () =>
      spacesService.rotateInvite(
        spaceId
      ),

    onSuccess: () =>
      invalidate(spaceId),
  });

  const toggle = useMutation({
    mutationFn: (active: boolean) =>
      spacesService.updateInvite(
        spaceId,
        { active }
      ),

    onSuccess: () =>
      invalidate(spaceId),
  });

  return {
    rotate,
    toggle,
  };
}

export function useSpaceActions() {
  const invalidate =
    useInvalidateSpaceQueries();

  const updateSpace = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        name?: string;
        description?: string;
      };
    }) =>
      spacesService.update(
        id,
        data
      ),

    onSuccess: (
      _,
      variables
    ) =>
      invalidate(
        variables.id
      ),
  });

  const deleteSpace = useMutation({
    mutationFn: (
      spaceId: string
    ) =>
      spacesService.delete(
        spaceId
      ),

    onSuccess: (
      _,
      spaceId
    ) =>
      invalidate(spaceId),
  });

  return {
    updateSpace,
    deleteSpace,
  };
}