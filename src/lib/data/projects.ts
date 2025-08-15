import type { Project } from '@/lib/types';

export const projects: Project[] = [
  {
    id: 'neon-expo-app',
    title: 'Neon',
    description:
      'React Native app with voice calling, real-time audio transcription, and AI features.',
    longDescription: `A comprehensive social media platform built with React Native and Expo, 
                      featuring real-time messaging, ephemeral stories, and advanced social networking 
                      capabilities. Implemented custom animations and optimized performance for smooth 
                      60fps scrolling even with complex media content.`,
    category: 'Mobile App',
    status: 'In Production',
    featured: true,
    techStack: ['React Native', 'Expo', 'Firebase', 'TypeScript', 'Redux', 'Socket.io'],
    image: '/images/projects/neon-app-main.jpg',
    images: [
      '/images/projects/neon-app-1.jpg',
      '/images/projects/neon-app-2.jpg',
      '/images/projects/neon-app-3.jpg',
    ],
    liveUrl: 'https://neonmobile.com',
    githubUrl: '',
    appStoreUrl: 'https://apps.apple.com/app/id123456789',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.example.social',
    startDate: '2023-06-01',
    endDate: '2024-01-15',
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
    testimonial: {
      content:
        'The app exceeded our expectations. The performance optimizations and attention to detail made a huge difference in user retention.',
      author: 'Michael Dadi',
      role: 'Founding Engineer',
      company: 'Neon Mobile',
    },
  },
  {
    id: 'zealthy-telehealth-platform',
    title: 'Zealthy Platform',
    description: 'Full-stack Next.js app with payments, inventory, and admin dashboard.',
    longDescription: `A complete e-commerce solution built with Next.js 14, featuring server-side 
                      rendering for SEO optimization, real-time inventory management, and a comprehensive 
                      admin dashboard. Integrated with Stripe for payments and implemented advanced 
                      caching strategies for sub-100ms page loads.`,
    category: 'Full Stack',
    status: 'In Production',
    featured: true,
    techStack: ['Next.js', 'TypeScript', 'Stripe', 'PostgreSQL', 'Tailwind CSS', 'AWS'],
    image: '/images/projects/zealthy-main.jpg',
    liveUrl: 'https://getzealthy.com',
    githubUrl: '',
    startDate: '2023-09-01',
    highlights: [
      'Processed $2M+ in transactions',
      'Achieved 98 Lighthouse performance score',
      'Reduced cart abandonment by 35%',
      'Implemented A/B testing framework',
    ],
    metrics: [
      { label: 'GMV', value: '$2M+' },
      { label: 'Conversion Rate', value: '3.2%', change: '+0.8%' },
      { label: 'Page Load Time', value: '0.9s' },
    ],
  },
];
