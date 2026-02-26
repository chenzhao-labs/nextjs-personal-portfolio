import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/open-source/nextjs-portfolio-blog-research/docs",
        destination:
          "https://nextjs-portfolio-blog-research-docs.vercel.app/open-source/nextjs-portfolio-blog-research/docs",
      },
      {
        source: "/open-source/nextjs-portfolio-blog-research/docs/:path*",
        destination:
          "https://nextjs-portfolio-blog-research-docs.vercel.app/open-source/nextjs-portfolio-blog-research/docs/:path*",
      },
    ];
  },
};

export default withNextIntl(nextConfig);
