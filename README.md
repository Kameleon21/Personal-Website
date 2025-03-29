# Personal Portfolio Website

A modern, responsive portfolio website built with Astro, TailwindCSS, and TypeScript. View it live at [https://kameleon21.github.io/Personal-Website/].

## 🚀 Features

- **Modern Stack**: Built with Astro for optimal performance and TailwindCSS for styling
- **Responsive Design**: Fully responsive layout that works on all devices
- **Performance Optimized**:
  - Automatic asset compression
  - Minimal JavaScript usage
  - Optimized images and assets
- **Smooth Animations**: Custom animations for enhanced user experience
- **Blog Ready**: Pre-configured blog section (coming soon)
- **Type Safe**: Built with TypeScript for better development experience

## 🛠️ Tech Stack

- [Astro](https://astro.build) - Static Site Generator
- [TailwindCSS](https://tailwindcss.com) - Styling
- [TypeScript](https://www.typescriptlang.org/) - Type Safety
- [GitHub Actions](https://github.com/features/actions) - CI/CD
- [GitHub Pages](https://pages.github.com/) - Hosting

## � Project Structure

```
/
├── src/
│   ├── assets/         # Static assets (images, etc.)
│   ├── components/     # Reusable Astro components
│   ├── content/        # Blog content (markdown)
│   ├── data/          # Static data files
│   ├── layouts/       # Page layouts
│   ├── pages/         # Page components
│   ├── scripts/       # Client-side JavaScript
│   ├── styles/        # Global styles and CSS
│   └── utils/         # Utility functions
├── public/            # Static files
└── package.json       # Project dependencies
```

## 🚀 Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/Kameleon21/Personal-Website.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Build for production:

   ```bash
   npm run build
   ```

## 🔧 Configuration

- `astro.config.mjs` - Astro configuration
- `tailwind.config.cjs` - TailwindCSS configuration
- `.github/workflows/deploy.yml` - GitHub Actions deployment workflow

## 🎨 Customization

### Typography

- Uses Merriweather for headings
- Uses Funnel Sans for body text
- Custom utility classes for typography in `src/styles/global.css`

### Colors

- Primary gradient: Blue to Purple
- Accent colors: Indigo
- Text colors: Gray scale

### Components

- Responsive navigation with hamburger menu
- Animated hero section
- Blog section (ready for content)
- Contact form
- Work showcase

## 📱 Mobile Optimization

- Touch-friendly navigation
- Optimized typography for mobile screens
- Proper spacing and padding for mobile devices
- Improved touch targets (44px minimum)

## 🚀 Deployment

The site automatically deploys to GitHub Pages when pushing to the master branch. The deployment process:

1. Builds the site using Astro
2. Optimizes and compresses assets
3. Deploys to GitHub Pages
4. Available at kamilrogozinski.github.io/Personal-Website

## 🔍 SEO

- Proper meta tags
- Semantic HTML structure
- Optimized for search engines
- Fast loading times

## � Performance Optimizations

- CSS and JavaScript minification
- Image optimization
- Lazy loading for images
- Minimal JavaScript usage
- Asset compression

## 🤝 Contributing

Feel free to submit issues and enhancement requests.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
