import Image from 'next/image';
import * as styles from './QuizInfoCard.css';
import { QuizInfo } from '@/app/_types/QuizInfoType';
import { getQuizInfo } from '@/app/_api/quiz';
import { useState, useEffect } from 'react';
import useAuthStore from '@/app/_store/useAuthStore';

const initialData: QuizInfo = {
  roomId: 0,
  name: '정보를 불러오는 중 입니다.',
  maxPlayers: 0,
  description: '',
  numOfQuiz: 0,
};

const QuizInfoCard = ({
  roomId,
  isSubscribed,
}: {
  roomId: number;
  isSubscribed: boolean;
}) => {
  const [data, setData] = useState<QuizInfo>(initialData);
  const { accessToken } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getQuizInfo(roomId, accessToken);
        setData(response);
      } catch (error) {
        console.error('error: ', error);
        setData({
          roomId: 0,
          name: '정보를 불러오지 못했습니다.',
          maxPlayers: 0,
          description: '',
          numOfQuiz: 0,
        });
      }
    };
    if (accessToken && isSubscribed) {
      fetchData();
    }
  }, [isSubscribed, accessToken]);

  return (
    <div className={styles.infoCard}>
      <div className={styles.header}>
        <Image
          src="/images/DecoIcon.svg"
          alt="quiz"
          width={90}
          height={90}
          className={styles.decoIcon}
        />
        <div className={styles.name}>
          <h3 className={`${styles.textEllipsis} ${styles.nameText}`}>
            {data.name}
          </h3>
        </div>
      </div>
      <div className={styles.description}>
        <p className={styles.textEllipsis}>{data.description}</p>
      </div>
      <div className={styles.detail}>
        <div className={`${styles.detailBlock} ${styles.textEllipsis}`}>
          <div className={styles.detailText}>
            <span>최대&nbsp;</span>
            <span className={styles.numText}>{data.maxPlayers}</span>
            <span>
              명<span className={styles.mobileHidden}>의 참여자와&nbsp;</span>
            </span>
            <span className={styles.numText}> {data.numOfQuiz}</span>
            <span>
              문제<span className={styles.mobileHidden}>를 풉니다</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizInfoCard;
