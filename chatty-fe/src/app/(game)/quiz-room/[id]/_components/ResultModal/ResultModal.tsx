import React from 'react';
import * as styles from './ResultModal.css';
import useUserInfoStore from '@/app/_store/useUserInfoStore';
import Image from 'next/image';

type ResultModalProps = {
  currentRound: number;
  users: Users[];
};

type Users = {
  id: number;
  nickname: string;
  score: number;
};

export default function ResultModal({ currentRound, users }: ResultModalProps) {
  const { id } = useUserInfoStore();
  const calcRanking = (users: ResultModalProps['users']) => {
    return users.sort((a, b) => b.score - a.score);
  };

  const chunkedUsers = (users: ResultModalProps['users'], size: number) => {
    const chunks = [];
    for (let i = 0; i < users.length; i += size) {
      chunks.push(users.slice(i, i + size));
    }
    return chunks;
  };

  const rankedUsers = calcRanking(users);

  return (
    <div className={styles.ModalBackground}>
      <div className={styles.Modal}>
        <div className={styles.Title}>{currentRound}라운드 등수</div>
        <div className={styles.ResultBox}>
          {chunkedUsers(rankedUsers, 5).map((userGroup, groupIndex) => (
            <div key={groupIndex} className={styles.RankingBox}>
              {userGroup.map((user, index) => (
                <div
                  key={user.id}
                  className={
                    user.id === id
                      ? styles.MyRankingContents
                      : styles.RankingContents
                  }
                >
                  {rankedUsers.indexOf(user) === 0 ? (
                    <>
                      <div className={styles.RankingNumberWrapper}>
                        <Image
                          src="/images/1st_place.svg"
                          alt="1st_place"
                          width={18}
                          height={22}
                        />
                      </div>
                      <span className={styles.NickNameArea}>
                        {user.nickname}
                      </span>
                      <span className={styles.ScoreArea}>{user.score}점</span>
                    </>
                  ) : rankedUsers.indexOf(user) === 1 ? (
                    <>
                      <div className={styles.RankingNumberWrapper}>
                        <Image
                          src="/images/2nd_place.svg"
                          alt="2nd_place"
                          width={18}
                          height={22}
                        />
                      </div>
                      <span className={styles.NickNameArea}>
                        {user.nickname}
                      </span>
                      <span className={styles.ScoreArea}>{user.score}점</span>
                    </>
                  ) : rankedUsers.indexOf(user) === 2 ? (
                    <>
                      <div className={styles.RankingNumberWrapper}>
                        <Image
                          src="/images/3rd_place.svg"
                          alt="3rd_place"
                          width={18}
                          height={22}
                        />
                      </div>
                      <span className={styles.NickNameArea}>
                        {user.nickname}
                      </span>
                      <span className={styles.ScoreArea}>{user.score}점</span>
                    </>
                  ) : (
                    <>
                      <div className={styles.RankingNumberWrapper}>
                        <span className={styles.RankingNumber}>
                          {rankedUsers.indexOf(user) + 1}
                        </span>
                      </div>
                      <span className={styles.NickNameArea}>
                        {user.nickname}
                      </span>
                      <span className={styles.ScoreArea}>{user.score}점</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        <button className={styles.Button}>
          <span className={styles.ButtonText}>다음 라운드 까지 </span>
          <span className={styles.CountText}>10초</span>
        </button>
      </div>
    </div>
  );
}
