'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import * as styles from './UserCard.css';
import { UserStatus } from '@/app/_types/WaitingStatus';

const UserCard = ({ userStatus }: { userStatus: UserStatus }) => {
  const [showMessage, setShowMessage] = useState<boolean>(false);

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
      <div className={styles.avatar}>
        {userStatus.message && (
          <div className={styles.chatContainer({ fadeOut: !showMessage })}>
            <div className={styles.chatMessage}>{userStatus.message}</div>
          </div>
        )}
        <div className={styles.profileImage}>
          <Image
            src="/images/Empty_profile.svg"
            alt="avatar"
            layout="fill"
            objectFit="contain"
            className={styles.profileImage}
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
