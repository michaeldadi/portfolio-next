// lib/data.ts

// ============================================
// Type Definitions
// ============================================

export type TechStack =
  | 'React Native'
  | 'Expo'
  | 'Next.js'
  | 'TypeScript'
  | 'JavaScript'
  | 'Node.js'
  | 'Python'
  | 'PostgreSQL'
  | 'Firebase'
  | 'Supabase'
  | 'AWS'
  | 'Docker'
  | 'GraphQL'
  | 'REST API'
  | 'Tailwind CSS'
  | 'Redux'
  | 'React Query'
  | 'Stripe'
  | 'Socket.io'
  | 'Kubernetes';

export type ProjectCategory =
  | 'Mobile App'
  | 'Web App'
  | 'Full Stack'
  | 'Open Source'
  | 'SaaS'
  | 'E-Commerce'
  | 'AI/ML';

export type ProjectStatus = 'In Production' | 'Beta' | 'Development' | 'Archived';

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  category: ProjectCategory;
  status: ProjectStatus;
  featured: boolean;
  techStack: TechStack[];
  image: string;
  images?: string[]; // Additional screenshots
  liveUrl?: string;
  githubUrl?: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
  startDate: string; // ISO date string
  endDate?: string; // ISO date string
  highlights?: string[];
  metrics?: ProjectMetric[];
  collaborators?: Collaborator[];
  testimonial?: Testimonial;
}

export interface ProjectMetric {
  label: string;
  value: string | number;
  change?: string; // e.g., "+25%"
}

export interface Collaborator {
  name: string;
  role: string;
  avatar?: string;
  linkedIn?: string;
}

export interface Testimonial {
  content: string;
  author: string;
  role: string;
  company?: string;
  avatar?: string;
}

export interface Skill {
  name: string;
  category: SkillCategory;
  proficiency: 1 | 2 | 3 | 4 | 5; // 1-5 scale
  yearsOfExperience: number;
  icon?: string; // Icon name or emoji
  certifications?: Certification[];
}

export type SkillCategory =
  | 'Frontend'
  | 'Mobile'
  | 'Backend'
  | 'Database'
  | 'DevOps'
  | 'Tools'
  | 'Design';

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance';
  location: string;
  remote: boolean;
  startDate: string;
  endDate?: string; // undefined means current
  description: string;
  achievements: string[];
  techStack: TechStack[];
  logo?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  achievements?: string[];
  relevantCourses?: string[];
}

export interface SocialLink {
  platform:
    | 'GitHub'
    | 'LinkedIn'
    | 'Twitter'
    | 'Dribbble'
    | 'Medium'
    | 'Dev.to'
    | 'YouTube'
    | 'Instagram';
  url: string;
  username: string;
  icon?: string;
}

export interface PersonalInfo {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  email: string;
  phone?: string;
  location: string;
  timezone: string;
  avatar: string;
  resume: string; // URL to resume PDF
  availability: 'Available' | 'Busy' | 'Not Available';
  preferredContact: 'Email' | 'LinkedIn' | 'Twitter';
  languages: string[];
}

// ============================================
// Data Constants
// ============================================

export const personalInfo: PersonalInfo = {
  name: 'Michael Dadi',
  title: 'Senior Software Engineer',
  tagline: 'React Native & Full Stack Developer',
  bio: `Passionate software engineer with expertise in building cross-platform mobile applications 
        and modern web experiences. Specializing in React Native, Expo, and full-stack development 
        with a focus on creating performant, user-friendly applications.`,
  email: 'michaeldadi@pm.me',
  location: 'New York, NY',
  timezone: 'EST (UTC-5)',
  avatar: '/images/avatar.jpg',
  resume: '/resume.pdf',
  availability: 'Busy',
  preferredContact: 'Email',
  languages: ['English', 'Hebrew'],
};

export const projects: Project[] = [
  {
    id: 'social-media-app',
    title: 'Social Media App',
    description: 'React Native app with real-time messaging, stories, and social features.',
    longDescription: `A comprehensive social media platform built with React Native and Expo, 
                      featuring real-time messaging, ephemeral stories, and advanced social networking 
                      capabilities. Implemented custom animations and optimized performance for smooth 
                      60fps scrolling even with complex media content.`,
    category: 'Mobile App',
    status: 'In Production',
    featured: true,
    techStack: ['React Native', 'Expo', 'Firebase', 'TypeScript', 'Redux', 'Socket.io'],
    image: '/images/projects/social-app-main.jpg',
    images: [
      '/images/projects/social-app-1.jpg',
      '/images/projects/social-app-2.jpg',
      '/images/projects/social-app-3.jpg',
    ],
    liveUrl: 'https://social-app.example.com',
    githubUrl: 'https://github.com/yourusername/social-app',
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
      author: 'Jane Smith',
      role: 'Product Manager',
      company: 'TechCorp',
    },
  },
  {
    id: 'ecommerce-platform',
    title: 'E-Commerce Platform',
    description: 'Full-stack Next.js app with payments, inventory, and admin dashboard.',
    longDescription: `A complete e-commerce solution built with Next.js 14, featuring server-side 
                      rendering for SEO optimization, real-time inventory management, and a comprehensive 
                      admin dashboard. Integrated with Stripe for payments and implemented advanced 
                      caching strategies for sub-100ms page loads.`,
    category: 'Full Stack',
    status: 'In Production',
    featured: true,
    techStack: ['Next.js', 'TypeScript', 'Stripe', 'PostgreSQL', 'Tailwind CSS', 'AWS'],
    image: '/images/projects/ecommerce-main.jpg',
    liveUrl: 'https://shop.example.com',
    githubUrl: 'https://github.com/yourusername/ecommerce',
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
  // Add more projects...
];

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
  // Add more skills...
];

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
  // Add more experience...
];

export const education: Education[] = [
  {
    id: 'bs-computer-science',
    institution: 'Pace University, New York',
    degree: 'Bachelor of Science',
    field: 'Computer Science',
    startDate: '2017-09-01',
    endDate: '2022-05-15',
    relevantCourses: [
      'Mobile Application Development',
      'Distributed Systems',
      'Machine Learning',
      'Software Engineering',
    ],
  },
];

export const socialLinks: SocialLink[] = [
  {
    platform: 'GitHub',
    url: 'https://github.com/michaeldadi',
    username: 'michaeldadi',
  },
  {
    platform: 'LinkedIn',
    url: 'https://linkedin.com/in/michael-dadi-a56465121',
    username: 'Michael Dadi',
  },
];

// ============================================
// Helper Functions
// ============================================

export const getFeaturedProjects = (): Project[] => {
  return projects.filter(project => project.featured);
};

export const getProjectsByCategory = (category: ProjectCategory): Project[] => {
  return projects.filter(project => project.category === category);
};

export const getActiveProjects = (): Project[] => {
  return projects.filter(
    project => project.status === 'In Production' || project.status === 'Beta'
  );
};

export const getSkillsByCategory = (category: SkillCategory): Skill[] => {
  return skills.filter(skill => skill.category === category);
};

export const getTopSkills = (limit: number = 6): Skill[] => {
  return skills
    .toSorted((a, b) => b.proficiency - a.proficiency || b.yearsOfExperience - a.yearsOfExperience)
    .slice(0, limit);
};

export const getCurrentExperience = (): Experience | undefined => {
  return experience.find(exp => !exp.endDate);
};

export const getTotalYearsOfExperience = (): number => {
  const startDate = new Date(experience[experience.length - 1]?.startDate || new Date());
  const now = new Date();
  return Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365));
};

export const getProjectCount = (): number => {
  return projects.length;
};

// ============================================
// SEO & Meta Data Helpers
// ============================================

export const generateProjectMetadata = (projectId: string) => {
  const project = projects.find(p => p.id === projectId);
  if (!project) return null;

  return {
    title: `${project.title} - ${personalInfo.name}`,
    description: project.longDescription || project.description,
    keywords: project.techStack.join(', '),
    image: project.image,
    author: personalInfo.name,
  };
};

// ============================================
// Form & Contact Helpers
// ============================================

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  projectType?: ProjectCategory;
  budget?: string;
  timeline?: string;
}

export const projectInquiryTemplates = {
  'Mobile App': {
    subject: 'Mobile App Development Inquiry',
    message: `Hi ${personalInfo.name},\n\nI'm interested in discussing a mobile app project...`,
  },
  'Web App': {
    subject: 'Web Application Development Inquiry',
    message: `Hi ${personalInfo.name},\n\nI have a web application project in mind...`,
  },
  'Full Stack': {
    subject: 'Full Stack Development Inquiry',
    message: `Hi ${personalInfo.name},\n\nI need help with a full stack application...`,
  },
};

// ============================================
// Analytics & Tracking Events
// ============================================

export const analyticsEvents = {
  PROJECT_VIEW: 'project_view',
  RESUME_DOWNLOAD: 'resume_download',
  CONTACT_FORM_SUBMIT: 'contact_form_submit',
  SOCIAL_LINK_CLICK: 'social_link_click',
  LIVE_DEMO_CLICK: 'live_demo_click',
  GITHUB_CLICK: 'github_click',
} as const;

export type AnalyticsEvent = (typeof analyticsEvents)[keyof typeof analyticsEvents];
