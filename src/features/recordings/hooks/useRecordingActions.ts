import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { recordingsService } from "../services/recordingsService";

interface UpdateRecordingParams {
  id: string;

  data: {
    title?: string;
    visibility?: string;
  };
}

export function useRecordingActions() {

  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: ["recordings"],
    });
  };

  const deleteRecording =
    useMutation({
      mutationFn: (
        recordingId: string
      ) =>
        recordingsService.deleteRecording(
          recordingId
        ),

      onSuccess:
        invalidate,
    });

  const updateRecording =
    useMutation({
      mutationFn: ({
        id,
        data,
      }: UpdateRecordingParams) =>
        recordingsService.updateRecording(
          id,
          data
        ),

      onSuccess:
        invalidate,
    });

  return {
    deleteRecording,
    updateRecording,
  };
}