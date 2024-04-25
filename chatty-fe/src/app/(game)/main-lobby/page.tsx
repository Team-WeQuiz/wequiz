'use client';

import { useState } from 'react';
import * as styles from './page.css';
import TextInputField from '@/app/_components/TextInputField';
import SolidButton from '@/app/_components/SolidButton';
import GradButton from '@/app/_components/GradButton';
import GameListGrid from './_components/GameListGrid/GameListGrid';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const MainLobby = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');

  console.log('MainLobby');

  return (
    <>
      <div className={styles.lobbyContainer}>
        <div className={styles.centerContainer}>
          <div className={styles.toolBar}>
            <div className={styles.searchInput}>
              <TextInputField
                value={search}
                placeholder="검색"
                borderRadius={12}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                endAdornment={
                  <SolidButton shadowExist={false}>
                    <Image
                      src="/images/Search.svg"
                      alt="search"
                      width={24}
                      height={24}
                    />
                  </SolidButton>
                }
              />
            </div>
            <div className={styles.createButton}>
              <GradButton
                color="secondary"
                fullWidth
                onClick={() => router.push('/create-room')}
              >
                <span className={styles.buttonText}>방 만들기</span>
              </GradButton>
            </div>
          </div>
          <GameListGrid />
        </div>
      </div>
    </>
  );
};

export default MainLobby;
