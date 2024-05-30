'use client';

import React, { useState } from 'react';
import * as styles from './Header.css';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import DropdownMenu from '../DropDownMenu/DropdownMenu';
import Cookies from 'js-cookie';
import useAuthStore from '@/app/_store/useAuthStore';
import useUserInfoStore from '@/app/_store/useUserInfoStore';
import useBgmStore from '@/app/_store/useBgmStore';
import useModal from '@/app/_hooks/useModal';

export default function Header() {
  const pathName = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [createRoomVisibility, setCreateRoomVisibility] = useState(false);
  const [playVisibility, setPlayVisibility] = useState(false);
  const [resultVisibility, setResultVisibility] = useState(false);
  const navigate = useRouter();
  const { Modal, isOpen, openModal, closeModal } = useModal();

  const handleCreateVisibility = () => {
    setCreateRoomVisibility(!createRoomVisibility);
    setPlayVisibility(false);
    setResultVisibility(false);
  };

  const handlePlayVisibility = () => {
    setPlayVisibility(!playVisibility);
    setCreateRoomVisibility(false);
    setResultVisibility(false);
  };

  const handleResultVisibility = () => {
    setResultVisibility(!resultVisibility);
    setCreateRoomVisibility(false);
    setPlayVisibility(false);
  };

  const { deleteTokens } = useAuthStore();
  const { profileImage, deleteUserInfo } = useUserInfoStore();
  const { isPlaying, setIsPlaying } = useBgmStore();

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

      <div className={styles.buttonsWrapper}>
        <button className={styles.musicPlayButton} onClick={openModal}>
          <Image
            src="/images/question-solid.svg"
            height={36}
            width={36}
            alt="question"
          />
        </button>
        <button
          className={styles.musicPlayButton}
          onClick={() => setIsPlaying(!isPlaying)}
        >
          <Image
            src={
              isPlaying ? '/images/volume_max.svg' : '/images/volume_mute.svg'
            }
            height={36}
            width={36}
            alt={isPlaying ? 'music_on' : 'music_off'}
          />
        </button>
        {!pathName.includes('/waiting-room') &&
          !pathName.includes('/quiz-room') && (
            <div className={styles.profileButton}>
              <button
                onClick={(e) => handleProfileClick(e)}
                className={styles.mainButton}
              >
                <Image
                  src={profileImage || '/images/person.svg'}
                  height={48}
                  width={48}
                  alt="profile"
                  className={styles.profileImage}
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
                    <button
                      onClick={handleLogout}
                      className={styles.menuButton}
                    >
                      로그아웃
                    </button>
                  </li>
                </DropdownMenu>
              </div>
            </div>
          )}
      </div>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <div className={styles.ModalContainer}>
          <div className={styles.BoxWrapper}>
            <div className={styles.LogoWrapper}>
              <Image
                src="/images/logo.svg"
                height={
                  createRoomVisibility || playVisibility || resultVisibility
                    ? 52
                    : 104
                }
                width={
                  createRoomVisibility || playVisibility || resultVisibility
                    ? 112
                    : 224
                }
                alt="logo"
              />
            </div>
            <div
              className={styles.ContentsBox}
              onClick={handleCreateVisibility}
            >
              <h1>문제 만들기</h1>
            </div>
            <div
              className={styles.ContentsWrapper({
                visible: createRoomVisibility,
              })}
            >
              <div className={styles.ImageWrapper}>
                <Image
                  src="/images/help_1.gif"
                  layout="fill"
                  objectFit="contain"
                  alt="help_1"
                  unoptimized
                />
              </div>
              <div className={styles.ContentsTextWrapper}>
                <p>
                  <span style={{ fontWeight: 700 }}>방 제목</span>,{' '}
                  <span style={{ fontWeight: 700 }}>설명</span>,{' '}
                  <span style={{ fontWeight: 700 }}>인원 수</span>,{' '}
                  <span style={{ fontWeight: 700 }}>문제 수</span>를 설정하세요.
                </p>
                <p>닉네임을 입력하면, 퀴즈 방이 생성됩니다!</p>
              </div>
            </div>
            <div className={styles.ContentsBox} onClick={handlePlayVisibility}>
              <h1>퀴즈 플레이</h1>
            </div>
            <div
              className={styles.ContentsWrapper({
                visible: playVisibility,
              })}
            >
              <div className={styles.ImageWrapper}>
                <Image
                  src="/images/help_2.gif"
                  layout="fill"
                  objectFit="contain"
                  alt="help_2"
                  unoptimized
                />
              </div>
              <div className={styles.ContentsTextWrapper}>
                <p>
                  <span style={{ fontWeight: 700 }}>엔터 키</span> 로도 답을
                  제출할 수 있습니다.
                </p>

                <p>
                  <span style={{ fontWeight: 700 }}>과반수</span> 이상이 답을
                  입력하면 <span style={{ fontWeight: 700 }}>3초</span> 뒤에
                  자동으로 다음 문제로 넘어갑니다!
                </p>
              </div>
            </div>
            <div
              className={styles.ContentsBox}
              onClick={handleResultVisibility}
            >
              <h1>결과 확인</h1>
            </div>
            <div
              className={styles.ContentsWrapper({
                visible: resultVisibility,
              })}
            >
              <div className={styles.ImageWrapper}>
                <Image
                  src="/images/help_3.gif"
                  layout="fill"
                  objectFit="contain"
                  alt="help_3"
                  unoptimized
                />
              </div>
              <div className={styles.ContentsTextWrapper}>
                <p>
                  <span style={{ fontWeight: 700 }}>마이페이지</span> 에서 내가
                  풀었던 퀴즈의 결과를 언제든지 확인할 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </header>
  );
}
