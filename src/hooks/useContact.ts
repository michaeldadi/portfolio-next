import { useMutation } from '@tanstack/react-query';
import { contactApi } from '@/lib/api/contact';
import { toast } from 'sonner';

import type { ContactFormData } from '@/lib/data';
import { ApiError } from '@/lib/api/client';

export const useContactForm = () => {
  return useMutation({
    mutationFn: (data: ContactFormData) => contactApi.sendMessage(data),
    onSuccess: () => {
      toast.success("Message sent successfully! I'll get back to you soon.");
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || 'Failed to send message');
    },
  });
};
