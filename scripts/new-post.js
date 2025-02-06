import { writeFileSync } from 'fs';
import { join } from 'path';

const title = process.argv[2];
if (!title) {
  console.error('Please provide a title for the blog post');
  process.exit(1);
}

const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
const date = new Date().toISOString().split('T')[0];

const template = `---
title: "${title}"
description: ""
pubDate: ${date}
author: "Your Name"
image: "/blog/${slug}.jpg"
tags: []
---

# ${title}

`;

const filePath = join(process.cwd(), 'src/content/blog', `${slug}.md`);
writeFileSync(filePath, template);
console.log(`Created new blog post at ${filePath}`); 