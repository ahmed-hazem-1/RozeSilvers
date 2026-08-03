import { ReactNode } from 'react';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { Header } from '@/components/layout/Header/Header';
import { Footer } from '@/components/layout/Footer/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer/CartDrawer';
import { FloatingContact } from '@/components/layout/FloatingContact/FloatingContact';
import {
  AIChooserProvider,
  AIChooserDrawer,
  AIChooserLauncher,
  WelcomePromptModal,
} from '@/components/features/AIChooser';
import '../globals.css';

const playfair = localFont({
  src: [
    { path: '../../../public/fonts/Playfair_Display_latin_400.woff2', weight: '400', style: 'normal' }
  ],
  variable: '--font-serif-en'
});

const inter = localFont({
  src: [
    { path: '../../../public/fonts/Inter_latin_300.woff2', weight: '300', style: 'normal' },
    { path: '../../../public/fonts/Inter_latin_400.woff2', weight: '400', style: 'normal' },
    { path: '../../../public/fonts/Inter_latin_500.woff2', weight: '500', style: 'normal' },
    { path: '../../../public/fonts/Inter_latin_600.woff2', weight: '600', style: 'normal' }
  ],
  variable: '--font-sans-en'
});

const amiri = localFont({
  src: [
    { path: '../../../public/fonts/Amiri_arabic_400.woff2', weight: '400', style: 'normal' }
  ],
  variable: '--font-serif-ar'
});

const tajawal = localFont({
  src: [
    { path: '../../../public/fonts/Tajawal_arabic_300.woff2', weight: '300', style: 'normal' },
    { path: '../../../public/fonts/Tajawal_arabic_400.woff2', weight: '400', style: 'normal' },
    { path: '../../../public/fonts/Tajawal_arabic_500.woff2', weight: '500', style: 'normal' }
  ],
  variable: '--font-sans-ar'
});

export const metadata: Metadata = {
  metadataBase: new URL('https://rosesilvers.com'),
  title: {
    default: 'Rose Silvers — Premium Sterling Silver Jewelry',
    template: '%s | Rose Silvers',
  },
  description: 'Discover elegant sterling silver jewelry. Rings, necklaces, bracelets, and earrings crafted with precision and passion.',
  keywords: ['silver jewelry', 'sterling silver', 'rings', 'necklaces', 'bracelets', 'earrings', 'premium jewelry', 'Egyptian jewelry'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'ar_EG',
    siteName: 'Rose Silvers',
    images: [{ url: '/images/og-default.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
 
  const messages = await getMessages();

  const isAr = locale === 'ar';
  const serifVar = isAr ? amiri.variable : playfair.variable;
  const sansVar = isAr ? tajawal.variable : inter.variable;

  return (
    <html lang={locale} dir={isAr ? 'rtl' : 'ltr'} suppressHydrationWarning={true}>
      <body className={`${serifVar} ${sansVar}`} style={{ '--font-serif': `var(${serifVar})`, '--font-sans': `var(${sansVar})` } as React.CSSProperties} suppressHydrationWarning={true}>
        <NextIntlClientProvider messages={messages}>
          <CartProvider>
            <WishlistProvider>
              <AIChooserProvider>
                <Header />
                <main>{children}</main>
                <Footer />
                <CartDrawer />
                <FloatingContact />
                <AIChooserDrawer />
                <AIChooserLauncher />
                <WelcomePromptModal />
              </AIChooserProvider>
            </WishlistProvider>
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
