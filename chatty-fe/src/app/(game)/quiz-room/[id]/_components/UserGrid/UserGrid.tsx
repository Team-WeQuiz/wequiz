import React, { useEffect, useState } from 'react';
import * as styles from './UserGrid.css';
import Image from 'next/image';
import useUserInfoStore from '@/app/_store/useUserInfoStore';

type SubmitStatus = {
  userId: number;
  nickname: string;
  profileImage: string;
  isSolved: boolean;
};

type UserGridProps = {
  submitStatus: SubmitStatus[];
};

export default function UserGrid({ submitStatus }: UserGridProps) {
  const { id: userId } = useUserInfoStore();

  useEffect(() => {
    console.log('submitStatus:', submitStatus);
    console.log('userId:', userId, typeof userId);
    const foundUser = submitStatus.find((status) => status.userId === userId);
    console.log('Found User:', foundUser);
  }, [submitStatus, userId]);

  return (
    <div className={styles.UserContainer}>
      <div className={styles.MyContainer}>
        <div className={styles.MyImage}>
          <Image
            src={
              submitStatus.find((status) => status.userId === userId)
                ?.profileImage || '/images/profile.svg'
            }
            alt="profile"
            width={180}
            height={180}
          />
        </div>

        <div className={styles.MyNickname}>
          <span>
            {submitStatus.find((status) => status.userId === userId)?.nickname}
          </span>
          <span>
            {submitStatus.find((status) => status.userId === userId)?.isSolved
              ? ' 🟢'
              : ' 🔴'}
          </span>
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
      <div className={styles.Container}>
        {submitStatus.map((status, index) =>
          status.userId !== userId ? (
            <div className={styles.UserBox} key={status.userId}>
              <div className={styles.UserImage}>
                <Image
                  src={status.profileImage}
                  alt="profile"
                  width={120}
                  height={120}
                />
              </div>
              <div>{status.nickname}</div>
              <span>{status.isSolved ? '🟢' : '🔴'}</span>
            </div>
          ) : null,
        )}
      </div>
    </div>
  );
}
