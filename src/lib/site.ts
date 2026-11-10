export const site = {
  name: 'Michael Dadi',
  title: 'Michael Dadi — Senior Software Engineer',
  url: 'https://michaeldadi.com',
  description:
    'Senior software engineer and founding engineer. Web, mobile, cloud infrastructure, and the production work that connects them.',
  github: 'https://github.com/michaeldadi',
  linkedin: 'https://www.linkedin.com/in/michael-dadi-a56465121/',
  updated: '2026-11-10',
};

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(date));
}

export function readingTime(body: string | undefined) {
  return Math.max(1, Math.ceil((body ?? '').split(/\s+/).length / 220));
}
