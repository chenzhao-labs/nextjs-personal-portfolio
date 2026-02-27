# Next.js Personal Portfolio Website

A modern portfolio website built with Next.js 16, Tailwind CSS 4, and TypeScript, featuring blog support, internationalization (English/Chinese), and dark mode.

[![Demo Screenshot](.github/asset/sceenshot.png)](https://www.czhao.xyz/)

## Features

- 🌍 **International Support**: Built-in English/Chinese switching, easily extensible to other languages
- 🌗 **Theme Switching**: Supports light/dark mode toggling
- 📰 **Integrated Blog**: Write posts using MDX format
- 📱 **Responsive Design**: Perfectly adapts to desktop, tablet, and mobile devices
- 🤖 **SEO Optimized**: Includes metadata, JSON-LD structured data, and Open Graph tags
- 🔍 **Search Engine Friendly**: Automatically generates sitemap.xml and robots.txt
- 📊 **Data Analysis**: Integrates Google Analytics, Google Tag Manager, etc.
- ⚡ **High Performance**: Optimized loading speed and performance
- 🎨 **Modern Design**: Uses Tailwind CSS 4 and Shadcn UI components

## Tech Stack

- ⚡ **Next.js 16**: Based on the latest App Router architecture
- 🔥 **TypeScript**: Provides complete type safety
- 💎 **Tailwind CSS 4**: Modern styling framework with the latest @import syntax
- 💅 **UI Components**: Integrated [shadcn/ui](https://ui.shadcn.com/) component library
- 🎬 **Animation Effects**: Smooth animations powered by Framer Motion
- 🌐 **Internationalization**: Multi-language support via next-intl
- 🌙 **Theme Management**: Dark mode support via next-themes
- ✅ **Code Quality**: Configured ESLint and Prettier to ensure code standards

## Preview

- Personal Portfolio: [czhao.xyz](https://www.czhao.xyz/)

## Quick Start

Clone the project and start the development server:

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/chenzhao-labs/nextjs-personal-portfolio
cd nextjs-personal-portfolio
pnpm install    # or: npm install | yarn install
```

### 2. Start Development Server

```bash
pnpm dev        # or: npm run dev | yarn dev
```

Visit [`http://localhost:3000`](http://localhost:3000) to view your local site.

### 3. Customize Your Portfolio

- Edit basic information in `/src/data/site.ts`
- Modify all interface text and personal information in JSON files under `/src/i18n/messages`
- Add blog posts in the `/content/blog` directory using Markdown or MDX format

## Deploy

One-click deployment to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fchenzhao-labs%2Fnextjs-personal-portfolio)

## Acknowledgements

This project was adapted from the [Nextjs-Portfolio-Blog-Research](https://github.com/zhengzangw/nextjs-portfolio-blog-research) template. Special thanks to the original author [Zangwei Zheng](https://www.zangwei.dev) for the open-source contribution.