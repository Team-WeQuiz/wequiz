import React from 'react';
import * as styles from './UserGrid.css';
import Image from 'next/image';

type UserGridProps = {
  userCount: number;
};

export default function UserGrid({ userCount }: UserGridProps) {
  return (
    <div className={styles.Container}>
      {Array.from({ length: userCount }, (_, index) => (
        <div className={styles.UserBox} key={index}>
          <div className={styles.UserImage}>
            <Image
              src="/images/profile.svg"
              alt="profile"
              width={120}
              height={120}
            />
          </div>
          <div>{`유저 ${index + 1}`}</div>
        </div>
      ))}
    </div>
  );
}
