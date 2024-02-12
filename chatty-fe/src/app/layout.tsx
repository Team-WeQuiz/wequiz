import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });
const pretendard = localFont({
  src: '../../public/fonts/PretendardVariable.ttf',
  variable: '--main-font',
});

export const metadata: Metadata = {
  title: 'Chatty',
  description: 'Chatty is an AI chatbot service that helps you study.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={pretendard.variable}>{children}</body>
    </html>
  );
}
