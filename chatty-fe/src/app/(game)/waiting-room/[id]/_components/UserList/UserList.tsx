'use client';

import { useEffect, useState } from 'react';
import UserCard from '../UserCard/UserCard';
import * as styles from './UserList.css';
import useWaitingStore from '@/app/_store/useWaitingStore';
import { UserStatus } from '@/app/_types/WaitingStatus';

const UserList = ({ isQuizReady }: { isQuizReady: boolean }) => {
  const { userStatuses } = useWaitingStore();

  const [botStatus, setBotStatus] = useState<UserStatus>({
    userId: -1,
    isReady: isQuizReady,
    nickname: '문제 생성 확인 봇',
  });

  useEffect(() => {
    if (isQuizReady) {
      setBotStatus({
        userId: -1,
        isReady: isQuizReady,
        message: '나도 준비 완료!',
        nickname: '문제 생성 확인 봇',
      });
    }
  }, [isQuizReady]);

  return (
    <div className={styles.mainContainer}>
      {/* 문제 생성 확인 봇 */}
      <UserCard userStatus={botStatus} />
      {userStatuses &&
        userStatuses.map(
          (user) =>
            user.userId && <UserCard key={user.userId} userStatus={user} />,
        )}
    </div>
  );
};

export default UserList;
