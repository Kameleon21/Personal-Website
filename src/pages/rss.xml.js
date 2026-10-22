import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { postUrl, sortNewestFirst } from '../lib/posts';
import { BASE } from '../lib/routes';

export async function GET(context) {
  const posts = sortNewestFirst(await getCollection('blog'));

  return rss({
    title: 'Kamil Rogozinski Blog',
    description: 'Thoughts on software development, design, and technology.',
    site: new URL(BASE, context.site),
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: postUrl(post.slug),
    })),
  });
}
