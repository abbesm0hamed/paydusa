import { cn } from '@repo/design-system/lib/utils';
import { Space_Grotesk, Mulish } from 'next/font/google';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import localFont from 'next/font/local';

export const geist = cn(
  GeistSans.variable,
  GeistMono.variable,
  'touch-manipulation font-sans antialiased'
);

export const mulish = Mulish({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mulish',
});

export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

// Import Bytesized locally
export const bytesized = localFont({
  src: '../fonts/Bytesized-Regular.ttf',
  variable: '--font-bytesized',
});
