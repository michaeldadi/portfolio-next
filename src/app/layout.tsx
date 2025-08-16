import './globals.css';

import { Analytics } from '@vercel/analytics/next';
import { Geist, Geist_Mono } from 'next/font/google';

import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Providers from '@/app/providers';
import ScrollToTop from '@/components/ScrollToTop';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Michael Dadi',
  description: 'Portfolio of Michael Dadi, a software engineer',
  openGraph: {
    title: 'Michael Dadi',
    description: 'Portfolio of Michael Dadi, a software engineer',
    url: 'https://michaeldadi.com',
    siteName: 'Michael Dadi',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className='w-full overflow-x-hidden'>
          <ScrollToTop />
          <Providers>{children}</Providers>
          <Analytics />
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
