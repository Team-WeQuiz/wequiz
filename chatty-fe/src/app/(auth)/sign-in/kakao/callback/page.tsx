'use client';

import { postKakaoLogin } from '@/app/_api/auth';
import { setAuthTokenCookie } from '@/app/_lib/auth';
import useAuthStore from '@/app/_store/useAuthStore';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

import React, { Suspense, useEffect } from 'react';

import * as styles from './page.css';

function KakaoLoginComponent() {
  const searchParams = useSearchParams();
  const authCode = searchParams.get('code');
  const kakaoServerError = searchParams.get('error');
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const handleLogin = async (authCode: string) => {
    const response = await postKakaoLogin(authCode);
    const { accessToken, refreshToken } = response;
    setAuth(accessToken);
    setAuthTokenCookie(refreshToken);

    router.push('/main-lobby');
  };

  useEffect(() => {
    if (authCode) {
      handleLogin(authCode);
    } else if (kakaoServerError) {
      console.error(kakaoServerError);
    }
  }, []);

  return (
    <div className={styles.Container}>
      <Image src="/images/logo.svg" width={400} height={400} alt="logo" />
      <span className={styles.Description}>로그인 중입니다 !</span>
    </div>
  );
}

export default function KakaoLogin() {
  return (
    <Suspense>
      <KakaoLoginComponent />
    </Suspense>
  );
}
