'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import * as styles from './UserCard.css';

const UserCard = ({
  userId,
  message,
}: {
  userId: number;
  message?: string;
}) => {
  const [showMessage, setShowMessage] = useState<boolean>(false);

  useEffect(() => {
    if (message) {
      setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 5000); // 5초 후 메시지 숨김

      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className={styles.cardContainer}>
      <div className={styles.avatar}>
        {message && (
          <div className={styles.chatContainer({ fadeOut: !showMessage })}>
            <div className={styles.chatMessage}>{message}</div>
          </div>
        )}
        <Image
          src="/images/Empty_profile.svg"
          alt="avatar"
          width={192}
          height={192}
          className={styles.profileImage}
        />
      </div>
      <div className={styles.userInfo}>
        <div className={styles.line}></div>
        <div className={styles.userName}>{userId}</div>
        <div className={styles.line}></div>
      </div>
    </div>
  );
};

export default UserCard;
