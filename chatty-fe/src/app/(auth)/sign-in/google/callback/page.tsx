'use client';

import { postGoogleLogin } from '@/app/_api/auth';
import { setAuthTokenCookie } from '@/app/_lib/auth';
import useAuthStore from '@/app/_store/useAuthStore';
import { useRouter, useSearchParams } from 'next/navigation';

import React, { Suspense, useEffect } from 'react';
import * as styles from './page.css';
import Image from 'next/image';

function GoogleLoginComponent() {
  const searchParams = useSearchParams();
  const authCode = searchParams.get('code');
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const handleLogin = async (authCode: string) => {
    try {
      const response = await postGoogleLogin(authCode);
      const { accessToken, refreshToken } = response;
      setAuth(accessToken);
      setAuthTokenCookie(refreshToken);

      router.push('/main-lobby');
    } catch (error: any) {
      alert(error.message);
      router.push('/sign-in');
    }
  };

  useEffect(() => {
    if (authCode) handleLogin(authCode);
  });

  return (
    <div className={styles.Container}>
      <Image src="/images/logo.svg" width={400} height={400} alt="logo" />
      <span className={styles.Description}>로그인 중입니다 !</span>
    </div>
  );
}

export default function GoogleLogin() {
  return (
    <Suspense>
      <GoogleLoginComponent />
    </Suspense>
  );
}
