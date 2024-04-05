import Image from 'next/image';
import * as styles from './QuizInfoCard.css';
import { getQuizInfo } from '@/app/_api/quiz';
import { useState, useEffect } from 'react';

type QuizInfo = {
  roomId: number;
  name: string;
  timeLimit: number;
  playerLimitNums: number;
  description: string;
};

const initialData: QuizInfo = {
  roomId: 0,
  name: '',
  timeLimit: 0,
  playerLimitNums: 0,
  description: '',
};

const QuizInfoCard = ({ roomId }: { roomId: number }) => {
  const [data, setData] = useState<QuizInfo>(initialData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getQuizInfo(roomId);
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
