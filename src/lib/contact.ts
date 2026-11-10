export type ContactField = 'name' | 'email' | 'message';
export interface ContactSubmission {
  name: string;
  email: string;
  message: string;
  turnstileToken: string;
  submissionId: string;
}
export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function validateFields(input: Record<string, unknown>) {
  const fields: Partial<Record<ContactField, string>> = {};
  const name = typeof input.name === 'string' ? input.name.trim() : '';
  const email = typeof input.email === 'string' ? input.email.trim() : '';
  const message = typeof input.message === 'string' ? input.message.trim() : '';
  if (!name || name.length > 100) fields.name = 'Enter a name between 1 and 100 characters.';
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    fields.email = 'Enter a valid email address.';
  if (message.length < 10 || message.length > 5000)
    fields.message = 'Enter a message between 10 and 5,000 characters.';
  return { fields, value: { name, email, message }, valid: Object.keys(fields).length === 0 };
}
