import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';
import { resolve } from 'node:path';
import { missingMedia } from '../lib/projects';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    author: z.string(),
    image: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

const PUBLIC_MEDIA = resolve('public/media');

const demoBase = {
  src: z.string().superRefine((src, ctx) => {
    const missing = missingMedia(src, PUBLIC_MEDIA);
    if (missing.length) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: `missing in public/media: ${missing.join(', ')}` });
    }
  }),
  alt: z.string().optional(),
};

// Projects render newest first, in file order; `order` keeps that explicit
// because collection order is not guaranteed.
const projectsCollection = defineCollection({
  loader: file('src/data/work.json', {
    parser: (text) =>
      JSON.parse(text).deployments.map((project: { repo: string }, order: number) => ({
        id: project.repo.replace(/\/$/, ''),
        order,
        ...project,
      })),
  }),
  schema: z.object({
    order: z.number(),
    repo: z.string(),
    kind: z.string(),
    name: z.string(),
    desc: z.string(),
    tags: z.array(z.string()),
    demo: z
      .discriminatedUnion('kind', [
        z.object({ kind: z.literal('terminal'), cwd: z.string(), shell: z.string(), ...demoBase }),
        z.object({ kind: z.literal('device'), host: z.string(), device: z.string(), ...demoBase }),
      ])
      .optional(),
    links: z.array(z.object({ label: z.string(), href: z.string().url() })),
  }),
});

export const collections = {
  'blog': blogCollection,
  'projects': projectsCollection,
};
