import { getCollection } from 'astro:content';

/** Projects, newest first. */
export async function getProjects() {
  const entries = await getCollection('projects');
  return entries.sort((a, b) => a.data.order - b.data.order).map((entry) => entry.data);
}
