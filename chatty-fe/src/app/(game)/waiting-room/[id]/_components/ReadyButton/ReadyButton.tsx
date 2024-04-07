'use client';

import GradButton from '@/app/_components/GradButton';
import { useEffect, useState } from 'react';
import useWaitingStore from '@/app/_store/useWaitingStore';
import { UserStatus } from '@/app/_types/WaitingStatus';
import stompClient from '../../_utils/stomp';

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
    <GradButton color="secondary" fullWidth rounded onClick={toggleReady}>
      {isReady ? '시작대기' : '준비하기'}
    </GradButton>
  );
};

export default ReadyButton;
