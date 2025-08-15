'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { projects } from '@/lib/data/projects';
import Image from 'next/image';

export function ProjectsSection() {
  const featuredProjects = projects.filter(p => p.featured);

  return (
    <section id='projects' className='bg-gray-900/50 px-6 py-20'>
      <div className='mx-auto max-w-7xl'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='mb-12 text-center'
        >
          <h2 className='mb-4 text-4xl font-bold md:text-5xl'>
            <span className='bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent'>
              Featured Projects
            </span>
          </h2>
          <p className='text-lg text-gray-400'>
            A selection of my recent work in mobile and web development
          </p>
        </motion.div>

        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className='overflow-hidden rounded-xl border border-gray-700 bg-gray-800 transition-all hover:border-purple-500/50'
            >
              {/* Project Image */}
              <div className='group relative h-48 bg-gradient-to-br from-purple-600/20 to-pink-600/20'>
                {project.image ? (
                  <Image src={project.image} alt={project.title} fill className='object-cover' />
                ) : (
                  <div className='flex h-full w-full items-center justify-center text-4xl'>
                    {project.category === 'Mobile App'
                      ? '📱'
                      : project.category === 'Web App'
                        ? '🌐'
                        : project.category === 'Full Stack'
                          ? '🚀'
                          : '💻'}
                  </div>
                )}

                {/* Overlay with links */}
                <div className='absolute inset-0 flex items-center justify-center gap-4 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100'>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='rounded-full bg-white/20 p-3 backdrop-blur transition hover:bg-white/30'
                    >
                      <ExternalLink className='h-5 w-5 text-white' />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='rounded-full bg-white/20 p-3 backdrop-blur transition hover:bg-white/30'
                    >
                      <Github className='h-5 w-5 text-white' />
                    </a>
                  )}
                </div>
              </div>

              {/* Project Info */}
              <div className='p-6'>
                <h3 className='mb-2 text-xl font-bold'>{project.title}</h3>
                <p className='mb-4 text-sm text-gray-400'>{project.description}</p>

                {/* Tech Stack */}
                <div className='flex flex-wrap gap-2'>
                  {project.techStack.slice(0, 4).map(tech => (
                    <span
                      key={tech}
                      className='rounded-full bg-gray-700 px-3 py-1 text-xs text-gray-300'
                    >
                      {tech}
                    </span>
                  ))}
                  {project.techStack.length > 4 && (
                    <span className='rounded-full bg-gray-700 px-3 py-1 text-xs text-gray-300'>
                      +{project.techStack.length - 4}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
