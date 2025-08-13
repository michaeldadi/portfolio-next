// components/Projects.tsx

'use client';

import { useProjects } from '@/hooks/useProjects';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle } from 'lucide-react';

export function ProjectsSection() {
  const { data: projects, isLoading, error, refetch } = useProjects();

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-20'>
        <Loader2 className='h-8 w-8 animate-spin text-purple-500' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='py-20 text-center'>
        <AlertCircle className='mx-auto mb-4 h-12 w-12 text-red-500' />
        <p className='mb-4 text-gray-400'>Failed to load projects</p>
        <button
          onClick={() => refetch()}
          className='rounded-lg bg-purple-600 px-6 py-2 transition hover:bg-purple-700'
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <section className='py-20'>
      <div className='grid gap-6 md:grid-cols-3'>
        {projects?.map(project => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='rounded-lg bg-gray-900 p-6'
          >
            <h3>{project.title}</h3>
            <p>{project.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
