// 导入 Next.js 国际化服务端方法，用于获取对应语言的翻译文案
import { getTranslations } from "next-intl/server";
// 导入 Next.js 内置的路由链接组件（优化过的锚点链接，支持客户端路由）
import Link from "next/link";
// 导入 React 类型定义，用于 TS 类型校验
import type React from "react";

// 导入项目内部组件：图标集合
import { Icons } from "@/components/icons";
// 导入作品集相关业务组件（奖项、简介、联系信息等）
import AwardsSection from "@/components/portfolio/awards-section";
import Brief from "@/components/portfolio/brief";
import Contact from "@/components/portfolio/contact";
import DynamicBackground from "@/components/dynamic-background";
import Education from "@/components/portfolio/education";
import NewsSection from "@/components/portfolio/news";
import ProjectsSection from "@/components/portfolio/projects-section/projects-section";
import Services from "@/components/portfolio/services";
import Skills from "@/components/portfolio/skills";
import SocialLinks from "@/components/portfolio/socallinks"; // 注：原文件名可能是 social-links，此处保持原代码拼写
import Talks from "@/components/portfolio/talks";
import Work from "@/components/portfolio/work";
// 导入自定义 React Markdown 渲染组件，用于解析 MD 格式文案
import { CustomReactMarkdown } from "@/components/react-markdown";
// 导入模糊渐入动画组件
import { BlurFade } from "@/components/ui/blur-fade";

// 导入项目配置：动画延迟常量、站点基础配置
import { BLUR_FADE_DELAY, siteConfig } from "@/data/site";
// 导入国际化路由配置
import { routing } from "@/i18n/routing";
// 导入 JSON-LD 个人信息生成方法（用于 SEO 结构化数据）
import { generatePersonJsonLd } from "@/lib/jsonld";
// 导入社交数据转换工具方法
import { transformSocialData } from "@/lib/social-icons";
// 导入工具方法：图标组件获取、JSON-LD 脚本生成
import { getIconComponent, jsonldScript } from "@/lib/utils";

/**
 * 作品集主页组件（服务端组件，Next.js 默认异步组件）
 * 功能：渲染国际化的个人作品集主页，包含个人简介、项目、教育、工作等全量模块
 * @param props - 组件入参，包含路由参数（locale 语言标识）
 * @returns React 元素（作品集主页完整内容）
 */
export default async function Page(props: {
  // 路由参数：Promise 包裹的 locale（语言类型，如 en/zh）
  params: Promise<{ locale: string }>;
}) {
  // 1. 初始化基础数据：解析路由参数，获取当前语言标识
  // 等待路由参数解析完成
  const params = await props.params;
  // 提取 locale，若不存在则使用国际化配置中的默认语言
  const locale = params.locale || routing.defaultLocale;
  // 获取对应语言的翻译文案方法（t 方法用于后续获取指定 key 的文案）
  const t = await getTranslations({ locale });

  // 2. 处理社交数据：转换国际化文案中的社交信息，适配组件渲染格式
  const socialData = transformSocialData(
    // 从翻译文案中获取 raw 格式的 social 数据，进行类型断言
    t.raw("social") as Record<
      string,
      {
        name: string; // 社交平台名称
        url: string; // 社交平台链接
        icon: string; // 社交平台图标标识
        navbar?: boolean; // 是否在导航栏显示
        content?: boolean; // 是否在内容区显示
        footer?: boolean; // 是否在页脚显示
      }
    >,
  );

  // 3. 定义通用工具方法：安全获取数组类型的翻译字段
  // 防止字段不存在、类型错误导致页面报错，默认返回空数组
  const getArrayField = <T,>(key: string): T[] => {
    try {
      // 获取对应 key 的原始翻译数据
      const value = t.raw(key);
      // 验证是否为数组，是则返回对应类型数组，否则返回空数组
      if (Array.isArray(value)) {
        return value as T[];
      }
      return [];
    } catch {
      // 捕获任何异常（如 key 不存在、数据格式异常），返回空数组保证页面稳定
      return [];
    }
  };

  // 4. 提取简单数组类型数据：技能、审稿会议、审稿期刊
  const skills = getArrayField<string>("skills"); // 个人技能列表
  const reviewerConferences = getArrayField<string>("reviewerConferences"); // 会议审稿经历
  const reviewerJournals = getArrayField<string>("reviewerJournals"); // 期刊审稿经历

  // 5. 生成 SEO 结构化数据：个人信息 JSON-LD（用于搜索引擎抓取个人信息）
  const personJsonLd = await generatePersonJsonLd(locale);

  // 6. 定义通用工具方法：安全获取集合类型的翻译字段（嵌套 items 数组的结构）
  // 适配 news、projects 等嵌套 { items: [] } 格式的国际化数据
  const getCollectionItems = <T,>(key: string): T[] => {
    try {
      // 拆分 key，获取父级字段（如 "news.items" -> "news"）
      const parentKey = key.split(".")[0];
      // 获取父级原始数据，断言为包含可选 items 数组的对象类型
      const collection = t.raw(parentKey) as
        | { items?: T[] | undefined }
        | undefined
        | null;
      // 多层验证：数据存在、是对象、包含 items 字段、items 是数组
      if (
        collection &&
        typeof collection === "object" &&
        "items" in collection &&
        Array.isArray(collection.items)
      ) {
        // 验证通过，返回 items 数组
        return collection.items as T[];
      }
      // 任何条件不满足，返回空数组
      return [];
    } catch {
      // 捕获异常，返回空数组保证页面稳定
      return [];
    }
  };

  // 7. 提取各类集合数据（嵌套 items 格式），并指定具体类型，适配对应组件渲染
  // 新闻动态数据
  const newsItems = getCollectionItems<{
    date: string; // 新闻日期
    title: string; // 新闻标题
    content: string; // 新闻内容
  }>("news.items");

  // 项目列表数据
  const projectsItems = getCollectionItems<{
    title: string; // 项目标题
    href?: string; // 项目链接
    dates: string; // 项目时间范围
    active: boolean; // 是否为活跃项目
    description: string; // 项目描述
    technologies: string[]; // 项目使用技术栈
    authors: string; // 项目作者
    links?: Array<{ type: string; href: string; icon: string }>; // 项目相关链接（如 Github、Demo）
    image?: string; // 项目图片
    video?: string; // 项目视频
  }>("projects.items");

  // 出版物列表数据（格式与项目类似，复用部分字段）
  const publicationsItems = getCollectionItems<{
    title: string;
    href?: string;
    dates: string;
    active: boolean;
    description: string;
    technologies: string[];
    authors: string;
    links?: Array<{ type: string; href: string; icon: string }>;
    image?: string;
    video?: string;
  }>("publications.items");

  // 教育经历数据
  const educationItems = getCollectionItems<{
    school: string; // 学校名称
    href: string; // 学校官网链接
    degree: string; // 获得学位
    logoUrl: string; // 学校 logo 地址
    start: string; // 入学时间
    end: string; // 毕业时间
  }>("education.items");

  // 工作经历数据
  const workItems = getCollectionItems<{
    company: string; // 公司名称
    href: string; // 公司官网链接
    badges: readonly string[]; // 公司标签
    location: string; // 工作地点
    title: string; // 职位名称
    logoUrl: string; // 公司 logo 地址
    start: string; // 入职时间
    end: string; // 离职时间（若为空则为当前在职）
    description: string; // 工作描述
  }>("work.items");

  // 奖项荣誉数据
  const awardsItems = getCollectionItems<{
    year: number; // 获奖年份
    title: string; // 奖项名称
  }>("awards.items");

  {/*
  // 教学经历数据 需同步注释 384行左右的 渲染板块
  const teachingItems = getCollectionItems<{
    date: string; // 教学时间
    title: string; // 教学课程/主题
    location: string; // 教学地点
  }>("teaching.items");
  */}
  
  {/*
  // 受邀演讲数据 需要同步修改下方414行左右 渲染部分
  const invitedTalksItems = getCollectionItems<{
    host: string; // 主办方
    url: string; // 演讲链接/资料地址
    date: string; // 演讲日期
    title: string; // 演讲标题
    logoUrl?: string; // 主办方 logo 地址
  }>("invitedTalks.items");
  */}

  // 8. 页面渲染：返回完整的作品集主页结构，按模块顺序排列
  return (
    <>
      <DynamicBackground />
      {/* 主容器：设置最大宽度、内外边距、弹性布局，保证页面响应式对齐 */}
      <main className="relative mx-auto flex min-h-dvh max-w-7xl flex-col space-y-8 px-6 py-8 pb-24 sm:space-y-10 sm:px-16 md:px-20 md:py-16 md:pt-14 lg:px-24 lg:py-20 xl:px-32 xl:py-24">
        {/* 英雄区（头部）：展示个人核心简介 */}
        <section id="hero" className="mt-16 sm:mt-28">
        {/* 插入 JSON-LD 结构化数据脚本，用于 SEO */}
        {jsonldScript(personJsonLd)}
        {/* 模糊渐入动画：延迟 0ms（立即执行） */}
        <BlurFade delay={0}>
          {/* 个人简介组件：传递核心个人信息和语言标识 */}
          <Brief
            name={t("name.full")} // 完整姓名
            firstName={t("name.given")} // 名
            surname={t("name.family")} // 姓
            initials={t("name.initials")} // 姓名首字母
            subtitle={t("subtitle")} // 副标题（职业定位）
            description={t("headline")} // 核心简介
            avatarUrl={siteConfig.avatarUrl} // 个人头像地址
            className="mx-auto w-full max-w-2xl space-y-8" // 样式类
            locale={locale} // 当前语言标识
          />
        </BlurFade>
      </section>

      {/* 社交链接区：展示个人各类社交平台入口 */}
      <section id="social">
        <BlurFade delay={BLUR_FADE_DELAY * 2}>
          <SocialLinks socials={socialData} />
        </BlurFade>
      </section>

      {/* 关于我区：展示个人详细介绍（MD 格式解析） */}
      <section id="about">
        <BlurFade delay={BLUR_FADE_DELAY * 3}>
          <h2 className="text-xl font-bold">{t("sections.about")}</h2>
        </BlurFade>
        <BlurFade delay={BLUR_FADE_DELAY * 4}>
          {/* 富文本容器：配置 MD 解析样式，适配暗黑模式 */}
          <div className="prose text-muted-foreground dark:prose-invert max-w-full font-sans text-sm text-pretty [&_img]:my-0 [&_img]:inline-block [&_img]:h-[1em] [&_img]:w-auto [&_img]:align-baseline">
            {/* 渲染 MD 格式的个人简介文案 */}
            <CustomReactMarkdown>{t("bioMarkdown")}</CustomReactMarkdown>
          </div>
        </BlurFade>
      </section>

      {/* 新闻动态区：仅当有新闻数据时才渲染 */}
      {newsItems && newsItems.length > 0 && (
        <section id="news">
          <NewsSection
            news={newsItems}
            delay={BLUR_FADE_DELAY * 5}
            title={t("sections.news.title")}
            showAllText={t("showAll")}
            collapseText={t("collapse")}
          />
        </section>
      )}

      {/* 项目展示区：仅当有项目数据时才渲染 */}
      {projectsItems && projectsItems.length > 0 && (
        <section id="projects">
          <div className="w-full space-y-12 py-12">
            {/* 项目区标题栏：居中展示标签和标题 */}
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="bg-foreground text-background inline-block rounded-lg px-3 py-1 text-sm">
                  {t("sections.selectedProjects")}
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  {t("sections.checkOutLatestWork")}
                </h2>
              </div>
            </div>
            {/* 项目列表组件：转换链接图标为组件，设置响应式展示数量 */}
            <ProjectsSection
              projects={projectsItems.map((project) => ({
                ...project,
                // 转换每个项目链接的图标标识为实际的图标组件
                links: project.links?.map((link) => ({
                  ...link,
                  icon: getIconComponent(link.icon),
                })),
              }))}
              delay={BLUR_FADE_DELAY * 3}
              mobileDisplayCount={4} // 移动端默认展示 4 个项目
              desktopDisplayCount={3} // 桌面端默认展示 3 个项目
              showAllText={t("showAll")} // 展示「查看全部」按钮文案
              collapseText={t("collapse")} // 添加收起文案
            />
          </div>
        </section>
      )}

      {/* 出版物区：仅当有出版物数据时才渲染 */}
      {publicationsItems && publicationsItems.length > 0 && (
        <section id="publications">
          <div className="w-full space-y-12 py-12">
            {/* 出版物标题栏：包含 Google Scholar 链接 */}
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="bg-foreground text-background inline-block rounded-lg px-3 py-1 text-sm">
                  {t("sections.research")}
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  {t("sections.publications.title")}
                </h2>
                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {t("sections.viewFullPublications")}{" "}
                  {/* 链接到 Google Scholar 完整出版物列表 */}
                  <Link
                    href={socialData.GoogleScholar.url}
                    className="text-foreground underline hover:no-underline"
                    target="_blank"
                  >
                    {socialData.GoogleScholar.name}
                  </Link>
                </p>
              </div>
            </div>
            {/* 出版物列表组件：复用 ProjectsSection 组件，配置不同展示数量 */}
            <ProjectsSection
              projects={publicationsItems.map((project) => ({
                ...project,
                links: project.links?.map((link) => ({
                  ...link,
                  icon: getIconComponent(link.icon),
                })),
              }))}
              delay={BLUR_FADE_DELAY * 3}
              mobileDisplayCount={3} // 移动端展示 3 个出版物
              desktopDisplayCount={3} // 桌面端展示 3 个出版物
              showAllText={t("showAll")} // 展示「查看全部」按钮文案
              collapseText={t("collapse")} // 添加收起文案
            />
          </div>
        </section>
      )}

      {/* 技能区：仅当有技能数据时才渲染 */}
      {Array.isArray(skills) && skills.length > 0 && (
        <section id="skills">
          <div className="flex min-h-0 flex-col gap-y-3">
            <h2 className="text-xl font-bold">{t("sections.skills")}</h2>
            <Skills skills={skills} />
          </div>
        </section>
      )}

      {/* 教育经历区：仅当有教育数据时才渲染 */}
      {educationItems && educationItems.length > 0 && (
        <section id="education">
          <div className="flex min-h-0 flex-col gap-y-3">
            <h2 className="text-xl font-bold">{t("sections.education")}</h2>
            <Education educations={educationItems} />
          </div>
        </section>
      )}

      {/* 工作经历区：仅当有工作数据时才渲染 */}
      {Array.isArray(workItems) && workItems.length > 0 && (
        <section id="work">
          <div className="flex min-h-0 flex-col gap-y-3">
            <h2 className="text-xl font-bold">
              {t("sections.workExperience")}
            </h2>
            <Work work={workItems} />
          </div>
        </section>
      )}

      {/* 奖项荣誉区：仅当有奖项数据时才渲染 */}
      {awardsItems && awardsItems.length > 0 && (
        <section id="awards">
          <h2 className="text-xl font-bold">{t("sections.awards")}</h2>
          <AwardsSection awards={awardsItems} showAllText={t("showAll") } collapseText={t("collapse")} />
        </section>
      )}

      {/*
      // 学术服务区：仅当有审稿/教学数据时才渲染 
      {((Array.isArray(reviewerConferences) &&
        reviewerConferences.length > 0) ||
        (Array.isArray(reviewerJournals) && reviewerJournals.length > 0) ||
        (Array.isArray(teachingItems) && teachingItems.length > 0)) && (
        <section id="academic-services">
          <div className="flex min-h-0 flex-col gap-y-3">
            <h2 className="text-xl font-bold">
              {t("sections.academicServices")}
            </h2>
            <Services
              reviewerConferences={reviewerConferences}
              reviewerJournals={reviewerJournals}
              teaching={teachingItems}
              reviewerConferencesLabel={t(
                "sections.teaching.reviewerConferencesLabel",
              )}
              reviewerJournalsLabel={t(
                "sections.teaching.reviewerJournalsLabel",
              )}
              teachingLabel={t("sections.teaching.teachingLabel")}
            />
          </div>
        </section>
      )}
      */}

      {/* 
      // 受邀演讲区：仅当有演讲数据时才渲染 
      {invitedTalksItems && invitedTalksItems.length > 0 && (
        <section id="invited-talks">
          <div className="flex min-h-0 flex-col gap-y-3">
            <h2 className="text-xl font-bold">
              {t("sections.invitedTalks.title")}
            </h2>
            <Talks talks={invitedTalksItems} showAllText={t("showAll") collapseText={t("collapse")} // 添加收起文案} />
          </div>
        </section>
      )}
      */}

      {/* 联系区：固定渲染，展示邮箱和预约链接 */}
      <section id="contact">
        <div className="grid w-full items-center justify-center gap-4 px-4 py-12 text-center md:px-6">
          <Contact
            emailUrl={socialData.email.url} // 邮箱链接
            calendlyUrl={socialData.calendly?.url} // 预约链接（可选）
            contactLabel={t("sections.contact")}
            getInTouch={t("sections.getInTouch")}
            contactDescription={t("sections.contactDescription")}
            viaEmail={t("sections.viaEmail")}
            askQuestions={t("sections.askQuestions")}
            exploreCollaboration={t("sections.exploreCollaboration")}
            coffeeChat={t("sections.coffeeChat")}
            schedule={t("sections.schedule")}
          />
        </div>
      </section>
    </main>
    </>
  );
}