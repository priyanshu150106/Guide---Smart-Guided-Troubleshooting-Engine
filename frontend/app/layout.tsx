import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], display: 'swap', variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'GUIDE',
  description: 'Smart Guided Troubleshooting Engine',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-full ${inter.variable} ${playfair.variable}`}>
      <body className={`${inter.className} h-full bg-[#78100E] text-[#1C5955] antialiased p-4 sm:p-8`}>
        {children}
      </body>
    </html>
  );
}
