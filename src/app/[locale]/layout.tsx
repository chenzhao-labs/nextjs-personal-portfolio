import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { hasLocale, Locale, NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { Inter as FontSans } from "next/font/google";
import { notFound } from "next/navigation";

import Footer from "@/components/blocks/footer";
import Navbar from "@/components/blocks/navbar/navbar";
import { ScrollRestore } from "@/components/blocks/scroll-restore";
import JsonLdScripts from "@/components/jsonld-scripts";
import {
  BaiduSiteVerification,
  GoogleTagManager,
} from "@/components/third-party";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DEFAULT_LOCALE, routing } from "@/i18n/routing";
import { constructMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";

/* Fonts */
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

/* Metadata */
type MetadataProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: MetadataProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return constructMetadata({
    description: t("headline"),
    locale: locale as Locale,
    path: `/`,
  });
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale - if invalid, trigger 404
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale || DEFAULT_LOCALE} suppressHydrationWarning>
      <head>
        <BaiduSiteVerification />
        <JsonLdScripts locale={locale} />
      </head>

      <body
        className={cn(
          "bg-background min-h-screen font-sans antialiased",
          fontSans.variable,
        )}
      >
        {/* Main Layout */}
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <TooltipProvider delayDuration={0}>
              <ScrollRestore />
              <Navbar />
              {children}
              <Footer />
            </TooltipProvider>
          </ThemeProvider>
        </NextIntlClientProvider>

        {/* Third-party services */}
        {process.env.NODE_ENV === "development" ? null : (
          <>
            <GoogleTagManager />
            {process.env.VERCEL_ENV ? (
              <>
                <Analytics />
                <SpeedInsights />
              </>
            ) : (
              <></>
            )}
          </>
        )}
      </body>
    </html>
  );
}
