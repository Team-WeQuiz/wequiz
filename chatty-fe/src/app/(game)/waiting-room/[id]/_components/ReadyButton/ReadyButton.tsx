'use client';

import GradButton from '@/app/_components/GradButton';
import { useEffect, useState } from 'react';
import useWaitingStore from '@/app/_store/useWaitingStore';
import { UserStatus } from '@/app/_types/WaitingStatus';
import stompClient from '../../_utils/stomp';
import * as styles from './ReadyButton.css';

const ReadyButton = ({
  roomId,
  userId,
}: {
  roomId: number;
  userId: number | undefined;
}) => {
  const { userStatuses } = useWaitingStore();
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    setIsReady(
      userStatuses.find((user: UserStatus) => user.userId === userId)
        ?.isReady || false,
    );
  }, [userStatuses]);

  const toggleReady = () => {
    stompClient.publish({
      destination: `/pub/rooms/${roomId}/ready`,
    });
  };

  return (
    <div className={styles.readyContainer}>
      {isReady && (
        <span className={`${styles.readyStatus} ${styles.blinking}`}>
          waiting
        </span>
      )}
      <GradButton color="secondary" fullWidth rounded onClick={toggleReady}>
        <span className={`${styles.buttonText} ${!isReady && styles.blinking}`}>
          {isReady ? '준비취소' : '준비하기'}
        </span>
      </GradButton>
    </div>
  );
};

export default ReadyButton;
