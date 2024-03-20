'use client';

import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';

import React, { Suspense, useEffect, useState } from 'react';

function KakaoLoginComponent() {
  const searchParams = useSearchParams();
  const authCode = searchParams.get('code');
  const kakaoServerError = searchParams.get('error');
  const [isFetched, setIsFetched] = useState(false);
  const [data, setData] = useState({ token: '', refreshToken: '' });
  const router = useRouter();

  const loginHandler = async (code: string | string[]) => {
    try {
      const response = await axios.post(
        'http://localhost:8080/api/oauth/kakao/signIn',
        {
          code: code,
        },
      );
      setIsFetched(true);
      setData({
        token: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      });
      router.push('/main-lobby');
      console.log(response);
    } catch (error) {
      console.error('error: ', error);
    }
  };

  useEffect(() => {
    if (authCode) {
      loginHandler(authCode);
    } else if (kakaoServerError) {
      console.log(kakaoServerError);
    }
  });

  useEffect(() => {
    if (data.token && data.refreshToken) {
      localStorage.setItem('accessToken', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
    }
  }, [data]);

  if (isFetched) {
    return (
      <div>
        <h1>로그인 성공</h1>
        <h2>token: ${data.token}</h2>
        <h2>refreshToken: ${data.refreshToken}</h2>
      </div>
    );
  }

  return <div>로그인 중입니다..</div>;
}

export default function KakaoLogin() {
  return (
    <Suspense>
      <KakaoLoginComponent />
    </Suspense>
  );
}
