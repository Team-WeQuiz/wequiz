import Image from 'next/image';
import * as styles from './QuizInfoCard.css';
import { getQuizIfo } from '@/app/_api/quiz';
import { useState, useEffect } from 'react';

const tmpData = {
  roomId: 1,
  name: '퀴즈방',
  timeLimit: 60,
  playerLimitNums: 4,
  description: '퀴즈방입니다.',
};

const QuizInfoCard = ({ roomId }: { roomId: number }) => {
  const [data, setData] = useState(tmpData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getQuizIfo(roomId);
        setData(response);
      } catch (error) {
        console.error('error: ', error);
      }
    };

    fetchData();
  }, []);

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
          <h3>{data.name}</h3>
        </div>
      </div>
      <div className={styles.description}>
        <p>{data.description}</p>
      </div>
      <div className={styles.detail}>
        <div className={styles.detailBlock}>
          <span>인원수</span>
          <span>{data.playerLimitNums}</span>
        </div>
        <div className={styles.detailBlock}>
          <span>문제 풀이 시간</span>
          <span>{data.timeLimit}:00</span>
        </div>
      </div>
    </div>
  );
};

export default QuizInfoCard;
