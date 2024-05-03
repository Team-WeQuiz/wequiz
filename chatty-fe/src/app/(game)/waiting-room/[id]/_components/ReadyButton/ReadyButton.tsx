'use client';

import GradButton from '@/app/_components/GradButton';
import { useEffect, useState } from 'react';
import useWaitingStore from '@/app/_store/useWaitingStore';
import { UserStatus } from '@/app/_types/WaitingStatus';
import stompClient from '../../../../_utils/stomp';
import * as styles from './ReadyButton.css';
import { useRouter } from 'next/navigation';
import { startQuiz } from '@/app/_api/quiz';

const ReadyButton = ({
  roomId,
  userId,
  isQuizReady,
  accessToken,
}: {
  roomId: number;
  userId: number | undefined;
  isQuizReady: boolean;
  accessToken: string;
}) => {
  const { userStatuses, allUsersReady } = useWaitingStore();
  const [isReady, setIsReady] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(3);
  const router = useRouter();
  const [toggleBlock, setToggleBlock] = useState<boolean>(false);

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

  useEffect(() => {
    setCountdown(3);
    let timer: NodeJS.Timeout | null = null;
    if (isQuizReady && allUsersReady) {
      timer = setInterval(() => {
        setCountdown((prevCount) => {
          const nextCount = prevCount - 1;
          if (nextCount === 0) {
            setToggleBlock(true);
            startQuiz(roomId, accessToken);
          }
          if (nextCount === -1) {
            clearInterval(timer!);
            router.push(`/quiz-room/${roomId}`);
          }
          return nextCount;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isQuizReady, allUsersReady]);

  return (
    <div className={styles.readyContainer}>
      {isReady &&
        (isQuizReady && allUsersReady ? (
          <span className={styles.readyStatus}>
            {countdown > 0 ? countdown : '퀴즈 시작 !'}
          </span>
        ) : (
          <span className={`${styles.readyStatus} ${styles.blinking}`}>
            waiting
          </span>
        ))}
      <GradButton
        color="secondary"
        fullWidth
        rounded
        onClick={toggleReady}
        disabled={toggleBlock}
      >
        <span className={`${styles.buttonText} ${!isReady && styles.blinking}`}>
          {isReady ? '준비취소' : '준비하기'}
        </span>
      </GradButton>
    </div>
  );
};

export default ReadyButton;
