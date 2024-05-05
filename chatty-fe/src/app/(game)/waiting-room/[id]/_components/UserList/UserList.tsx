'use client';

import { useEffect, useState, useRef } from 'react';
import UserCard from '../UserCard/UserCard';
import * as styles from './UserList.css';
import useWaitingStore from '@/app/_store/useWaitingStore';
import { UserStatus } from '@/app/_types/WaitingStatus';

const UserList = ({ isQuizReady }: { isQuizReady: boolean }) => {
  const { userStatuses } = useWaitingStore();
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [cardSize, setCardSize] = useState({ width: 0, height: 0 });

  const [botStatus, setBotStatus] = useState<UserStatus>({
    userId: -1,
    isReady: isQuizReady,
    nickname: '문제 생성 확인 봇',
  });

  const calculateCardSize = (
    containerWidth: number,
    containerHeight: number,
    numCards: number,
  ) => {
    const containerRatio = containerWidth / containerHeight;
    const cardRatio = 6 / 7;
    let numRows = 1;
    let numCols = numCards;

    // 가로 길이가 더 긴 경우
    if (containerRatio > cardRatio) {
      numRows = Math.ceil(
        Math.sqrt(numCards * (containerHeight / containerWidth)),
      );
      numCols = Math.ceil(numCards / numRows);
    } else {
      // 세로 길이가 더 긴 경우
      numCols = Math.ceil(
        Math.sqrt(numCards * (containerWidth / containerHeight)),
      );
      numRows = Math.ceil(numCards / numCols);
    }

    const cardWidth = containerWidth / numCols;
    const cardHeight = containerHeight / numRows;

    return {
      width: cardWidth,
      height: cardHeight,
    };
  };

  useEffect(() => {
    const handleResize = () => {
      if (gridContainerRef.current) {
        const containerWidth = gridContainerRef.current.offsetWidth;
        const containerHeight = gridContainerRef.current.offsetHeight;
        setContainerSize({ width: containerWidth, height: containerHeight });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (containerSize.width > 0 && containerSize.height > 0) {
      const calculatedSize = calculateCardSize(
        containerSize.width - 48,
        containerSize.height - 48,
        userStatuses.length + 1,
      );
      setCardSize(calculatedSize);
    }
  }, [containerSize, userStatuses.length]);

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
    <div className={styles.mainContainer} ref={gridContainerRef}>
      {/* 문제 생성 확인 봇 */}
      <div
        style={{ width: cardSize.width, height: cardSize.height }}
        className={styles.cardArea}
      >
        <UserCard userStatus={botStatus} />
      </div>
      {userStatuses &&
        userStatuses.map(
          (user) =>
            user.userId && (
              <div
                key={user.userId}
                style={{ width: cardSize.width, height: cardSize.height }}
                className={styles.cardArea}
              >
                <UserCard userStatus={user} />
              </div>
            ),
        )}
    </div>
  );
};

export default UserList;
