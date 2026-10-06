import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('blog')).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
  const base = import.meta.env.BASE_URL;

  return rss({
    title: 'Kamil Rogozinski Blog',
    description: 'Thoughts on software development, design, and technology.',
    site: new URL(base, context.site),
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `${base}blog/${post.slug}/`,
    })),
  });
}
