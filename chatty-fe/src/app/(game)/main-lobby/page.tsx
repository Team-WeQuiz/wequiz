'use client';

import { Suspense, useState } from 'react';
import * as styles from './page.css';
import TextInputField from '@/app/_components/TextInputField';
import SolidButton from '@/app/_components/SolidButton';
import GradButton from '@/app/_components/GradButton';
import GameListGrid from './_components/GameListGrid/GameListGrid';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import CodeInput from './_components/CodeInput/CodeInput';

const MainLobby = () => {
  const router = useRouter();
  const [code, setCode] = useState('');

  return (
    <Suspense>
      <div className={styles.lobbyContainer}>
        <div className={styles.centerContainer}>
          <div className={styles.toolBar}>
            <div className={styles.codeInput}>
              <CodeInput />
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
    </Suspense>
  );
};

export default MainLobby;
