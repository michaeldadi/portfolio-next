import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const common = {
  title: z.string().min(5),
  description: z.string().min(30),
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
  draft: z.boolean().default(false),
};

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: z.object({
    ...common,
    order: z.number().int().min(1).max(4),
    company: z.string(),
    role: z.string(),
    period: z.string(),
    headline: z.array(z.string()).min(2).max(4),
    accent: z.enum(['cobalt', 'sun', 'coral', 'mint']),
    technologies: z.array(z.string()).min(1),
    outcome: z.string(),
  }),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/articles' }),
  schema: z.object({ ...common, order: z.number().int(), topics: z.array(z.string()).min(1) }),
});

export const collections = { projects, articles };
