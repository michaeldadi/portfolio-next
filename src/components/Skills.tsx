'use client';

import { motion } from 'framer-motion';
import { getSkillsByCategory } from '@/lib/data';
import type { SkillCategory } from '@/lib/types';

const categories: SkillCategory[] = [
  'Frontend',
  'Mobile',
  'Backend',
  'Database',
  'DevOps',
  'Tools',
];

export default function Skills() {
  return (
    <section id='skills' className='px-6 py-20'>
      <div className='mx-auto max-w-7xl'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='mb-12 text-center'
        >
          <h2 className='mb-4 text-4xl font-bold md:text-5xl'>
            <span className='bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent'>
              Technical Skills
            </span>
          </h2>
          <p className='text-lg text-gray-400'>Technologies I work with daily</p>
        </motion.div>

        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {categories.map((category, categoryIndex) => {
            const categorySkills = getSkillsByCategory(category);

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: categoryIndex * 0.1 }}
                className='rounded-xl border border-gray-700 bg-gray-800 p-6'
              >
                <h3 className='mb-4 text-xl font-bold text-purple-400'>{category}</h3>
                <div className='space-y-3'>
                  {categorySkills.map(skill => (
                    <div key={skill.name}>
                      <div className='mb-1 flex items-center justify-between'>
                        <span className='flex items-center gap-2 text-sm text-gray-300'>
                          {skill.icon && <span>{skill.icon}</span>}
                          {skill.name}
                        </span>
                        <span className='text-xs text-gray-500'>{skill.yearsOfExperience}y</span>
                      </div>
                      {/* Proficiency bar */}
                      <div className='h-1 overflow-hidden rounded-full bg-gray-700'>
                        <motion.div
                          className='h-full bg-gradient-to-r from-purple-500 to-pink-500'
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(skill.proficiency / 5) * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: categoryIndex * 0.1 + 0.2 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
