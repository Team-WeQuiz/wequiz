'use client';

import { authHandler } from '@/app/_lib/auth';
import { useSearchParams } from 'next/navigation';

import React, { Suspense, useEffect } from 'react';

function GoogleLoginComponent() {
  const searchParams = useSearchParams();
  const authCode = searchParams.get('code');

  const handleSubmit = async (code: string | string[]) => {
    authHandler(
      { code: code },
      'http://localhost:8080/api/oauth/google/signIn',
    );
  };

  useEffect(() => {
    if (authCode) {
      const decoded = decodeURI(authCode);
      console.log(decoded);
      handleSubmit(decoded);
    }
  });

  return <div>로그인 중입니다..</div>;
}

export default function KakaoLogin() {
  return (
    <Suspense>
      <GoogleLoginComponent />
    </Suspense>
  );
}
