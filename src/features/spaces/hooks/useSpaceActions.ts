import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { spacesService } from "../services/spacesService";

export function useSpaceActions() {
  const queryClient = useQueryClient();

  const createSpace = useMutation({ mutationFn:
      spacesService.createSpace,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["spaces"],
      });
    },
  });

  const joinSpace = useMutation({
    mutationFn:
      spacesService.joinSpace,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["spaces"],
      });
    },
  });

  return {
    createSpace,
    joinSpace,
  };
}