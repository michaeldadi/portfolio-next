'use client';

import { motion } from 'framer-motion';
import { CalendlyButton } from './shared/CalendlyButton';
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';
import { personalInfo, socialLinks } from '@/lib/data';

const Hero = () => {
  return (
    <section
      id='home'
      className='relative flex min-h-screen items-center justify-center overflow-hidden px-6'
    >
      {/* Animated background gradient */}
      <div className='absolute inset-0 bg-gradient-to-br from-purple-900/20 via-gray-900 to-pink-900/20' />

      {/* Floating orbs */}
      <div className='absolute top-20 left-10 h-72 w-72 animate-pulse rounded-full bg-purple-600/30 blur-3xl' />
      <div className='absolute right-10 bottom-20 h-96 w-96 animate-pulse rounded-full bg-pink-600/30 blur-3xl delay-1000' />

      <div className='relative z-10 mx-auto max-w-7xl text-center'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className='mb-6 text-5xl font-bold text-white md:text-7xl'>
            Hi, I&#39;m{' '}
            <span className='bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent'>
              {personalInfo.name}
            </span>
          </h1>

          <p className='mb-4 text-xl text-gray-300 md:text-2xl'>{personalInfo.title}</p>

          <p className='mx-auto mb-8 max-w-2xl text-lg text-gray-400'>{personalInfo.tagline}</p>

          {/* CTA Buttons */}
          <div className='mb-12 flex flex-col justify-center gap-4 sm:flex-row'>
            <CalendlyButton text='Schedule a Call' />
            <a
              href='#projects'
              className='rounded-lg border border-gray-600 px-8 py-3 font-semibold text-white transition hover:bg-gray-800'
            >
              View My Work
            </a>
          </div>

          {/* Social Links */}
          <div className='flex justify-center gap-6'>
            {socialLinks.map(link => {
              const Icon =
                link.platform === 'GitHub'
                  ? Github
                  : link.platform === 'LinkedIn'
                    ? Linkedin
                    : Mail;
              return (
                <motion.a
                  key={link.platform}
                  href={link.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='rounded-full bg-gray-800 p-3 transition hover:bg-gray-700'
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className='h-5 w-5' />
                </motion.a>
              );
            })}
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className='absolute bottom-10 left-1/2 -translate-x-1/2 transform'
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ArrowDown className='h-6 w-6 text-gray-400' />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
