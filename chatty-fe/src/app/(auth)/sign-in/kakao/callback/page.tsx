'use client';

import { authHandler } from '@/app/_lib/auth';
import { useSearchParams } from 'next/navigation';

import React, { Suspense, useEffect } from 'react';

function KakaoLoginComponent() {
  const searchParams = useSearchParams();
  const authCode = searchParams.get('code');
  const kakaoServerError = searchParams.get('error');

  const handleSubmit = async (code: string | string[]) => {
    authHandler({ code: code }, 'http://localhost:8080/api/oauth/kakao/signIn');
  };

  useEffect(() => {
    if (authCode) {
      handleSubmit(authCode);
    } else if (kakaoServerError) {
      console.log(kakaoServerError);
    }
  });

  return <div>로그인 중입니다..</div>;
}

export default function KakaoLogin() {
  return (
    <Suspense>
      <KakaoLoginComponent />
    </Suspense>
  );
}
