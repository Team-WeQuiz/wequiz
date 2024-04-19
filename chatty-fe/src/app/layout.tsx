import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import './layout.css';

const pretendard = localFont({
  src: '../../public/fonts/PretendardVariable.ttf',
  variable: '--main-font',
});

const bagel = localFont({
  src: '../../public/fonts/BagelFatOne-Regular.ttf',
  variable: '--bagel-font',
  weight: '400',
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
      <body className={`${pretendard.variable} ${bagel.variable}`}>
        {children}
        <div id="modal-root" />
      </body>
    </html>
  );
}
