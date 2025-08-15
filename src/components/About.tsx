'use client';

import { motion } from 'framer-motion';
import { personalInfo, education, getTotalYearsOfExperience, getProjectCount } from '@/lib/data';
import { experience } from '@/lib/data/experience';
import { Briefcase, GraduationCap, Award, Users } from 'lucide-react';

export default function About() {
  const stats = [
    { label: 'Years Experience', value: getTotalYearsOfExperience(), icon: Briefcase },
    { label: 'Projects Completed', value: getProjectCount(), icon: Award },
    { label: 'Technologies', value: '20+', icon: GraduationCap },
    { label: 'Happy Clients', value: '50+', icon: Users },
  ];

  return (
    <section id='about' className='bg-gray-900/50 px-6 py-20'>
      <div className='mx-auto max-w-7xl'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='mb-12 text-center'
        >
          <h2 className='mb-4 text-4xl font-bold md:text-5xl'>
            <span className='bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent'>
              About Me
            </span>
          </h2>
        </motion.div>

        <div className='mb-16 grid gap-12 lg:grid-cols-2'>
          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className='mb-4 text-2xl font-bold text-gray-500'>Who I Am</h3>
            <p className='mb-6 leading-relaxed text-gray-300'>{personalInfo.bio}</p>
            <p className='leading-relaxed text-gray-400'>
              I&#39;m passionate about creating seamless user experiences and solving complex
              problems through code. Whether it&#39;s building a React Native app that works
              flawlessly across platforms or architecting a scalable backend system, I bring
              dedication and expertise to every project.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className='grid grid-cols-2 gap-6'
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className='rounded-xl border border-gray-700 bg-gray-800 p-6 text-center'
                >
                  <Icon className='mx-auto mb-3 h-8 w-8 text-purple-400' />
                  <div className='mb-1 text-3xl font-bold text-white'>{stat.value}</div>
                  <div className='text-sm text-gray-400'>{stat.label}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Experience & Education */}
        <div className='grid gap-12 lg:grid-cols-2'>
          {/* Experience */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className='mb-6 flex items-center gap-2 text-2xl font-bold text-gray-500'>
              <Briefcase className='h-6 w-6 text-purple-400' />
              Experience
            </h3>
            <div className='space-y-6'>
              {experience.slice(0, 2).map(exp => (
                <div key={exp.id} className='relative border-l-2 border-purple-500 pl-6'>
                  <div className='absolute top-0 -left-2 h-4 w-4 rounded-full bg-purple-500' />
                  <h4 className='text-lg font-bold text-gray-400'>{exp.position}</h4>
                  <p className='text-purple-400'>{exp.company}</p>
                  <p className='text-sm text-gray-500'>
                    {new Date(exp.startDate).getFullYear()} -{' '}
                    {exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'}
                  </p>
                  <p className='mt-2 text-gray-400'>{exp.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Education */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className='mb-6 flex items-center gap-2 text-2xl font-bold text-gray-500'>
              <GraduationCap className='h-6 w-6 text-purple-400' />
              Education
            </h3>
            <div className='space-y-6'>
              {education.map(edu => (
                <div key={edu.id} className='relative border-l-2 border-purple-500 pl-6'>
                  <div className='absolute top-0 -left-2 h-4 w-4 rounded-full bg-purple-500' />
                  <h4 className='text-lg font-bold text-gray-400'>{edu.degree}</h4>
                  <p className='text-purple-400'>{edu.institution}</p>
                  <p className='text-sm text-gray-500'>{edu.field}</p>
                  <p className='text-sm text-gray-500'>
                    {new Date(edu.startDate).getFullYear()} - {new Date(edu.endDate).getFullYear()}
                  </p>
                  {edu.gpa && <p className='mt-1 text-gray-400'>GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
