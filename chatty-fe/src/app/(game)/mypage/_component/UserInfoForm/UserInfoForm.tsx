'use client';

import { useState, useEffect } from 'react';
import ProfileEditor from '../ProfileEditor/ProfileEditor';
import * as styles from './UserInfoForm.css';
import TextInputField from '@/app/_components/TextInputField';
import SolidButton from '@/app/_components/SolidButton';

type UserInfo = {
  profile: string;
  email: string;
};

const UserInfoForm = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    profile: '',
    email: 'abc@gmail.com',
  });

  const [originalPassword, setOriginalPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
  const [isPasswordMismatch, setIsPasswordMismatch] = useState(false);
  const [hasPasswordCheckStarted, setHasPasswordCheckStarted] = useState(false);

  useEffect(() => {
    if (hasPasswordCheckStarted) {
      setIsPasswordMismatch(newPassword !== confirmNewPassword);
    }
  }, [newPassword, confirmNewPassword, hasPasswordCheckStarted]);

  const handlePasswordCheckChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setHasPasswordCheckStarted(true);
    setConfirmNewPassword(e.target.value);
  };

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 비밀번호 변경 요청
  };

  return (
    <div className={styles.infoContainer}>
      <ProfileEditor profile={userInfo.profile} />
      <div className={styles.infoWrapper}>
        <h2>이메일</h2>
        <TextInputField
          type="email"
          value={userInfo.email}
          borderRadius={12}
          autoComplete="email"
          disabled
          onChange={() => {}}
        />
      </div>
      <form className={styles.infoWrapper} onSubmit={handlePasswordSubmit}>
        <h2>비밀번호</h2>
        <TextInputField
          type="password"
          placeholder="비밀번호"
          value={originalPassword}
          borderRadius={12}
          autoComplete="password"
          onChange={(e) => setOriginalPassword(e.target.value)}
        />
        <TextInputField
          type="password"
          placeholder="새 비밀번호"
          value={newPassword}
          borderRadius={12}
          autoComplete="new-password"
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <TextInputField
          type="password"
          placeholder="새 비밀번호 확인"
          value={confirmNewPassword}
          borderRadius={12}
          autoComplete="new-password"
          onChange={handlePasswordCheckChange}
        />
        <div className={styles.misMatchMessage}>
          {isPasswordMismatch &&
            hasPasswordCheckStarted &&
            '비밀번호가 맞지 않습니다.'}
        </div>
        <div className={styles.buttonWrapper}>
          <SolidButton type="submit" fullWidth={true}>
            비밀번호 변경
          </SolidButton>
        </div>
      </form>
    </div>
  );
};

export default UserInfoForm;
