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
    nickname: '퀴즈 생성 AI',
    profileImage:
      isQuizReady === true
        ? '/images/bot_ready.svg'
        : '/images/bot_not_ready.svg',
  });

  const calculateCardSize = (
    containerWidth: number,
    containerHeight: number,
    numCards: number,
  ) => {
    const cardAspectRatio = 6 / 7;
    let numRows = 1;
    let numCols = numCards;

    // 가로 길이가 더 긴 경우
    if (containerWidth / containerHeight > cardAspectRatio) {
      numRows = Math.ceil(
        Math.sqrt(
          numCards * (containerHeight / containerWidth) * cardAspectRatio ** 2,
        ),
      );
      numCols = Math.ceil(numCards / numRows);
    } else {
      // 세로 길이가 더 긴 경우
      numCols = Math.ceil(
        Math.sqrt(
          (numCards * (containerWidth / containerHeight)) /
            cardAspectRatio ** 2,
        ),
      );
      numRows = Math.ceil(numCards / numCols);
    }

    if (numCols < 3) numCols = 3;

    let cardWidth = containerWidth / numCols;
    let cardHeight = cardWidth / cardAspectRatio;

    // 카드의 높이가 컨테이너의 높이를 초과하지 않도록 조정
    if (cardHeight * numRows > containerHeight) {
      cardHeight = containerHeight / numRows;
      cardWidth = cardHeight * cardAspectRatio;
    }

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
        containerSize.width - 49,
        containerSize.height - 49,
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
        nickname: '퀴즈 생성 AI',
        profileImage:
          isQuizReady === true
            ? '/images/bot_ready.svg'
            : '/images/bot_not_ready.svg',
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
        <UserCard
          userStatus={botStatus}
          cardWidth={cardSize.width}
          cardHeight={cardSize.height}
        />
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
                <UserCard
                  userStatus={user}
                  cardWidth={cardSize.width}
                  cardHeight={cardSize.height}
                />
              </div>
            ),
        )}
    </div>
  );
};

export default UserList;
