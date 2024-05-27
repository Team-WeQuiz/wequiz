import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import './layout.css';
import { Suspense } from 'react';
import BgmComponent from './_components/BgmComponent/BgmComponent';
import { GoogleAnalytics } from '@next/third-parties/google';

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
  title: 'WeQuiz',
  description:
    'Wequiz is a service that allows you to create quizzes using ai and solve them like a game in real time with your friends.',

  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${pretendard.variable} ${bagel.variable}`}>
        <div id="main-layout">
          <BgmComponent />
          <Suspense>
            <div id="root">{children}</div>
            <div id="modal-root" />
          </Suspense>
        </div>
      </body>
      {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID ? (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID} />
      ) : null}
    </html>
  );
}
