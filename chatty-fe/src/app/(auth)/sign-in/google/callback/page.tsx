'use client';

import { postGoogleLogin } from '@/app/_api/auth';
import useAuthStore from '@/app/_store/useAuthStore';
import { useRouter, useSearchParams } from 'next/navigation';

import React, { Suspense, useEffect } from 'react';

function GoogleLoginComponent() {
  const searchParams = useSearchParams();
  const authCode = searchParams.get('code');
  const { setTokens } = useAuthStore();
  const router = useRouter();

  const handleLogin = async (authCode: string) => {
    const response = await postGoogleLogin(authCode);
    const { accessToken, refreshToken } = response;
    setTokens(accessToken, refreshToken);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    router.push('/main-lobby');
  };

  useEffect(() => {
    if (authCode) handleLogin(authCode);
  });

  return <div>로그인 중입니다..</div>;
}

export default function GoogleLogin() {
  return (
    <Suspense>
      <GoogleLoginComponent />
    </Suspense>
  );
}
