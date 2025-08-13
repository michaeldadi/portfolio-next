// app/projects/[id]/page.tsx

import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { queryClient } from '@/lib/api/client';
import { projectsApi } from '@/lib/api/projects';
import { projectKeys } from '@/hooks/useProjects';
import { ProjectsSection as ProjectDetails } from '@/components/Projects';

const ProjectPage = ({ params }: { params: { id: string } }) => {
  // Prefetch data on the server
  await queryClient.prefetchQuery({
    queryKey: projectKeys.detail(params.id),
    queryFn: () => projectsApi.getById(params.id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProjectDetails id={params.id} />
    </HydrationBoundary>
  );
};

export default ProjectPage;
