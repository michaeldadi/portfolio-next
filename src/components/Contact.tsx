'use client';

import { motion } from 'framer-motion';
import { CalendlyButton } from './shared/CalendlyButton';
import { Mail, MapPin, Clock } from 'lucide-react';
import { personalInfo } from '@/lib/data';

export default function Contact() {
  return (
    <section id='contact' className='px-6 py-20'>
      <div className='mx-auto max-w-4xl'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='mb-12 text-center'
        >
          <h2 className='mb-4 text-4xl font-bold md:text-5xl'>
            <span className='bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent'>
              Let&#39;s Connect
            </span>
          </h2>
          <p className='text-lg text-gray-400'>
            Have a project in mind? I&#39;d love to hear about it.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='rounded-2xl border border-gray-700 bg-gray-800 p-8'
        >
          {/* Contact Info */}
          <div className='mb-8 grid gap-6 md:grid-cols-3'>
            <div className='text-center'>
              <Mail className='mx-auto mb-2 h-8 w-8 text-purple-400' />
              <p className='text-sm text-gray-400'>Email</p>
              <a
                href={`mailto:${personalInfo.email}`}
                className='text-white transition hover:text-purple-400'
              >
                {personalInfo.email}
              </a>
            </div>

            <div className='text-center'>
              <MapPin className='mx-auto mb-2 h-8 w-8 text-purple-400' />
              <p className='text-sm text-gray-400'>Location</p>
              <p className='text-white'>{personalInfo.location}</p>
            </div>

            <div className='text-center'>
              <Clock className='mx-auto mb-2 h-8 w-8 text-purple-400' />
              <p className='text-sm text-gray-400'>Timezone</p>
              <p className='text-white'>{personalInfo.timezone}</p>
            </div>
          </div>

          {/* Availability Status */}
          <div className='mb-8 text-center'>
            <div className='inline-flex items-center gap-2 rounded-full bg-green-500/20 px-4 py-2'>
              <div className='h-2 w-2 animate-pulse rounded-full bg-green-500' />
              <span className='text-sm font-medium text-green-400'>
                {personalInfo.availability === 'Available'
                  ? 'Available for new projects'
                  : 'Currently busy'}
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className='flex flex-col justify-center gap-4 sm:flex-row'>
            <CalendlyButton text='Schedule a Call' />
            <a
              href={`mailto:${personalInfo.email}?subject=Project Inquiry`}
              className='rounded-lg border border-gray-600 px-8 py-3 text-center font-semibold text-white transition hover:bg-gray-700'
            >
              Send Email
            </a>
          </div>

          <p className='mt-6 text-center text-sm text-gray-500'>
            Preferred contact: {personalInfo.preferredContact} • Usually respond within 24 hours
          </p>
        </motion.div>
      </div>
    </section>
  );
}
