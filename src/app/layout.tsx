import { APP_DESCRIPTION, APP_NAME } from '@/lib/common/ui-constants';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter } from 'next/font/google';
import { headers } from 'next/headers';
import { AppThemeProvider } from 'venky-core/ui';

import './globals.css';
import { init } from '../lib/server/init/init';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: APP_NAME,
    description: APP_DESCRIPTION,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get('x-nonce');
  await init();

  return (
    <AppThemeProvider nonce={nonce ?? undefined} className={cn(inter.variable, geistSans.variable, geistMono.variable)}>
      {children}
    </AppThemeProvider>
  );
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
