import Image from 'next/image';
import * as styles from './QuizInfoCard.css';
import { QuizInfo } from '@/app/_types/QuizInfoType';
import { getQuizInfo } from '@/app/_api/quiz';
import { useState, useEffect } from 'react';
import useAuthStore from '@/app/_store/useAuthStore';
import { useRouter } from 'next/navigation';
import useWaitingStore from '@/app/_store/useWaitingStore';

const initialData: QuizInfo = {
  roomId: 0,
  name: '정보를 불러오는 중 입니다.',
  maxPlayers: 0,
  description: '',
  numOfQuiz: 0,
  isFull: false,
  code: '',
};

const QuizInfoCard = ({
  roomId,
  isSubscribed,
  setRoomCode,
  isSolo,
  isConnected,
}: {
  roomId: number;
  isSubscribed: boolean;
  setRoomCode: (code: string) => void;
  isSolo: boolean;
  isConnected: boolean;
}) => {
  const [data, setData] = useState<QuizInfo>(initialData);
  const { accessToken } = useAuthStore();
  const router = useRouter();
  const { userStatuses } = useWaitingStore();

  useEffect(() => {
    const fetchData = async () => {
      console.log("소켓 연결~~~~");
      try {
        const response: QuizInfo = await getQuizInfo(roomId, accessToken);
        setData(response);
        setRoomCode(response.code);
        if (userStatuses.length >= response.maxPlayers) {
          alert('방이 다 찼습니다. 로비로 이동합니다.');
          router.push('/main-lobby');
        }
      } catch (error: any) {
        setData({
          roomId: 0,
          name: '정보를 불러오지 못했습니다.',
          maxPlayers: 0,
          description: '',
          numOfQuiz: 0,
          isFull: false,
          code: '',
        });
        if (isSolo) alert('오랫동안 접속하지 않아 방이 삭제되었습니다.');
        else alert('존재하지 않는 방입니다. 로비로 이동합니다.');
        router.push('/main-lobby');
      }
    };
    if (isConnected && accessToken && isSubscribed) {
      fetchData();
    }
  }, [isConnected, isSubscribed, accessToken]);

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
        <p className={`${styles.descriptionText} ${styles.textEllipsis}`}>
          {data.description}
        </p>
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
