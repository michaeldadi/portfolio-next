import type { Skill } from '@/lib/types';

export const skills: Skill[] = [
  {
    name: 'React Native',
    category: 'Mobile',
    proficiency: 5,
    yearsOfExperience: 4,
    icon: '📱',
    certifications: [
      {
        name: 'React Native Certification',
        issuer: 'Meta',
        date: '2023-03-15',
        url: 'https://certificate.url',
      },
    ],
  },
  {
    name: 'TypeScript',
    category: 'Frontend',
    proficiency: 5,
    yearsOfExperience: 3,
    icon: '🔷',
  },
  {
    name: 'Next.js',
    category: 'Frontend',
    proficiency: 4,
    yearsOfExperience: 2,
    icon: '⚡',
  },
  {
    name: 'Node.js',
    category: 'Backend',
    proficiency: 4,
    yearsOfExperience: 3,
    icon: '🟢',
  },
  {
    name: 'Python',
    category: 'Backend',
    proficiency: 4,
    yearsOfExperience: 2,
    icon: '🐍',
  },
  {
    name: 'PostgreSQL',
    category: 'Database',
    proficiency: 4,
    yearsOfExperience: 3,
    icon: '🐘',
  },
  {
    name: 'Docker',
    category: 'DevOps',
    proficiency: 3,
    yearsOfExperience: 2,
    icon: '🐳',
  },
];
