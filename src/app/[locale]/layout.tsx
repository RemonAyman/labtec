import type { Metadata } from "next";
import { Geist, Montserrat } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { WhatsAppButton } from "@/components/ui/whatsapp-button"


const montaserrat = Montserrat({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lap Tec | Premium Laptop Marketplace",
  description: "Egypt's premium laptop e-commerce marketplace.",
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <body className={`${montaserrat.className} antialiased`}>
        <SessionProvider>
          <ThemeProvider
            defaultTheme="system"
            storageKey="laptec-theme"
          >
            <NextIntlClientProvider messages={messages}>
              <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-300">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
                <WhatsAppButton />
              </div>
            </NextIntlClientProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
