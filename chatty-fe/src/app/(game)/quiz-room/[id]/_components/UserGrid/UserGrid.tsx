import React, { useEffect, useState, useRef } from 'react';
import * as styles from './UserGrid.css';
import Image from 'next/image';
import useUserInfoStore from '@/app/_store/useUserInfoStore';

type SubmitStatus = {
  userId: number;
  nickname: string;
  profileImage: string | null;
  isSolved: boolean;
};

type UserGridProps = {
  submitStatus: SubmitStatus[];
};

export default function UserGrid({ submitStatus }: UserGridProps) {
  const { id: userId } = useUserInfoStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        setContainerWidth(containerWidth);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    console.log('submitStatus:', submitStatus);
    console.log('userId:', userId, typeof userId);
    const foundUser = submitStatus.find((status) => status.userId === userId);
    console.log('Found User:', foundUser);
  }, [submitStatus, userId]);

  return (
    <div className={styles.UserContainer} ref={containerRef}>
      <div className={styles.MyContainer}>
        <div
          className={
            submitStatus.find((status) => status.userId === userId)?.isSolved
              ? styles.SolvedMyImage
              : styles.MyImage
          }
          style={{ width: containerWidth - 80, height: containerWidth - 80 }}
        >
          <Image
            src={
              submitStatus.find((status) => status.userId === userId)
                ?.profileImage || '/images/Empty_profile.svg'
            }
            alt="profile"
            width={80}
            height={80}
            style={{ width: '100%', height: '100%' }}
          />
        </div>

        <div>
          <span className={styles.MyNickname}>
            {submitStatus.find((status) => status.userId === userId)?.nickname}
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
              <div
                className={
                  status.isSolved ? styles.SolvedUserImage : styles.UserImage
                }
                style={{
                  width: (containerWidth - 75) / 3,
                  height: (containerWidth - 75) / 3,
                }}
              >
                <Image
                  src={status.profileImage || '/images/Empty_profile.svg'}
                  alt="profile"
                  width={10}
                  height={10}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
              <div className={styles.UserNickname}>{status.nickname}</div>
            </div>
          ) : null,
        )}
      </div>
    </div>
  );
}
