'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import * as styles from './page.css';
import Sparkles from './_components/Sparkles/Sparkles';
import GradButton from './_components/GradButton';
import Cookies from 'js-cookie';
import useBgmStore from './_store/useBgmStore';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [isLogin, setIsLogin] = useState(false);
  const router = useRouter();
  const { setIsPlaying } = useBgmStore();
  const handleStart = () => {
    setIsPlaying(true);
    if (isLogin) {
      router.push('/main-lobby');
    } else {
      router.push('/sign-in');
    }
  };
  useEffect(() => {
    const token = Cookies.get('refreshToken');
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
            <GradButton onClick={handleStart} rounded fullWidth>
              <div className={styles.buttonText}>시작!</div>
            </GradButton>
          </div>
        </div>
      </div>
    </div>
  );
}
