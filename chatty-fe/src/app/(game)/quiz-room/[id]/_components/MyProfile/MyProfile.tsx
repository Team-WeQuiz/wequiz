import React from 'react';
import * as styles from './MyProfile.css';
import Image from 'next/image';

export default function MyProfile() {
  return (
    <div className={styles.MyContainer}>
      <Image src="/images/profile.svg" alt="profile" width={180} height={180} />
      <div className={styles.MyNickname}>
        <span>나의 닉네임</span>
      </div>
      <div className={styles.EmojiContainer}>
        <div className={styles.EmojiWrapper}>
          <span>🙂</span>
        </div>
        <div className={styles.EmojiWrapper}>
          <span>😍</span>
        </div>
        <div className={styles.EmojiWrapper}>
          <span>🤩</span>
        </div>
        <div className={styles.EmojiWrapper}>
          <span>😡</span>
        </div>
        <div className={styles.EmojiWrapper}>
          <span>😭</span>
        </div>
      </div>
    </div>
  );
}
