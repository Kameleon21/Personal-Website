#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function createNewPost() {
  try {
    // Get post details
    const title = await question('Post title: ');
    const description = await question('Post description: ');
    const tags = (await question('Tags (comma-separated): ')).split(',').map(tag => tag.trim());
    
    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    // Get current date
    const date = new Date().toISOString().split('T')[0];
    
    // Create frontmatter
    const frontmatter = `---
title: "${title}"
description: "${description}"
pubDate: ${date}
author: "Kamil Rogozinski"
tags: ${JSON.stringify(tags)}
---

# ${title}

Write your blog post content here...
`;

    // Ensure blog directory exists
    const blogDir = path.join(process.cwd(), 'src', 'content', 'blog');
    await fs.mkdir(blogDir, { recursive: true });

    // Create new post file
    const filePath = path.join(blogDir, `${slug}.md`);
    await fs.writeFile(filePath, frontmatter);

    console.log(`\nBlog post created at: ${filePath}`);
    console.log('You can now edit this file to add your content!');
  } catch (error) {
    console.error('Error creating blog post:', error);
  } finally {
    rl.close();
  }
}

createNewPost(); 