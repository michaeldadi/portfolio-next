// lib/utils/format.ts

import { format, formatDistance, parseISO } from 'date-fns';
import { parsePhoneNumberWithError, isValidPhoneNumber, type CountryCode } from 'libphonenumber-js';

// Date formatting
export const formatDate = (date: string | Date) => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d, yyyy');
};

export const formatDateTime = (date: string | Date) => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d, yyyy h:mm a');
};

export const formatRelativeTime = (date: string | Date) => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistance(d, new Date(), { addSuffix: true });
};

// Phone formatting
export const formatPhone = (phone: string, country = 'US' as CountryCode) => {
  if (!phone) return '';
  try {
    const parsedPhone = parsePhoneNumberWithError(phone, country);
    return parsedPhone.formatNational();
  } catch {
    return phone;
  }
};

export const formatPhoneInternational = (phone: string, country = 'US' as CountryCode) => {
  try {
    const parsedNumber = parsePhoneNumberWithError(phone, country);
    return parsedNumber.formatInternational();
  } catch {
    return phone;
  }
};

export const validatePhone = (phone: string, country = 'US' as CountryCode) => {
  return isValidPhoneNumber(phone, country);
};

// Currency
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// File size
export const formatFileSize = (bytes: number) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
};
