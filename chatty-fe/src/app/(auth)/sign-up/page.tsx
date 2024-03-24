'use client';
import React, { useState, useEffect } from 'react';
import * as styles from './page.css';
import TextInputField from '@/app/_components/TextInputField';
import SolidButton from '@/app/_components/SolidButton';
import { validateEmail, validatePassword } from '@/app/_lib/validation';
import { postSignUp } from '@/app/_api/auth';
import useAuthStore from '@/app/_store/useAuthStore';
import { useRouter } from 'next/navigation';
import { setAuthTokenCookie } from '@/app/_lib/auth';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [isPasswordMismatch, setIsPasswordMismatch] = useState(false);
  const [hasPasswordCheckStarted, setHasPasswordCheckStarted] = useState(false);
  const isEmailValid = validateEmail(email);
  const isPasswordValid = validatePassword(password);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (hasPasswordCheckStarted) {
      setIsPasswordMismatch(password !== passwordCheck);
    }
  }, [password, passwordCheck, hasPasswordCheckStarted]);

  const handlePasswordCheckChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setHasPasswordCheckStarted(true);
    setPasswordCheck(e.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isEmailValid && isPasswordValid && !isPasswordMismatch) {
      const response = await postSignUp({ email: email, password: password });

      const { accessToken, refreshToken } = response;
      setAuth(accessToken, refreshToken);
      setAuthTokenCookie(accessToken, refreshToken);
      router.push('/main-lobby');
    }
  };

  return (
    <div className={styles.mainContainer}>
      <form className={styles.container} onSubmit={handleSubmit}>
        <div className={styles.title}>회원가입</div>
        <div className={styles.inputFieldContainer}>
          <div className={styles.inputFieldWrapper}>
            <TextInputField
              placeholder="이메일"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              borderRadius={12}
              autoComplete="email"
            />
          </div>
          <div className={styles.inputFieldWrapper}>
            <TextInputField
              placeholder="비밀번호"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              borderRadius={12}
              autoComplete="new-password"
            />
          </div>
          <div className={styles.inputFieldWrapper}>
            <TextInputField
              placeholder="비밀번호 재입력"
              type="password"
              value={passwordCheck}
              onChange={handlePasswordCheckChange}
              borderRadius={12}
              autoComplete="new-password"
            />

            <div className={styles.misMatchMessage}>
              {isPasswordMismatch &&
                hasPasswordCheckStarted &&
                '비밀번호가 맞지 않습니다.'}
            </div>
          </div>
        </div>
        <div className={styles.buttonWrapper}>
          <SolidButton
            fullWidth={true}
            type="submit"
            disabled={
              !isEmailValid ||
              !isPasswordValid ||
              isPasswordMismatch ||
              passwordCheck === ''
            }
          >
            OK
          </SolidButton>
        </div>
      </form>
    </div>
  );
}
