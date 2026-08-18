/**
 * Site configuration
 * Unified configuration for the portfolio website
 */

export const BLUR_FADE_DELAY = 0.05; // 页面模糊渐变动画延迟（秒）

// 在构建时生成，Vercel 每次部署会自动更新。
const buildDate = new Intl.DateTimeFormat("zh-CN", {
  timeZone: "Asia/Shanghai",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
})
  .format(new Date())
  .replaceAll("/", ".");

export const siteConfig = {
  url: "https://czhao.xyz",
  lastUpdated: buildDate, // 本次构建日期
  avatarUrl: "/portrait/me.png", // 头像
} as const;
