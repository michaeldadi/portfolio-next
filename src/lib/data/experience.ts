import type { Experience } from '@/lib/types';

export const experience: Experience[] = [
  {
    id: 'senior-engineer-techco',
    company: 'TechCo',
    position: 'Senior Software Engineer',
    type: 'Full-time',
    location: 'San Francisco, CA',
    remote: true,
    startDate: '2022-03-01',
    description: `Lead developer for mobile initiatives, architecting and implementing 
                  cross-platform solutions using React Native and Expo.`,
    achievements: [
      'Led team of 5 engineers in developing flagship mobile app',
      'Reduced app crash rate by 95% through systematic debugging',
      'Implemented CI/CD pipeline reducing deployment time by 70%',
      'Mentored 3 junior developers, all promoted within 18 months',
    ],
    techStack: ['React Native', 'Expo', 'TypeScript', 'Node.js', 'AWS'],
    logo: '/images/companies/techco.png',
  },
];
