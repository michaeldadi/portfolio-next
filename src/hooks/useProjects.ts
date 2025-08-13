// hooks/use-projects.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '@/lib/api/projects';
import { toast } from 'sonner';

import type { Project } from '@/lib/types';

// Query Keys
export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (filters: string) => [...projectKeys.lists(), { filters }] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
};

// Fetch all projects
export const useProjects = () => {
  return useQuery({
    queryKey: projectKeys.lists(),
    queryFn: projectsApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Fetch a single project
export const useProject = (id: string) => {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => projectsApi.getById(id),
    enabled: !!id,
  });
};

// Create a project
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectsApi.create,
    onSuccess: async newProject => {
      // Invalidate and refetch projects list
      await queryClient.invalidateQueries({ queryKey: projectKeys.lists() });

      // Optionally update cache directly
      queryClient.setQueryData(projectKeys.lists(), (old: Project[] = []) => {
        return [...old, newProject];
      });

      toast.success('Project created successfully!');
    },
  });
};

// Update project
export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectsApi.update,
    onSuccess: async (updatedProject: Project) => {
      // Update the specific project in the cache
      queryClient.setQueryData(projectKeys.detail(updatedProject.id), updatedProject);

      // Invalidate the list to refetch
      await queryClient.invalidateQueries({ queryKey: projectKeys.lists() });

      toast.success('Project updated successfully!');
    },
  });
};

// Delete project
export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectsApi.delete,
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.setQueryData(projectKeys.lists(), (old: Project[] = []) => {
        return old.filter(project => project.id !== deletedId);
      });

      toast.success('Project deleted successfully!');
    },
  });
};
