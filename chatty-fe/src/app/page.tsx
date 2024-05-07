'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import * as styles from './page.css';
import Sparkles from './_components/Sparkles/Sparkles';
import GradButton from './_components/GradButton';
import Link from 'next/link';
import Cookies from 'js-cookie';

export default function Home() {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const token = Cookies.get('refreshToken');
    console.log(token);
    if (token) setIsLogin(true);
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.centerContainer}>
        <div className={styles.glow}></div>
        <div className={styles.mask}>
          <Sparkles />
          <div className={styles.logoWapper}>
            <Image
              src={'/images/logo_main.png'}
              alt={'wequiz_main_logo'}
              layout="fill"
              objectFit="contain"
            />
          </div>
          <div className={styles.buttonWrapper}>
            <Link href={isLogin ? '/main-lobby' : '/sign-in'}>
              <GradButton rounded fullWidth>
                <div className={styles.buttonText}>시작!</div>
              </GradButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
