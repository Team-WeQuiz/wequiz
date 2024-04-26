'use client';
import React from 'react';
import * as styles from './Header.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Header() {
  const navigate = useRouter();
  const handleLogoClick = () => {
    navigate.push('/main-lobby');
  };
  const handleProfileClick = () => {
    navigate.push('/mypage');
  };
  return (
    <header className={styles.container}>
      <button onClick={handleLogoClick}>
        <Image src="/images/logo.svg" height={52} width={112} alt="logo" />
      </button>
      <button onClick={handleProfileClick}>
        <Image src="/images/person.svg" height={48} width={48} alt="profile" />
      </button>
    </header>
  );
}
