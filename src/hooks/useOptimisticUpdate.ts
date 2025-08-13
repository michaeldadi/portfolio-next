// hooks/useOptimisticUpdate.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectKeys } from '@/hooks/useProjects';
import { projectsApi } from '@/lib/api/projects';

export const useOptimisticUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectsApi.update,
    // Optimistically update the cache
    onMutate: async updatedProject => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: projectKeys.detail(updatedProject.id!),
      });

      // Snapshot previous value
      const previousProject = queryClient.getQueryData(projectKeys.detail(updatedProject.id!));

      // Optimistically update to the new value
      queryClient.setQueryData(projectKeys.detail(updatedProject.id!), updatedProject);

      // Return context with snapshot
      return { previousProject };
    },
    // If the mutation fails, use context to roll back
    onError: (err, variables, context) => {
      if (context?.previousProject) {
        queryClient.setQueryData(projectKeys.detail(variables.id!), context.previousProject);
      }
    },
    // Always refetch after either an error or a success response
    onSettled: async (data, error, variables) => {
      await queryClient.invalidateQueries({
        queryKey: projectKeys.detail(variables.id!),
      });
    },
  });
};
