import type { Project } from '@/lib/types';

export const projects: Project[] = [
  {
    id: 'neon-expo-app',
    title: 'Neon',
    description:
      'React Native app with voice calling, real-time audio transcription, and AI features.',
    longDescription: `A voice communication platform built with React Native and Expo, 
                      featuring real-time transcription, AI-driven insights, and advanced fraud detection
                      capabilities. Implemented an AWS CDK project to facilitate server-side audio processing and optimized performance for responsive 
                      UI interactions.`,
    category: 'Full Stack',
    status: 'In Production',
    featured: true,
    techStack: ['React Native', 'Expo', 'Firebase', 'Next.js', 'TypeScript', 'React Query'],
    image: '/images/projects/neon-app-main.png',
    images: [
      '/images/projects/neon-app-1.jpg',
      '/images/projects/neon-app-2.jpg',
      '/images/projects/neon-app-3.jpg',
    ],
    liveUrl: 'https://neonmobile.com',
    githubUrl: '',
    appStoreUrl: 'https://apps.apple.com/us/app/neon-get-paid-for-your-calls/id6745481255',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.neonmobile.app&hl=en_US',
    startDate: '2023-06-01',
    endDate: 'Present',
    highlights: [
      'Achieved 50K+ downloads in first 3 months',
      'Maintained 4.8★ rating across app stores',
      'Reduced app size by 40% through optimization',
      'Implemented end-to-end encryption for messages',
    ],
    metrics: [
      { label: 'Active Users', value: '50K+', change: '+125%' },
      { label: 'Daily Messages', value: '1M+' },
      { label: 'Crash-free Rate', value: '99.8%' },
    ],
  },
  {
    id: 'zealthy-telehealth-platform',
    title: 'Zealthy',
    description:
      'Full-stack HIPAA-compliant React Native Expo app and Next.js app with patient intake flows, medication order tracking, live visit functionality, and a clinician dashboard.',
    longDescription: `A complete telehealth platform built with Next.js 15 and Expo 53, featuring server-side 
                      rendering for SEO optimization, various pharmacy integrations, a provider messaging feature, and a comprehensive 
                      clinician dashboard. Integrated with Stripe for payments and implemented advanced 
                      caching strategies for sub-100ms page loads.`,
    category: 'Full Stack',
    status: 'In Production',
    featured: true,
    techStack: [
      'React Native',
      'Expo',
      'Next.js',
      'TypeScript',
      'Stripe',
      'Sentry',
      'PostgreSQL',
      'MUI',
      'AWS',
    ],
    image: '/images/projects/zealthy-main.png',
    liveUrl: 'https://getzealthy.com',
    githubUrl: '',
    appStoreUrl: 'https://apps.apple.com/us/app/zealthy-health-weight-loss/id6502919679',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.zealthy.mobileapp&hl=en_US',
    startDate: '2023-09-01',
    highlights: [
      'Processed $100M+ in transactions',
      'Implemented mobile app from 0 to production and scaled to 30K+ MAUs',
      'Reduced cart abandonment by 18%',
      'Implemented patient-provider live visit functionality',
      'Refactored CI/CD pipelines for faster deployments',
    ],
    metrics: [
      { label: 'GMV', value: '$30M+' },
      { label: 'Conversion Rate', value: '32.3%', change: '+6.8%' },
      { label: 'Page Load Time', value: '0.8s' },
    ],
  },
  {
    id: 'workwiz-rn-app',
    title: 'WorkWiz',
    description:
      'React Native app and accompanying Next.js site for job listings, applications, and sourcing.',
    longDescription: `A comprehensive recruitment platform built with React Native and Next.js, 
                      featuring real-time messaging, job boards, and advanced professional networking 
                      capabilities. Implemented custom animations and optimized data handling for offline-first
                      functionality.`,
    category: 'Mobile App',
    status: 'Archived',
    featured: true,
    techStack: ['React Native', 'AWS', 'Firebase', 'TypeScript', 'Redux', 'Next.js'],
    image: '/images/projects/workwiz-app-main.png',
    githubUrl: '',
    appStoreUrl: '',
    playStoreUrl: '',
    startDate: '2023-06-01',
    endDate: '2024-01-15',
    highlights: [
      'Achieved 20K+ downloads in first 3 months',
      'Maintained 4.7★ rating across app stores',
      'Reduced app size by 40% through bundler optimizations and code splitting',
      'Implemented end-to-end encryption for in-app messages',
    ],
    metrics: [
      { label: 'Daily Messages', value: '100+' },
      { label: 'Crash-free Rate', value: '99.8%' },
    ],
  },
];
