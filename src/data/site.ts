/**
 * Site configuration
 * Unified configuration for the portfolio website
 */

export const BLUR_FADE_DELAY = 0.05; // 页面模糊渐变动画延迟（秒）

export const siteConfig = {
  url: "https://www.zangwei.dev", // Use 'www' for vercel recommendation
  lastUpdated: "2026.02", // 简历最后更新时间
  avatarUrl: "/me.png", // 头像
} as const;
