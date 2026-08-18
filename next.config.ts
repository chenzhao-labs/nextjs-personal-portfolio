import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/open-source/nextjs-portfolio-blog-research/docs",
        destination: "/blog/note-nextjs-homepage",
        permanent: true,
      },
      {
        source: "/open-source/nextjs-portfolio-blog-research/docs/:path*",
        destination: "/blog/note-nextjs-homepage",
        permanent: true,
      },
      {
        source: "/zh/open-source/nextjs-portfolio-blog-research/docs",
        destination: "/zh/blog/note-nextjs-homepage",
        permanent: true,
      },
      {
        source: "/zh/open-source/nextjs-portfolio-blog-research/docs/:path*",
        destination: "/zh/blog/note-nextjs-homepage",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
