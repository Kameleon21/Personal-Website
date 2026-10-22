import { profile } from './profile';
import { BASE, withBase } from './routes';

export const DEFAULT_AUTHOR = profile.name;
export const DEFAULT_OG_IMAGE = '/og-image.png';

type Dated = { data: { pubDate: Date } };

/** Newest first, without mutating the input. */
export function sortNewestFirst<T extends Dated>(posts: readonly T[]): T[] {
  return [...posts].sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function postUrl(slug: string, base = BASE): string {
  return withBase(`/blog/${slug}/`, base);
}

/**
 * Path of a page's social card: the post's frontmatter `image`
 * (root-relative, like markdown URLs) or the site default.
 */
export function ogImageFor(data: { image?: string }, base = BASE): string {
  const image = data.image || DEFAULT_OG_IMAGE;
  return /^[a-z]+:\/\//i.test(image) ? image : withBase(image, base);
}

export function readingTime(body: string): number {
  const wordsPerMinute = 200;
  const words = body.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export type NewPost = {
  title: string;
  description: string;
  tags: string[];
  /** `YYYY-MM-DD` */
  pubDate: string;
  author?: string;
};

/**
 * Source for a fresh post. Strings go through JSON.stringify, which is valid
 * YAML, so quotes and colons in a title can't break the frontmatter. No H1:
 * BlogPost renders the title.
 */
export function newPostSource({ title, description, tags, pubDate, author = DEFAULT_AUTHOR }: NewPost): string {
  const q = JSON.stringify;
  return `---
title: ${q(title)}
description: ${q(description)}
pubDate: ${pubDate}
author: ${q(author)}
tags: ${q(tags.filter(Boolean))}
---

Write your blog post content here...
`;
}
