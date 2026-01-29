---
title: "First Client Lessons"
description: "Lessons learned from my first client project"
pubDate: 2025-02-16
author: "Kamil Rogozinski"
tags: ["client", "new-tech", "astro"]
---

# Overview of my first client project

I've just wrapped up my first ever client project: a website for my local barbershop. I've been going there for about three years, so when the owner asked if I could build him a simple, fast, and modern site, I was all in. The experience turned out to be a great deep-dive into AstroJS, static site hosting, and even pulling in data from the Google Places API.

---

## The Project Overview

The website needed the following sections:

- **Homepage / Landing Page** – A quick intro, hero image, and a gallery showcasing the shop’s vibe.
- **Services** – A list of services offered by the barbershop.
- **Reviews** – Integrating Google Places API to pull actual customer reviews directly from Google.
- **Community** – Highlighting the barbershop's contributions to the local community (charity drives, events, etc.).
- **About / Meet the Team** – Images of the barbers and their roles in the shop.
- **Contact** – Location, shop hours, and a Google Maps embed for directions.
- **Shop** – _(Future)_ A list of products and services offered by the barbers.

Since this is a local barbershop, the goal was to create a straightforward static site that loads quickly and doesn’t bombard visitors with unnecessary scripts. In other words, it had to be simple to navigate and friendly for both desktop and mobile users.

---

## Why AstroJS?

I’d heard about AstroJS for a while but never tried it out. The key selling point that caught my attention was **“Ship less JavaScript”**. Astro takes the approach of rendering most content as static HTML and only shipping client-side scripts where needed. This felt like a perfect fit for a site that mostly relies on text, images, and a few interactive elements.

### Initial Impressions

- **Minimal JavaScript Overhead**: The first time I ran the dev server, I was impressed at how responsive and snappy everything felt.
- **"Islands" Architecture**: I had to get used to the concept of Astro “islands”—these are interactive components that are hydrated on the client side. In simpler terms, Astro keeps each interactive section isolated, so it doesn't affect performance across the entire page.
- **File Structure**: Astro enforces a pretty strict folder structure. At first, it felt constraining, but I came to appreciate how it keeps components, pages, and static assets organized.

Overall, there's a bit of a learning curve with Astro, but once I got the hang of it, everything started to make sense.

---

## Hosting on Netlify

After building the site, I started thinking about hosting. This project is for a small local business, so cost was definitely a factor. Netlify’s free tier is often enough for straightforward static sites, and the only real cost for the client would be the domain name itself.

### Steps to Deploy

1. **Connect Repository**: I created a new repository on GitHub for the barbershop site.
2. **Netlify Integration**: Went to Netlify, clicked “New site from Git,” and linked it to the GitHub repo.
3. **Build Settings**: Astro’s default build command is typically `npm run build`, and the output directory is `dist`. Netlify usually detects this automatically, but I double-checked in the deployment settings.
4. **Domain Setup**: The client purchased a custom domain. I set up the DNS records to point to Netlify’s servers, which was pretty straightforward, though I had to read through the docs to figure out how to do it.
5. **Go Live**: Once the DNS propagated, the site was live. (Prior to this project, I didn't even know what DNS propagation was!)

Netlify also offers a neat preview deployment feature, so we could test changes or new features in a staging environment before pushing them to production.

---

## Implementation Details

### Google Places API for Reviews

The owner wanted a live feed of customer reviews from Google, so I used the Google Places API. Here’s the gist of how I did it:

1. **API Key**: I generated an API key from the Google Cloud Platform console and restricted it to only work with the barbershop domain.
2. **Serverless Function (Optional)**: In some cases, you might need a serverless function to keep the API key hidden. But with Astro, you can fetch data during the build process server-side.
3. **Display**: I created a small Astro component that displays each review, including the rating and user comments.

### Embedding Google Maps

For the “Contact” section, I embedded a Google Map so visitors can see the exact location. This was as simple as copying the embed code from Google Maps and dropping it into the relevant Astro component. I made sure to keep it responsive by applying standard responsive iframe techniques (wrapping the iframe in a container and setting width/height to 100% with some CSS).

### Image Gallery

Astro's image handling is straightforward, but you still want to optimize images for performance. Since I just had a handful of photos, I made sure they were resized and compressed before placing them in the `public` folder. For even better optimization, Astro has an experimental image component that can handle responsive images with ease. I might switch to that in a future update.

### Meet the Team & Community

The barbershop owner wanted a personal touch, so we created profiles for each barber, with a short bio and a photo. For the community section, we showcased local events and fundraisers they've hosted or participated in.

### Server-Side Rendering & Netlify Functions

One of the trickier parts of the project was figuring out how to securely handle the API key for Google Places. Initially, I tried making calls on the client side, but that would expose the API key in the browser. Then I looked into **Astro’s server-side rendering** and Netlify Functions:

- **SSR in Astro**: By doing the API calls during the build process, I could keep the API key on the server side. But in some cases, you still need dynamic data (fresh reviews, for instance), which might require a serverless function.
- **Netlify Functions**: I ended up storing my API key in Netlify’s environment variables. That way, the function could fetch the reviews without exposing the key to the client. Getting the function set up to deploy alongside Astro took a bit of trial and error, but Netlify’s docs helped me iron things out.

---

## Performance & SEO With Lighthouse

Another challenge was making sure the site performed well and scored highly on Lighthouse. I found myself getting quite fixated on hitting **100%** on Performance, SEO, Accessibility, and Best Practices. Here’s what I learned:

- **Image Optimization**: Compressing and resizing images before uploading them was crucial. Astro's approach already helps, but manual optimization is still important.
- **Minimal JavaScript**: Astro naturally limits client-side JS, which boosted my Lighthouse score for Performance and Best Practices.
- **Meta Tags & Semantic HTML**: Simple SEO wins like `meta` descriptions, proper heading hierarchy, and alt text on images go a long way toward high SEO scores.
- **Avoiding Over-Optimizing**: Chasing a perfect Lighthouse score can lead to diminishing returns. I realized that real-world user experience should take precedence over perfection in test metrics (although it’s still nice to see the 100s!).

Even after spending some time tuning the site, I still find that the site does not always rank well on google search results. I think this is an area where I need to do more research and improve in.

---

## Lessons Learned

1. **Astro's Structure**: At first, the structure felt rigid, but I soon realized it forces you to keep everything neatly organized.
2. **Performance by Default**: Astro really does prioritize performance, which made a huge difference for a small business site aiming for fast load times on mobile devices.
3. **Netlify Simplicity**: Netlify’s free tier is often enough for most small business static sites. The biggest cost was just the domain.
4. **Google API Quirks**: Managing API keys is always a bit tricky. Make sure you lock down your keys and know whether you're fetching data at build time or runtime. This caused me a lot of trouble when I wanted to use Netlify Functions to fetch the data without exposing the key.
5. **Client Communication**: This was my first real client project, and I learned a lot about managing expectations, deadlines, and scope creep (hello, new features!).

---

## Final Thoughts

If you're looking to build a static, fast site, definitely give Astro a spin. Once you get over the initial setup, it’s surprisingly straightforward. And if you’re seeking a free or low-cost hosting solution, Netlify is a fantastic companion—easy to set up, with plenty of useful extras.

This project was my first step into blending a new JavaScript framework (Astro) with a real-world client scenario. Although it took me a bit of time to grasp the folder structure and “island architecture,” I came away appreciating Astro’s minimalistic approach to shipping code. Now that the barbershop site is live, I’ve seen firsthand how fast it loads and how well it handles SEO out of the box.

We are currently in discussion of adding a shop section to the site for e-vouchers to the barbershop. I’ve started looking into possible solutions, but it’s a bit more complex than I initially thought. I'll be sure to write about it in a future post if we go ahead with it.

Thanks for reading! If you have any questions about Astro, Netlify, or pulling data from the Google Places API, feel free to reach out using the form on the [contact page](https://kameleon21.github.io/Personal-Website/#contact).
