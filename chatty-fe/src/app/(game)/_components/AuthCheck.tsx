'use client';
import React, { ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';
import useAuthStore from '@/app/_store/useAuthStore';
import { postRefreshToken } from '@/app/_api/auth';
import { useSearchParams } from 'next/navigation';

type AuthCheckProps = {
  children?: ReactNode;
};

export default function AuthCheck({ children }: AuthCheckProps) {
  const { accessToken, setAuth } = useAuthStore();
  const searchParams = useSearchParams();
  const message = searchParams.get('message');

  const setAccessToken = async () => {
    const refreshToken = Cookies.get('refreshToken');
    if (refreshToken) {
      try {
        const data = await postRefreshToken(refreshToken);
        setAuth(data.accessToken);
        Cookies.set('refreshToken', data.refreshToken);
      } catch (error) {
        console.error('error: ', error);
      }
    }
  };

  useEffect(() => {
    if (message) {
      alert(message);
    }
    if (Cookies.get('refreshToken') && accessToken === '') {
      setAccessToken();
    }
  }, []);

  return <>{children}</>;
}
