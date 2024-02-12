'use client';
import React from 'react';
import * as styles from './styles/header.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Header() {
  const navigate = useRouter();
  const handleOnClick = () => {
    navigate.push('/select-subject');
  };
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Image src="/images/chatty.svg" alt="logo" width={132} height={40} />
      </div>
      <div className={styles.wrapper}>
        <Image src="/images/profile.svg" alt="profile" width={36} height={36} />
        <button className={styles.startButton} onClick={handleOnClick}>
          무료로 시작
        </button>
      </div>
    </header>
  );
}
