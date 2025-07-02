// lib/fonts.ts
import { Quicksand, Dancing_Script } from 'next/font/google';

export const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-quicksand',
});

export const dancingScript = Dancing_Script({
  subsets: ['latin'],
  weight: ['600'],
  variable: '--font-dancing-script',
});
