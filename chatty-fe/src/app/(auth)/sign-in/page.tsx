'use client';
import React, { Suspense, useEffect, useState } from 'react';
import * as styles from './page.css';
import Image from 'next/image';
import TextInputField from '@/app/_components/TextInputField';
import SolidButton from '@/app/_components/SolidButton';
import Link from 'next/link';
import Script from 'next/script';
import {
  googleLogin,
  kakaoInit,
  kakaoLogin,
  setAuthTokenCookie,
} from '@/app/_lib/auth';
import { postSignIn } from '@/app/_api/auth';
import useAuthStore from '@/app/_store/useAuthStore';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setAuth } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get('message');

  const handleKakaoLogin = () => {
    kakaoLogin('http://localhost:3000/sign-in/kakao/callback');
  };

  const handleGoogleLogin = () => {
    googleLogin('http://localhost:3000/sign-in/google/callback');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await postSignIn({ email: email, password: password });
    const { accessToken, refreshToken } = response;
    setAuth(accessToken);
    setAuthTokenCookie(refreshToken);

    router.push('/main-lobby');
  };

  useEffect(() => {
    if (message) {
      alert(message);
    }
  }, []);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.container}>
        <div className={styles.imageBox}>
          <Image
            src="/images/logo.svg"
            width={360}
            height={167}
            alt="logo"
            priority
          />
        </div>
        <form className={styles.formWrapper} onSubmit={handleSubmit}>
          <div className={styles.inputFieldWrapper}>
            <TextInputField
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              borderRadius={12}
              autoComplete="email"
            />
          </div>
          <div className={styles.inputFieldWrapper}>
            <TextInputField
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              borderRadius={12}
              autoComplete="current-password"
            />
          </div>
          <div className={styles.buttonWrapper}>
            <SolidButton fullWidth={true}>로그인</SolidButton>
          </div>
        </form>

        <p>
          아직 회원이 아니신가요?{' '}
          <Link className={styles.link} href="/sign-up">
            회원가입
          </Link>
        </p>
        <div className={styles.orContainer}>
          <div className={styles.line}></div>
          <div className={styles.orText}>or</div>
          <div className={styles.line}></div>
        </div>
        <div className={styles.socialWrapper}>
          <button className={styles.socialButton} onClick={handleKakaoLogin}>
            <Image
              src="/images/kakao_button.svg"
              width={172}
              height={40}
              alt="kakobutton"
            />
          </button>
          <button className={styles.socialButton} onClick={handleGoogleLogin}>
            <Image
              src="/images/google_button.svg"
              width={172}
              height={40}
              alt="googlebutton"
            />
          </button>
        </div>
      </div>
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.0/kakao.min.js"
        integrity="sha384-l+xbElFSnPZ2rOaPrU//2FF5B4LB8FiX5q4fXYTlfcG4PGpMkE1vcL7kNXI6Cci0"
        crossOrigin="anonymous"
        onLoad={() => kakaoInit()}
        strategy="lazyOnload"
      />
    </div>
  );
}
