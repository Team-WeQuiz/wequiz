'use client';

import { useState } from 'react';
import * as styles from './Header.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import DropdownMenu from '../DropDownMenu/DropdownMenu';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useRouter();
  const handleLogoClick = () => {
    navigate.push('/main-lobby');
  };
  const handleProfileClick = (e: MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <header className={styles.container}>
      <button onClick={handleLogoClick}>
        <Image src="/images/logo.svg" height={52} width={112} alt="logo" />
      </button>
      <div className={styles.profileButton}>
        <button onClick={(e) => handleProfileClick}>
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
              <button onClick={() => {}} className={styles.menuButton}>
                로그아웃
              </button>
            </li>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
