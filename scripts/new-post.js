#!/usr/bin/env bun

import { promises as fs } from 'fs';
import path from 'path';
import readline from 'readline';
import { newPostSource, slugify } from '../src/lib/posts.ts';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function createNewPost() {
  try {
    const title = await question('Post title: ');
    const description = await question('Post description: ');
    const tags = (await question('Tags (comma-separated): ')).split(',').map(tag => tag.trim());

    const slug = slugify(title);
    const pubDate = new Date().toISOString().split('T')[0];

    const blogDir = path.join(process.cwd(), 'src', 'content', 'blog');
    await fs.mkdir(blogDir, { recursive: true });

    const filePath = path.join(blogDir, `${slug}.md`);
    await fs.writeFile(filePath, newPostSource({ title, description, tags, pubDate }), { flag: 'wx' });

    console.log(`\nBlog post created at: ${filePath}`);
    console.log('You can now edit this file to add your content!');
  } catch (error) {
    console.error('Error creating blog post:', error);
  } finally {
    rl.close();
  }
}

createNewPost();
