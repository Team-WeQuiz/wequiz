'use client';

import React, { useState } from 'react';
import * as styles from './Header.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import DropdownMenu from '../DropDownMenu/DropdownMenu';
import Cookies from 'js-cookie';
import useAuthStore from '@/app/_store/useAuthStore';
import useUserInfoStore from '@/app/_store/useUserInfoStore';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useRouter();
  const { deleteTokens } = useAuthStore();
  const { deleteUserInfo } = useUserInfoStore();

  const handleLogoClick = () => {
    navigate.push('/main-lobby');
  };

  const handleProfileClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    deleteUserInfo();
    deleteTokens();
    Cookies.remove('refreshToken');
    navigate.push('/');
  };
  return (
    <header className={styles.container}>
      <button onClick={handleLogoClick} className={styles.mainButton}>
        <Image src="/images/logo.svg" height={52} width={112} alt="logo" />
      </button>
      <div className={styles.profileButton}>
        <button
          onClick={(e) => handleProfileClick(e)}
          className={styles.mainButton}
        >
          <Image
            src="/images/person.svg"
            height={48}
            width={48}
            alt="profile"
          />
        </button>
        <div className={styles.dropdownMenu}>
          <DropdownMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen}>
            <li className={styles.dropdownMenuList}>
              <button
                onClick={() => navigate.push('/mypage')}
                className={styles.menuButton}
              >
                마이페이지
              </button>
            </li>
            <li className={styles.dropdownMenuList}>
              <button onClick={handleLogout} className={styles.menuButton}>
                로그아웃
              </button>
            </li>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
