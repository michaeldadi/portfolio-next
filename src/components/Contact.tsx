// components/Contact.tsx

'use client';

import { useForm } from 'react-hook-form';
import { useContactForm } from '@/hooks/useContact';
import { Loader2 } from 'lucide-react';
import { ContactFormData } from '@/lib/data';

export function ContactForm() {
  const { handleSubmit, reset } = useForm<ContactFormData>();
  const contactMutation = useContactForm();

  const onSubmit = async (data: ContactFormData) => {
    await contactMutation.mutateAsync(data);
    reset(); // Reset form on success
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}

      <button
        type='submit'
        disabled={contactMutation.isPending}
        className='rounded-lg bg-purple-600 px-8 py-3 disabled:opacity-50'
      >
        {contactMutation.isPending ? (
          <span className='flex items-center gap-2'>
            <Loader2 className='h-4 w-4 animate-spin' />
            Sending...
          </span>
        ) : (
          'Send Message'
        )}
      </button>
    </form>
  );
}
