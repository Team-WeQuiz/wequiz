'use client';

import GradButton from '@/app/_components/GradButton';
import { useState } from 'react';
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
  const [isReady] = useState<boolean>(
    userStatuses.find((user: UserStatus) => user.userId === userId)?.isReady ||
      false,
  );

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
