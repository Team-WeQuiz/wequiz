'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import * as styles from './UserCard.css';
import { UserStatus } from '@/app/_types/WaitingStatus';

const UserCard = ({
  userStatus,
  cardWidth,
  cardHeight,
}: {
  userStatus: UserStatus;
  cardWidth: number;
  cardHeight: number;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [profileSize, setProfileSize] = useState<number>(20);

  useEffect(() => {
    // console.log('cardHeight', cardHeight);
    if (cardHeight > 350) {
      setProfileSize(350 * 0.54);
    } else if (cardHeight < 150) {
      // console.log('profileSize', cardHeight * 0.4);
      setProfileSize(cardHeight * 0.4);
    } else setProfileSize(cardHeight * 0.54);
  }, [cardHeight]);

  useEffect(() => {
    if (userStatus.message) {
      setShowMessage(true);
      // 봇 메시지는 숨기지 않음
      if (userStatus.userId > 0) {
        const timer = setTimeout(() => {
          setShowMessage(false);
        }, 5000); // 5초 후 메시지 숨김

        return () => clearTimeout(timer);
      }
    }
  }, [userStatus.message]);

  return (
    <div
      className={`${styles.cardContainer} ${userStatus.isReady && styles.readyContainer}`}
    >
      <div className={styles.avatar} ref={cardRef}>
        <div className={styles.profileImage}>
          {userStatus.message && (
            <div className={styles.chatContainer({ fadeOut: !showMessage })}>
              <div className={styles.chatMessage}>{userStatus.message}</div>
            </div>
          )}
          <Image
            src={userStatus.profileImage || `/images/Empty_profile.svg`}
            alt="avatar"
            width={profileSize || 4}
            height={profileSize || 4}
            style={{
              borderRadius: '50%',
              border: '2px solid #fff',
              objectFit: 'cover',
            }}
          />
        </div>
      </div>
      <div className={styles.userInfo}>
        <div className={styles.line}></div>
        <div className={styles.userName}>{userStatus.nickname}</div>
        <div className={styles.line}></div>
      </div>
    </div>
  );
};

export default UserCard;
